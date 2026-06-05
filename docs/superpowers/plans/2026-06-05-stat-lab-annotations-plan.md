# Stat-Lab 标注与笔记功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Stat-Lab 所有学科的知识点和测验页面添加文字划线标注和卡片备注功能。

**Architecture:** 新建 `shared/js/annotations.js`（~450 行）包含全局 `AnnotationSystem` 对象，含 TextOffsetIndexer、AnnotationManager、MiniToolbar、SidePanel 四个内部模块。数据通过 EcoStore 模式持久化到 `localStorage('statlab_annots')`。CSS 追加到 `shared/css/components.css`（~180 行）。

**Tech Stack:** 纯静态 HTML/CSS/JS，零框架零依赖，`var` 全局变量模式，localStorage 持久化。

**Spec:** `docs/superpowers/specs/2026-06-05-stat-lab-annotations-design.md`

---

## 文件结构

| 文件 | 改动 | 行数 |
|------|------|------|
| `shared/js/annotations.js` | **新建** | ~450 |
| `shared/css/components.css` | 追加 | ~180 |
| `subjects/stat-comp/knowledge/s4-dist.html` ~ `s8-unsupervised.html` | 加 script 标签 + init 调用 | 每文件 +2 行 |
| `subjects/econstats/knowledge/ch1-gdp.html` ~ `ch8-macro-overview.html` | 加 script 标签 + init 调用 | 每文件 +2 行 |
| `subjects/stat-comp/quiz/s4-dist.html` ~ `s8-unsupervised.html` | 加 script 标签 + init 调用 | 每文件 +2 行 |
| `subjects/econstats/quiz/ch1-gdp.html` ~ `ch8-macro-overview.html` | 加 script 标签 + init 调用 | 每文件 +2 行 |

**关键设计决策：**
- 所有模块放在 `annotations.js` 一个文件中，遵循项目现有风格（`router.js`、`quiz-engine.js` 均如此）
- 每页独立加载当前页面的标注数据（按 pagePath 分组查 localStorage），避免全量读取
- KaTeX 公式特殊处理：DFS 递归提取可见文本，跳过 `.strut`，`.mspace` 映射为空格
- 恢复标注时操作叶文本节点层级的 Range，不破坏 KaTeX DOM 结构

---

### Task 1: 创建 annotations.js — 骨架 + TextOffsetIndexer

**Files:**
- Create: `shared/js/annotations.js`

- [ ] **Step 1: 创建文件骨架和 AnnotationSystem 外层对象**

```js
/**
 * Stat-Lab 标注与笔记系统
 * 
 * 功能：文本划线标注（高亮/下划线/波浪线 + 5色）+ 卡片备注 + 侧边栏管理
 * 
 * 架构：
 *   TextOffsetIndexer — 全局文本偏移索引，偏移↔DOM 互查
 *   AnnotationManager — CRUD + localStorage 持久化
 *   MiniToolbar       — 选中文字浮动工具栏
 *   SidePanel         — 右侧滑出面板（搜索/筛选/导出）
 */

var AnnotationSystem = {
  _textMap: [],        // [{char, node, offset}] — 全局文本流
  _pagePath: '',
  _containerSel: '',
  _annots: [],         // 当前页标注列表（同步自 localStorage）
  _toolbar: null,
  _panel: null,
  _overlay: null,
  _TOOLBAR_ID: 'ann-toolbar',
  _PANEL_ID: 'ann-panel',
  _OVERLAY_ID: 'ann-overlay',
  _STORAGE_KEY: 'statlab_annots',
  _NOTE_ICON: '💬',

  // ========== 入口 ==========

  /**
   * 初始化标注系统
   * @param {string} pagePath - 形如 'subjects/stat-comp/knowledge/s4-dist/'
   * @param {string} containerSel - 可标注内容容器选择器，默认 '#content-area'
   */
  init: function(pagePath, containerSel) {
    var self = this;
    try {
      if (!pagePath) { console.warn('[AnnotationSystem] pagePath 为空，跳过初始化'); return; }
      self._pagePath = pagePath;
      self._containerSel = containerSel || '#content-area, #quiz-container';
      self._load();
      self._buildIndex();
      self._restoreAnnotations();
      self._listenMouseUp();
      self._createPanelDOM();
      self._createFloatingBtn();
      console.log('[AnnotationSystem] 初始化完成: ' + pagePath + ' (' + self._annots.length + ' 条标注)');
    } catch(e) {
      console.error('[AnnotationSystem] 初始化失败:', e.message);
    }
  },

  // ========== TextOffsetIndexer ==========

  /**
   * 构建全局文本偏移索引
   * 遍历容器内所有可标注节点，提取文本并建立 char→DOM 映射
   */
  _buildIndex: function() {
    var self = this;
    self._textMap = [];
    var containers = document.querySelectorAll(self._containerSel);
    containers.forEach(function(container) {
      self._walkTextNodes(container);
    });
  },

  /**
   * 递归遍历 DOM 树，收集文本节点和 KaTeX 节点
   */
  _walkTextNodes: function(node) {
    var self = this;
    if (!node) return;

    // 跳过标注系统自身的 DOM（工具栏、面板、💬图标）
    if (node.id === self._TOOLBAR_ID || node.id === self._PANEL_ID || node.id === self._OVERLAY_ID) return;
    if (node.closest && (node.closest('#' + self._TOOLBAR_ID) || node.closest('#' + self._PANEL_ID) || node.closest('#' + self._OVERLAY_ID))) return;

    // 跳过脚本和样式标签
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT') return;

    // KaTeX 公式：特殊提取
    if (node.nodeType === 1 && node.classList && (node.classList.contains('katex') || node.classList.contains('katex-html'))) {
      self._extractKatexText(node);
      return;
    }

    // 文本节点
    if (node.nodeType === 3) {
      var text = node.textContent || '';
      for (var i = 0; i < text.length; i++) {
        self._textMap.push({ char: text[i], node: node, offset: i });
      }
      return;
    }

    // 元素节点：递归子节点，跳过不可见/布局节点
    if (node.nodeType === 1) {
      // 跳过 KaTeX 的隐藏占位符
      if (node.classList && node.classList.contains('strut')) return;
      // 跳过空的 KaTeX 间距
      if (node.classList && (node.classList.contains('mspace') || node.classList.contains('katex-display'))) {
        self._textMap.push({ char: ' ', node: null, offset: -1 });
        return;
      }
      // 跳过 code 块内的注释标记（但保留 code 内文本）
      // 跳过标注系统的 <mark> 元素（它们是我们自己插入的）
      if (node.tagName === 'MARK' && node.classList && node.classList.contains('ann-highlight')) return;
      if (node.tagName === 'MARK' && node.classList && node.classList.contains('ann-underline')) return;
      if (node.tagName === 'MARK' && node.classList && node.classList.contains('ann-wavy')) return;
      // 递归
      for (var c = node.firstChild; c; c = c.nextSibling) {
        self._walkTextNodes(c);
      }
    }
  },

  /**
   * KaTeX 公式特殊文本提取
   * DFS 递归 katex-html 子树，跳过 .strut，映射 .mspace 为空格
   */
  _extractKatexText: function(katexEl) {
    var self = this;
    var html = katexEl.querySelector('.katex-html');
    if (!html) return;

    function dfs(el) {
      if (!el) return;
      // 文本节点
      if (el.nodeType === 3) {
        var t = el.textContent || '';
        for (var i = 0; i < t.length; i++) {
          self._textMap.push({ char: t[i], node: el, offset: i });
        }
        return;
      }
      if (el.nodeType !== 1) return;
      // 跳过隐藏 strut
      if (el.classList && el.classList.contains('strut')) return;
      // 间距 → 空格（只添加一个，避免重复）
      if (el.classList && el.classList.contains('mspace')) {
        self._textMap.push({ char: ' ', node: null, offset: -1 });
        return;
      }
      // 叶子元素：有 textContent 但无子元素 → 直接提取
      if (!el.firstChild && el.textContent) {
        var t2 = el.textContent;
        for (var j = 0; j < t2.length; j++) {
          self._textMap.push({ char: t2[j], node: el, offset: j });
        }
        return;
      }
      // 有子元素的 span → 递归
      for (var c = el.firstChild; c; c = c.nextSibling) {
        dfs(c);
      }
    }

    dfs(html);
  },

  /**
   * 根据全局偏移获取对应的 DOM Range
   */
  getRangeForOffsets: function(startOffset, endOffset) {
    if (startOffset < 0 || endOffset > this._textMap.length || startOffset >= endOffset) return null;
    try {
      var startEntry = this._textMap[startOffset];
      var endEntry = this._textMap[endOffset - 1];
      if (!startEntry || !startEntry.node) return null;
      if (!endEntry || !endEntry.node) return null;

      var range = document.createRange();
      range.setStart(startEntry.node, startEntry.offset);
      range.setEnd(endEntry.node, endEntry.offset + 1);  // +1 因为 endOffset 是排他的
      return range;
    } catch(e) {
      console.warn('[AnnotationSystem] getRangeForOffsets 失败:', e.message);
      return null;
    }
  },

  /**
   * 通过文本偏移查找在 _textMap 中的位置
   * 把 Selection 的 start/end 偏移映射到全局偏移
   */
  _findOffsetsFromSelection: function(selection) {
    var self = this;
    if (!selection || selection.isCollapsed) return null;

    var range = selection.getRangeAt(0);
    var startNode = range.startContainer;
    var startOff = range.startOffset;
    var endNode = range.endContainer;
    var endOff = range.endOffset;

    var globalStart = -1, globalEnd = -1;

    for (var i = 0; i < self._textMap.length; i++) {
      var entry = self._textMap[i];
      if (globalStart === -1 && entry.node === startNode && entry.offset >= startOff) {
        globalStart = i;
      }
      if (entry.node === endNode && entry.offset >= endOff - 1 && entry.offset <= endOff) {
        globalEnd = i + 1;
      }
    }

    // 如果没有精确匹配（跨节点选中），使用宽松匹配
    if (globalStart === -1) {
      for (var j = 0; j < self._textMap.length; j++) {
        if (self._textMap[j].node === startNode) {
          globalStart = j; break;
        }
      }
    }
    if (globalEnd === -1) {
      for (var k = self._textMap.length - 1; k >= 0; k--) {
        if (self._textMap[k].node === endNode) {
          globalEnd = k + 1; break;
        }
      }
    }

    if (globalStart === -1 || globalEnd === -1 || globalStart >= globalEnd) return null;
    return { start: globalStart, end: globalEnd };
  }
};
```

- [ ] **Step 2: 检查语法**

```bash
node -e "var fs=require('fs'); var code=fs.readFileSync('shared/js/annotations.js','utf8'); new Function(code); console.log('Syntax OK')"
```

Expected: `Syntax OK`

---

### Task 2: 添加 AnnotationManager（CRUD + localStorage）

**Files:**
- Modify: `shared/js/annotations.js` — 追加在 `_findOffsetsFromSelection` 之后

- [ ] **Step 1: 追加 AnnotationManager 方法**

在 `annotations.js` 的 `_findOffsetsFromSelection` 方法后追加：

```js

  // ========== AnnotationManager ==========

  /**
   * 从 localStorage 加载当前页面的标注列表
   */
  _load: function() {
    var self = this;
    try {
      var all = JSON.parse(localStorage.getItem(self._STORAGE_KEY) || '{}');
      self._annots = all[self._pagePath] || [];
    } catch(e) {
      self._annots = [];
    }
  },

  /**
   * 把当前页面的标注列表保存到 localStorage
   */
  _save: function() {
    var self = this;
    try {
      var all = JSON.parse(localStorage.getItem(self._STORAGE_KEY) || '{}');
      all[self._pagePath] = self._annots;
      localStorage.setItem(self._STORAGE_KEY, JSON.stringify(all));
    } catch(e) {
      console.warn('[AnnotationSystem] 保存失败:', e.message);
    }
  },

  /**
   * 添加一条新标注
   */
  addAnnotation: function(startOffset, endOffset, text, style, color, note) {
    var self = this;
    var id = 'ann_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    var now = new Date().toISOString();
    var ann = {
      id: id,
      pagePath: self._pagePath,
      startOffset: startOffset,
      endOffset: endOffset,
      text: text,
      style: style || 'highlight',
      color: color || '#fef08a',
      note: note || '',
      tags: [],
      createdAt: now,
      updatedAt: now
    };

    // 检查是否与已有标注重叠
    var overlap = false;
    for (var i = 0; i < self._annots.length; i++) {
      var a = self._annots[i];
      if (!(endOffset <= a.startOffset || startOffset >= a.endOffset)) {
        overlap = true; break;
      }
    }
    if (overlap) {
      // 移除重叠的旧标注
      self._annots = self._annots.filter(function(a) {
        return (endOffset <= a.startOffset || startOffset >= a.endOffset);
      });
    }

    self._annots.push(ann);
    self._save();
    self._renderAnnotation(ann);
    self._updateFloatingBtnBadge();
    return ann;
  },

  /**
   * 删除标注（从数据和 DOM 中移除）
   */
  removeAnnotation: function(id) {
    var self = this;
    // 从 DOM 中移除
    var mark = document.querySelector('mark[data-ann-id="' + id + '"]');
    if (mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
    }
    // 从数据中移除
    self._annots = self._annots.filter(function(a) { return a.id !== id; });
    self._save();
    self._updateFloatingBtnBadge();
    self._refreshPanel();
  },

  /**
   * 更新标注属性
   */
  updateAnnotation: function(id, changes) {
    var self = this;
    for (var i = 0; i < self._annots.length; i++) {
      if (self._annots[i].id === id) {
        var allowed = ['style', 'color', 'note', 'tags'];
        for (var j = 0; j < allowed.length; j++) {
          var k = allowed[j];
          if (changes[k] !== undefined) self._annots[i][k] = changes[k];
        }
        self._annots[i].updatedAt = new Date().toISOString();
        break;
      }
    }
    self._save();
    // 更新 DOM 中的 mark 样式
    var mark = document.querySelector('mark[data-ann-id="' + id + '"]');
    if (mark) {
      var ann = self._annots.filter(function(a) { return a.id === id; })[0];
      if (ann) self._applyMarkStyle(mark, ann);
    }
    self._refreshPanel();
  },

  /**
   * 在 DOM 中渲染一条标注（包裹 <mark> 到文本节点）
   */
  _renderAnnotation: function(ann) {
    var self = this;
    var range = self.getRangeForOffsets(ann.startOffset, ann.endOffset);
    if (!range) return;
    try {
      var mark = document.createElement('mark');
      mark.setAttribute('data-ann-id', ann.id);
      self._applyMarkStyle(mark, ann);
      range.surroundContents(mark);
    } catch(e) {
      // surroundContents 跨节点失败时，使用 extractContents 方案
      try {
        var mark2 = document.createElement('mark');
        mark2.setAttribute('data-ann-id', ann.id);
        self._applyMarkStyle(mark2, ann);
        var frag = range.extractContents();
        mark2.appendChild(frag);
        range.insertNode(mark2);
      } catch(e2) {
        console.warn('[AnnotationSystem] 渲染标注失败:', e2.message);
      }
    }
  },

  /**
   * 给 mark 元素应用样式和类名
   */
  _applyMarkStyle: function(mark, ann) {
    mark.className = '';
    var cls = ann.style === 'underline' ? 'ann-underline' : ann.style === 'wavy' ? 'ann-wavy' : 'ann-highlight';
    mark.classList.add(cls);
    mark.style.setProperty('--ann-color', ann.color);
    if (ann.style === 'highlight') {
      mark.style.backgroundColor = ann.color;
      mark.style.borderRadius = '2px';
      mark.style.padding = '0 1px';
      mark.style.color = 'inherit';
    } else {
      mark.style.backgroundColor = 'transparent';
      mark.style.textDecorationColor = ann.color;
      mark.style.color = 'inherit';
    }
    if (ann.note) {
      mark.classList.add('ann-has-note');
    }
  },

  /**
   * 页面加载时恢复所有标注
   */
  _restoreAnnotations: function() {
    var self = this;
    // 按偏移量降序排序，从后往前渲染，避免偏移量变化
    var sorted = self._annots.slice().sort(function(a, b) { return b.startOffset - a.startOffset; });
    for (var i = 0; i < sorted.length; i++) {
      self._renderAnnotation(sorted[i]);
    }
  },

  /**
   * 获取当前页所有标注
   */
  getPageAnnotations: function() {
    return this._annots.slice();
  },

  /**
   * 全站标注搜索（跨页面）
   */
  searchAllAnnotations: function(query, filters) {
    var self = this;
    try {
      var all = JSON.parse(localStorage.getItem(self._STORAGE_KEY) || '{}');
      var results = [];
      for (var path in all) {
        if (!all.hasOwnProperty(path)) continue;
        var list = all[path];
        for (var i = 0; i < list.length; i++) {
          var a = list[i];
          // 过滤样式
          if (filters && filters.style && filters.style !== 'all' && a.style !== filters.style) continue;
          // 过滤颜色
          if (filters && filters.color && filters.color !== 'all' && a.color !== filters.color) continue;
          // 搜索
          if (query) {
            var q = query.toLowerCase();
            var inText = (a.text || '').toLowerCase().indexOf(q) !== -1;
            var inNote = (a.note || '').toLowerCase().indexOf(q) !== -1;
            if (!inText && !inNote) continue;
          }
          results.push(a);
        }
      }
      return results;
    } catch(e) {
      return [];
    }
  }
```

- [ ] **Step 2: 语法检查**

```bash
node -e "var fs=require('fs'); var code=fs.readFileSync('shared/js/annotations.js','utf8'); new Function(code); console.log('Syntax OK')"
```

Expected: `Syntax OK`

---

### Task 3: 添加 MiniToolbar（浮动工具栏）

**Files:**
- Modify: `shared/js/annotations.js` — 追加在 AnnotationManager 方法之后

- [ ] **Step 1: 追加 MiniToolbar 方法**

```js

  // ========== MiniToolbar ==========

  /**
   * 监听 mouseup，检测选区并在可标注区域显示工具栏
   */
  _listenMouseUp: function() {
    var self = this;
    document.addEventListener('mouseup', function(e) {
      setTimeout(function() {
        self._onMouseUp(e);
      }, 10); // 延迟确保 selection 已更新
    });
  },

  _onMouseUp: function(e) {
    var self = this;
    // 忽略工具栏内部的点击
    if (e.target.closest && e.target.closest('#' + self._TOOLBAR_ID)) return;

    var selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      // 点击空白处关闭工具栏（但延迟检查，避免工具栏自己的事件先触发）
      setTimeout(function() {
        if (!self._toolbarHovered) self._hideToolbar();
      }, 200);
      return;
    }

    var text = selection.toString().trim();
    if (!text) { self._hideToolbar(); return; }

    // 检查选区是否在可标注容器内
    var container = document.querySelector(self._containerSel);
    if (!container) return;
    var range = selection.getRangeAt(0);
    var commonAncestor = range.commonAncestorContainer;
    if (!container.contains(commonAncestor)) return;

    // 查找选区的全局偏移
    var offsets = self._findOffsetsFromSelection(selection);
    if (!offsets) return;

    // 检查选区是否与已有标注重叠
    var existing = null;
    for (var i = 0; i < self._annots.length; i++) {
      var a = self._annots[i];
      if (!(offsets.end <= a.startOffset || offsets.start >= a.endOffset)) {
        existing = a; break;
      }
    }

    // 显示工具栏
    var rect = range.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top - 12; // 选区上方
    self._showToolbar(x, y, offsets, text, existing);
  },

  /**
   * 显示工具栏
   */
  _showToolbar: function(x, y, offsets, text, existing) {
    var self = this;
    self._hideToolbar();

    var tb = document.createElement('div');
    tb.id = self._TOOLBAR_ID;
    tb.className = 'ann-toolbar';
    tb.setAttribute('data-start', offsets.start);
    tb.setAttribute('data-end', offsets.end);
    tb.setAttribute('data-text', text);

    var colors = [
      { val: '#fef08a', label: '黄' },
      { val: '#bbf7d0', label: '绿' },
      { val: '#fecaca', label: '红' },
      { val: '#e9d5ff', label: '紫' },
      { val: '#fed7aa', label: '橙' }
    ];

    var currentStyle = existing ? existing.style : 'highlight';
    var currentColor = existing ? existing.color : '#fef08a';
    var currentNote = existing ? (existing.note || '') : '';

    // 样式行
    var styleRow = '';
    var styles = [
      { val: 'highlight', label: '高亮' },
      { val: 'underline', label: '下划线' },
      { val: 'wavy', label: '波浪线' }
    ];
    for (var s = 0; s < styles.length; s++) {
      var st = styles[s];
      var active = st.val === currentStyle ? ' active' : '';
      styleRow += '<button class="ann-style-btn' + active + '" data-style="' + st.val + '">' + st.label + '</button>';
    }

    // 颜色行
    var colorRow = '';
    for (var c = 0; c < colors.length; c++) {
      var cl = colors[c];
      var sel = cl.val === currentColor ? ' ann-color-sel' : '';
      colorRow += '<span class="ann-color-dot' + sel + '" data-color="' + cl.val + '" style="background:' + cl.val + '"></span>';
    }

    // 备注行
    var hasNote = currentNote ? ' show' : '';
    var noteHtml = '' +
      '<div class="ann-note-area' + hasNote + '">' +
        '<input class="ann-note-input" type="text" placeholder="💬 添加备注... (回车保存)" value="' + self._escAttr(currentNote) + '">' +
      '</div>';

    // 操作按钮（编辑/删除模式）
    var actionRow = '';
    if (existing) {
      actionRow = '' +
        '<div class="ann-action-row">' +
          '<button class="ann-delete-btn" data-action="delete">🗑 删除</button>' +
        '</div>';
    }

    tb.innerHTML = '' +
      '<div class="ann-tb-style-row">' + styleRow + '</div>' +
      '<div class="ann-tb-color-row">' + colorRow + '</div>' +
      noteHtml + actionRow;

    // 绑定事件
    self._bindToolbarEvents(tb, offsets, text, existing);

    document.body.appendChild(tb);

    // 定位
    var tbRect = tb.getBoundingClientRect();
    var finalX = x - tbRect.width / 2;
    var finalY = y - tbRect.height;
    // 边界调整
    if (finalX < 8) finalX = 8;
    if (finalX + tbRect.width > window.innerWidth - 8) finalX = window.innerWidth - tbRect.width - 8;
    if (finalY < 8) finalY = 8;
    tb.style.left = finalX + 'px';
    tb.style.top = finalY + 'px';

    // 鼠标悬停标记
    tb.addEventListener('mouseenter', function() { self._toolbarHovered = true; });
    tb.addEventListener('mouseleave', function() { self._toolbarHovered = false; });
  },

  /**
   * 隐藏工具栏
   */
  _hideToolbar: function() {
    var tb = document.getElementById(this._TOOLBAR_ID);
    if (tb) { tb.remove(); this._toolbar = null; }
  },

  /**
   * 绑定工具栏事件
   */
  _bindToolbarEvents: function(tb, offsets, text, existing) {
    var self = this;

    // 样式按钮
    var styleBtns = tb.querySelectorAll('.ann-style-btn');
    for (var i = 0; i < styleBtns.length; i++) {
      styleBtns[i].addEventListener('click', function() {
        var style = this.getAttribute('data-style');
        var color = tb.querySelector('.ann-color-sel');
        var col = color ? color.getAttribute('data-color') : '#fef08a';
        if (existing) {
          self.updateAnnotation(existing.id, { style: style, color: col });
        } else {
          self.addAnnotation(offsets.start, offsets.end, text, style, col, '');
        }
        // 更新工具栏 UI
        tb.querySelectorAll('.ann-style-btn').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
      });
    }

    // 颜色圆点
    var colorDots = tb.querySelectorAll('.ann-color-dot');
    for (var j = 0; j < colorDots.length; j++) {
      colorDots[j].addEventListener('click', function() {
        var col = this.getAttribute('data-color');
        tb.querySelectorAll('.ann-color-dot').forEach(function(d) { d.classList.remove('ann-color-sel'); });
        this.classList.add('ann-color-sel');
        var styleBtn = tb.querySelector('.ann-style-btn.active');
        var style = styleBtn ? styleBtn.getAttribute('data-style') : 'highlight';
        if (existing) {
          self.updateAnnotation(existing.id, { color: col, style: style });
        } else {
          self.addAnnotation(offsets.start, offsets.end, text, style, col, '');
        }
      });
    }

    // 备注输入
    var noteInput = tb.querySelector('.ann-note-input');
    if (noteInput) {
      noteInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var noteVal = this.value.trim();
          if (existing) {
            self.updateAnnotation(existing.id, { note: noteVal });
          } else {
            var col = (tb.querySelector('.ann-color-sel') || {}).getAttribute('data-color') || '#fef08a';
            var styleBtn = tb.querySelector('.ann-style-btn.active');
            var style = styleBtn ? styleBtn.getAttribute('data-style') : 'highlight';
            self.addAnnotation(offsets.start, offsets.end, text, style, col, noteVal);
          }
          self._refreshPanel();
          // 更新 💬 图标
          var lastAnn = self._annots[self._annots.length - 1];
          if (lastAnn && lastAnn.note) {
            var mark = document.querySelector('mark[data-ann-id="' + lastAnn.id + '"]');
            if (mark) mark.classList.add('ann-has-note');
          }
        }
      });
      // 点击备注输入区也展开它
      noteInput.addEventListener('focus', function() {
        tb.querySelector('.ann-note-area').classList.add('show');
      });
    }

    // 删除按钮
    var delBtn = tb.querySelector('.ann-delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', function() {
        if (existing && confirm('确定删除此标注？')) {
          self.removeAnnotation(existing.id);
          self._hideToolbar();
        }
      });
    }

    // 点击空白区域关闭
    var docClick = function(e) {
      if (!tb.contains(e.target)) {
        self._hideToolbar();
        document.removeEventListener('click', docClick);
      }
    };
    setTimeout(function() {
      document.addEventListener('click', docClick);
    }, 50);
  },

  _escAttr: function(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
```

- [ ] **Step 2: 语法检查**

```bash
node -e "var fs=require('fs'); var code=fs.readFileSync('shared/js/annotations.js','utf8'); new Function(code); console.log('Syntax OK')"
```

Expected: `Syntax OK`

---

### Task 4: 添加 SidePanel（侧边面板 + 导出）

**Files:**
- Modify: `shared/js/annotations.js` — 追加在 MiniToolbar 方法之后

- [ ] **Step 1: 追加 SidePanel 方法**

```js

  // ========== SidePanel ==========

  /**
   * 创建侧边栏 DOM（初始隐藏）
   */
  _createPanelDOM: function() {
    var self = this;

    // 遮罩
    var overlay = document.createElement('div');
    overlay.id = self._OVERLAY_ID;
    overlay.className = 'ann-overlay';
    overlay.addEventListener('click', function() { self._closePanel(); });
    document.body.appendChild(overlay);

    // 面板
    var panel = document.createElement('div');
    panel.id = self._PANEL_ID;
    panel.className = 'ann-panel';
    var colors = ['#fef08a', '#bbf7d0', '#fecaca', '#e9d5ff', '#fed7aa'];
    panel.innerHTML = '' +
      '<div class="ann-panel-header">' +
        '<span class="ann-panel-title">📝 我的笔记</span>' +
        '<div class="ann-panel-header-actions">' +
          '<button class="ann-export-btn" title="导出">⬇ 导出</button>' +
          '<div class="ann-export-menu" style="display:none;">' +
            '<button data-export="json">📄 JSON</button>' +
            '<button data-export="markdown">📝 Markdown</button>' +
          '</div>' +
          '<button class="ann-close-btn" title="关闭">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="ann-panel-search">' +
        '<input type="text" class="ann-search-input" placeholder="🔍 搜索笔记...">' +
      '</div>' +
      '<div class="ann-panel-filters">' +
        '<select class="ann-filter-style">' +
          '<option value="all">全部样式</option>' +
          '<option value="highlight">高亮</option>' +
          '<option value="underline">下划线</option>' +
          '<option value="wavy">波浪线</option>' +
        '</select>' +
        '<select class="ann-filter-color">' +
          '<option value="all">全部颜色</option>' +
          '<option value="' + colors[0] + '">🟡 黄色</option>' +
          '<option value="' + colors[1] + '">🟢 绿色</option>' +
          '<option value="' + colors[2] + '">🔴 红色</option>' +
          '<option value="' + colors[3] + '">🟣 紫色</option>' +
          '<option value="' + colors[4] + '">🟠 橙色</option>' +
        '</select>' +
      '</div>' +
      '<div class="ann-panel-list" id="ann-panel-list"></div>' +
      '<div class="ann-panel-footer">' +
        '<label class="ann-select-all"><input type="checkbox" class="ann-select-all-cb"> 全选</label>' +
        '<span class="ann-selected-count">已选 0 条</span>' +
        '<button class="ann-batch-delete" disabled>🗑 删除选中</button>' +
        '<button class="ann-batch-export" disabled>📥 导出选中</button>' +
      '</div>';
    document.body.appendChild(panel);

    self._panel = panel;
    self._overlay = overlay;

    // 绑定搜索
    var searchInput = panel.querySelector('.ann-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() { self._renderPanelList(); });
    }

    // 绑定筛选
    var filterStyle = panel.querySelector('.ann-filter-style');
    var filterColor = panel.querySelector('.ann-filter-color');
    if (filterStyle) filterStyle.addEventListener('change', function() { self._renderPanelList(); });
    if (filterColor) filterColor.addEventListener('change', function() { self._renderPanelList(); });

    // 绑定导出按钮
    var exportBtn = panel.querySelector('.ann-export-btn');
    var exportMenu = panel.querySelector('.ann-export-menu');
    if (exportBtn && exportMenu) {
      exportBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        exportMenu.style.display = exportMenu.style.display === 'none' ? 'block' : 'none';
      });
      exportMenu.querySelectorAll('button').forEach(function(b) {
        b.addEventListener('click', function(e) {
          e.stopPropagation();
          var fmt = this.getAttribute('data-export');
          self.exportAnnotations(fmt);
          exportMenu.style.display = 'none';
        });
      });
      document.addEventListener('click', function() { exportMenu.style.display = 'none'; });
    }

    // 绑定关闭
    var closeBtn = panel.querySelector('.ann-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', function() { self._closePanel(); });

    // 绑定底部按钮
    var selectAllCb = panel.querySelector('.ann-select-all-cb');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', function() {
        var cbs = panel.querySelectorAll('.ann-item-cb');
        cbs.forEach(function(cb) { cb.checked = selectAllCb.checked; });
        self._updateFooterButtons();
      });
    }

    var batchDel = panel.querySelector('.ann-batch-delete');
    if (batchDel) {
      batchDel.addEventListener('click', function() {
        var cbs = panel.querySelectorAll('.ann-item-cb:checked');
        if (cbs.length === 0) return;
        if (confirm('确定删除选中的 ' + cbs.length + ' 条标注？')) {
          cbs.forEach(function(cb) {
            self.removeAnnotation(cb.getAttribute('data-ann-id'));
          });
          self._renderPanelList();
        }
      });
    }

    var batchExp = panel.querySelector('.ann-batch-export');
    if (batchExp) {
      batchExp.addEventListener('click', function() {
        var cbs = panel.querySelectorAll('.ann-item-cb:checked');
        var ids = [];
        cbs.forEach(function(cb) { ids.push(cb.getAttribute('data-ann-id')); });
        self.exportAnnotations('markdown', ids);
      });
    }

    // Escape 关闭
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && self._panel.classList.contains('open')) {
        self._closePanel();
      }
    });
  },

  /**
   * 创建右下角浮动按钮
   */
  _createFloatingBtn: function() {
    var self = this;
    var btn = document.createElement('button');
    btn.className = 'ann-floating-btn';
    btn.title = '我的笔记';
    btn.innerHTML = '📝<span class="ann-badge" id="ann-floating-badge"></span>';
    btn.addEventListener('click', function() { self._openPanel(); });
    document.body.appendChild(btn);
    self._updateFloatingBtnBadge();
  },

  _updateFloatingBtnBadge: function() {
    var badge = document.getElementById('ann-floating-badge');
    if (badge) {
      badge.textContent = this._annots.length > 0 ? this._annots.length : '';
      badge.style.display = this._annots.length > 0 ? 'inline' : 'none';
    }
  },

  /**
   * 打开侧边栏
   */
  _openPanel: function(scrollToId) {
    var self = this;
    self._renderPanelList(scrollToId);
    self._panel.classList.add('open');
    self._overlay.classList.add('open');
  },

  /**
   * 关闭侧边栏
   */
  _closePanel: function() {
    this._panel.classList.remove('open');
    this._overlay.classList.remove('open');
  },

  /**
   * 刷新面板内容
   */
  _refreshPanel: function() {
    if (this._panel.classList.contains('open')) {
      this._renderPanelList();
    }
  },

  /**
   * 渲染面板列表
   */
  _renderPanelList: function(scrollToId) {
    var self = this;
    var list = self._panel.querySelector('#ann-panel-list');
    if (!list) return;

    // 获取筛选条件
    var query = (self._panel.querySelector('.ann-search-input') || {}).value || '';
    var filterStyle = (self._panel.querySelector('.ann-filter-style') || {}).value || 'all';
    var filterColor = (self._panel.querySelector('.ann-filter-color') || {}).value || 'all';

    // 筛选当前页标注
    var filtered = self._annots.slice();
    if (query) {
      var q = query.toLowerCase();
      filtered = filtered.filter(function(a) {
        return (a.text || '').toLowerCase().indexOf(q) !== -1 || (a.note || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filterStyle !== 'all') {
      filtered = filtered.filter(function(a) { return a.style === filterStyle; });
    }
    if (filterColor !== 'all') {
      filtered = filtered.filter(function(a) { return a.color === filterColor; });
    }

    // 渲染
    if (filtered.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:32px;color:#64748b;font-size:0.9rem;">暂无笔记<br><span style="font-size:0.8rem;">选中文字开始标注吧 ✍️</span></div>';
    } else {
      var html = '<div class="ann-card-list">';
      for (var i = 0; i < filtered.length; i++) {
        var ann = filtered[i];
        var notePreview = (ann.note || '').substring(0, 80);
        if ((ann.note || '').length > 80) notePreview += '...';
        html += '' +
          '<div class="ann-card' + (ann.id === scrollToId ? ' ann-card-flash' : '') + '" data-ann-id="' + ann.id + '">' +
            '<input type="checkbox" class="ann-item-cb" data-ann-id="' + ann.id + '">' +
            '<span class="ann-card-color" style="background:' + ann.color + '"></span>' +
            '<div class="ann-card-body">' +
              '<div class="ann-card-text">' + self._escHtml(ann.text.substring(0, 60)) + (ann.text.length > 60 ? '...' : '') + '</div>' +
              (ann.note ? '<div class="ann-card-note">' + self._escHtml(notePreview) + '</div>' : '') +
              '<div class="ann-card-meta">' +
                '<span class="ann-card-style">' + (ann.style === 'highlight' ? '高亮' : ann.style === 'underline' ? '下划线' : '波浪线') + '</span>' +
                '<span class="ann-card-date">' + (ann.createdAt || '').substring(0, 10) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="ann-card-actions">' +
              '<button class="ann-card-edit" title="编辑备注" data-edit="' + ann.id + '">✎</button>' +
              '<button class="ann-card-del" title="删除" data-del="' + ann.id + '">🗑</button>' +
            '</div>' +
          '</div>';
      }
      html += '</div>';
      list.innerHTML = html;
    }

    // 绑定卡片事件
    self._bindCardEvents();
    self._updateFooterButtons();
  },

  /**
   * 绑定卡片点击/编辑/删除事件
   */
  _bindCardEvents: function() {
    var self = this;

    // 点击卡片跳转
    var cards = self._panel.querySelectorAll('.ann-card');
    cards.forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        var id = this.getAttribute('data-ann-id');
        var ann = self._annots.filter(function(a) { return a.id === id; })[0];
        if (ann) {
          // 滚动到标注位置
          var mark = document.querySelector('mark[data-ann-id="' + id + '"]');
          if (mark) {
            self._closePanel();
            setTimeout(function() {
              mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // 闪烁动画
              mark.style.transition = 'box-shadow 0.3s';
              mark.style.boxShadow = '0 0 0 3px ' + ann.color;
              setTimeout(function() { mark.style.boxShadow = 'none'; }, 1200);
            }, 300);
          }
        }
      });
    });

    // Checkbox
    var cbs = self._panel.querySelectorAll('.ann-item-cb');
    cbs.forEach(function(cb) {
      cb.addEventListener('click', function(e) { e.stopPropagation(); self._updateFooterButtons(); });
    });

    // 编辑备注
    var editBtns = self._panel.querySelectorAll('.ann-card-edit');
    editBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = this.getAttribute('data-edit');
        var ann = self._annots.filter(function(a) { return a.id === id; })[0];
        if (!ann) return;
        var newNote = prompt('编辑备注：', ann.note || '');
        if (newNote !== null) {
          self.updateAnnotation(id, { note: newNote });
          var mark = document.querySelector('mark[data-ann-id="' + id + '"]');
          if (mark) {
            if (newNote.trim()) mark.classList.add('ann-has-note');
            else mark.classList.remove('ann-has-note');
          }
          self._refreshPanel();
        }
      });
    });

    // 删除
    var delBtns = self._panel.querySelectorAll('.ann-card-del');
    delBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = this.getAttribute('data-del');
        if (confirm('确定删除此标注？')) {
          self.removeAnnotation(id);
          self._refreshPanel();
        }
      });
    });
  },

  _updateFooterButtons: function() {
    var panel = this._panel;
    var cbs = panel.querySelectorAll('.ann-item-cb:checked');
    var count = cbs.length;
    var countSpan = panel.querySelector('.ann-selected-count');
    var delBtn = panel.querySelector('.ann-batch-delete');
    var expBtn = panel.querySelector('.ann-batch-export');
    if (countSpan) countSpan.textContent = '已选 ' + count + ' 条';
    if (delBtn) delBtn.disabled = count === 0;
    if (expBtn) expBtn.disabled = count === 0;
  },

  // ========== Export ==========

  /**
   * 导出标注
   * @param {string} format - 'json' 或 'markdown'
   * @param {string[]} ids - 可选的标注 ID 列表，不传则导出全部
   */
  exportAnnotations: function(format, ids) {
    var self = this;
    var data = ids ? self._annots.filter(function(a) { return ids.indexOf(a.id) !== -1; }) : self._annots.slice();
    
    if (format === 'json') {
      var json = JSON.stringify(data, null, 2);
      self._downloadBlob(json, 'application/json', 'statlab-annotations.json');
    } else if (format === 'markdown') {
      var md = '# 📝 学习笔记\n\n';
      md += '> 导出时间：' + new Date().toLocaleString() + '\n';
      md += '> 页面：' + self._pagePath + '\n\n---\n\n';
      for (var i = 0; i < data.length; i++) {
        var a = data[i];
        md += '### ' + (a.note ? '📝 ' : '🔖 ') + (a.text.substring(0, 50) || '(无文字)') + '\n';
        md += '> **原始文本：** ' + a.text + '\n';
        md += '> **样式：** ' + (a.style === 'highlight' ? '高亮' : a.style === 'underline' ? '下划线' : '波浪线') + '\n';
        md += '> **创建时间：** ' + (a.createdAt || '').substring(0, 10) + '\n';
        if ((a.tags || []).length > 0) {
          md += '> **标签：** ' + a.tags.map(function(t) { return '#' + t; }).join(' ') + '\n';
        }
        if (a.note) {
          md += '\n' + a.note + '\n';
        }
        md += '\n---\n\n';
      }
      self._downloadBlob(md, 'text/markdown', 'statlab-notes.md');
    }
  },

  _downloadBlob: function(content, mime, filename) {
    var blob = new Blob([content], { type: mime + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  _escHtml: function(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};
```

- [ ] **Step 2: 语法检查**

```bash
node -e "var fs=require('fs'); var code=fs.readFileSync('shared/js/annotations.js','utf8'); new Function(code); console.log('Syntax OK')"
```

Expected: `Syntax OK`

---

### Task 5: 添加 CSS 样式

**Files:**
- Modify: `shared/css/components.css` — 在文件末尾追加

- [ ] **Step 1: 追加标注系统 CSS 样式**

在 `shared/css/components.css` 末尾追加：

```css

/* ===== 标注系统 (Annotation System) ===== */

/* 浮动工具栏 */
.ann-toolbar {
  position: fixed;
  z-index: 10000;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  user-select: none;
}
.ann-tb-style-row {
  display: flex; gap: 4px;
}
.ann-style-btn {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
}
.ann-style-btn:hover { background: #1e293b; color: #e2e8f0; }
.ann-style-btn.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
.ann-tb-color-row {
  display: flex; gap: 8px; justify-content: center; padding: 4px 0;
}
.ann-color-dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.15s, border-color 0.15s;
}
.ann-color-dot:hover { transform: scale(1.2); }
.ann-color-sel {
  border-color: #fff;
  box-shadow: 0 0 0 2px #3b82f6;
}
.ann-note-area {
  display: none;
  border-top: 1px solid #334155;
  padding-top: 6px;
}
.ann-note-area.show { display: block; }
.ann-note-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 0.82rem;
  outline: none;
  box-sizing: border-box;
}
.ann-note-input:focus { border-color: #3b82f6; }
.ann-note-input::placeholder { color: #64748b; }
.ann-action-row {
  border-top: 1px solid #334155;
  padding-top: 6px;
  text-align: center;
}
.ann-delete-btn {
  padding: 4px 16px;
  border: 1px solid #dc2626;
  border-radius: 4px;
  background: transparent;
  color: #fca5a5;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
}
.ann-delete-btn:hover { background: #7f1d1d; color: #fecaca; }

/* 高亮/下划线/波浪线标注 mark 元素 */
mark.ann-highlight {
  background-color: var(--ann-color, #fef08a);
  border-radius: 2px;
  padding: 0 1px;
  color: inherit;
}
mark.ann-underline {
  background: transparent;
  text-decoration: underline;
  text-decoration-color: var(--ann-color, #fef08a);
  text-underline-offset: 3px;
  color: inherit;
}
mark.ann-wavy {
  background: transparent;
  text-decoration: underline wavy;
  text-decoration-color: var(--ann-color, #fef08a);
  text-underline-offset: 4px;
  color: inherit;
}
/* 备注图标 */
mark.ann-has-note::after {
  content: '\01F4AC';  /* 💬 */
  font-size: 0.7rem;
  vertical-align: super;
  opacity: 0.55;
  cursor: pointer;
  padding-left: 2px;
}
mark.ann-has-note:hover::after { opacity: 1; }

/* 遮罩 */
.ann-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 9998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.ann-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

/* 侧边面板 */
.ann-panel {
  position: fixed;
  top: 0;
  right: -370px;
  width: 340px;
  height: 100vh;
  background: var(--bg-primary, #0f172a);
  border-left: 1px solid var(--border-color, #334155);
  z-index: 9999;
  transition: right 0.25s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.3);
}
.ann-panel.open { right: 0; }

/* 面板头部 */
.ann-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}
.ann-panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
}
.ann-panel-header-actions {
  display: flex; gap: 8px; align-items: center; position: relative;
}
.ann-export-btn, .ann-close-btn {
  padding: 4px 10px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
}
.ann-export-btn:hover, .ann-close-btn:hover { background: #334155; color: #e2e8f0; }
.ann-export-menu {
  position: absolute;
  top: 100%;
  right: 36px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 1;
  min-width: 120px;
  overflow: hidden;
}
.ann-export-menu button {
  display: block;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: #e2e8f0;
  font-size: 0.82rem;
  text-align: left;
  cursor: pointer;
}
.ann-export-menu button:hover { background: #334155; }

/* 面板搜索和筛选 */
.ann-panel-search {
  padding: 12px 18px;
  flex-shrink: 0;
}
.ann-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #334155;
  border-radius: 6px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
}
.ann-search-input:focus { border-color: #3b82f6; }
.ann-search-input::placeholder { color: #64748b; }
.ann-panel-filters {
  display: flex; gap: 8px; padding: 0 18px 12px;
  flex-shrink: 0;
}
.ann-filter-style, .ann-filter-color {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.78rem;
  outline: none;
  cursor: pointer;
}

/* 面板列表 */
.ann-panel-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}
.ann-card-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 8px;
}
.ann-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid #1e293b;
  border-radius: 8px;
  background: #1a2030;
  cursor: pointer;
  transition: all 0.15s;
}
.ann-card:hover { border-color: #334155; background: #1e293b; }
.ann-card-flash {
  border-color: #3b82f6;
  animation: ann-flash 1.5s ease-out;
}
@keyframes ann-flash {
  0% { box-shadow: 0 0 0 3px rgba(59,130,246,0.5); }
  100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
}
.ann-card-color {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}
.ann-card-body {
  flex: 1; min-width: 0;
}
.ann-card-text {
  font-size: 0.82rem;
  color: var(--text-primary, #e2e8f0);
  line-height: 1.5;
  margin-bottom: 2px;
}
.ann-card-note {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 4px;
}
.ann-card-meta {
  display: flex; gap: 8px;
  font-size: 0.7rem;
  color: #64748b;
}
.ann-card-actions {
  display: flex; flex-direction: column; gap: 2px;
  flex-shrink: 0;
}
.ann-card-edit, .ann-card-del {
  padding: 2px 8px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: #64748b;
  font-size: 0.82rem;
  cursor: pointer;
}
.ann-card-edit:hover { color: #3b82f6; background: rgba(59,130,246,0.1); }
.ann-card-del:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
.ann-item-cb {
  flex-shrink: 0;
  margin-top: 3px;
  accent-color: #3b82f6;
}

/* 面板底部 */
.ann-panel-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-top: 1px solid #1e293b;
  font-size: 0.78rem;
  color: #94a3b8;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.ann-select-all {
  display: flex; align-items: center; gap: 4px;
  cursor: pointer;
  font-size: 0.78rem;
  color: #94a3b8;
  user-select: none;
}
.ann-select-all-cb { accent-color: #3b82f6; }
.ann-selected-count { font-size: 0.75rem; color: #64748b; }
.ann-batch-delete, .ann-batch-export {
  padding: 4px 12px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.75rem;
  cursor: pointer;
}
.ann-batch-delete:not(:disabled):hover { border-color: #dc2626; color: #fca5a5; }
.ann-batch-export:not(:disabled):hover { border-color: #3b82f6; color: #93c5fd; }
.ann-batch-delete:disabled, .ann-batch-export:disabled {
  opacity: 0.4; cursor: not-allowed;
}

/* 右下角浮动按钮 */
.ann-floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #334155;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 9990;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ann-floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.5);
  border-color: #3b82f6;
}
.ann-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-sizing: border-box;
}
```

- [ ] **Step 2: 视觉检查**

在浏览器中打开任意知识点页面，确保 CSS 文件加载不报错（按 F12 看 Console 无 CSS 解析错误）。

---

### Task 6: 集成到知识点页面（knowledge pages）

**Files:**
- Modify: `subjects/stat-comp/knowledge/s4-dist.html`
- Modify: `subjects/stat-comp/knowledge/s5-optimize.html`
- Modify: `subjects/stat-comp/knowledge/s6-supervised.html`
- Modify: `subjects/stat-comp/knowledge/s7-tree.html`
- Modify: `subjects/stat-comp/knowledge/s8-unsupervised.html`
- Modify: `subjects/econstats/knowledge/ch1-gdp.html` ~ `ch8-macro-overview.html` (8 pages)

- [ ] **Step 1: 在每个知识点页面添加 annotations.js 脚本标签 + 初始化调用**

在每个知识页面的 `<script>` 块中，在 `injectNavbar` 和 `renderKnowledgePage` 调用之后、IIFE 结束之前，添加 `AnnotationSystem.init(...)` 调用。同时确保 `<script>` 标签添加在 `router.js` 之后。

**以 `s4-dist.html` 为例**，修改后的 inline `<script>` 块为：

```html
<script src="../../../shared/js/storage.js"></script>
<script src="../../../shared/js/router.js"></script>
<script src="../../../shared/js/annotations.js"></script>
<script src="../data/knowledge.js"></script>
<script src="../../../shared/vendor/katex.min.js"></script>
<script src="../../../shared/vendor/auto-render.min.js"></script>
<script>
var CHAPTER_ID = 's4-dist';
(function() {
  if (typeof PyodideRuntime !== 'undefined') PyodideRuntime.init();
  injectNavbar('knowledge', 'stat-comp', CHAPTER_ID);
  renderKnowledgePage('stat-comp', CHAPTER_ID);
  if (typeof AnnotationSystem !== 'undefined') {
    AnnotationSystem.init('subjects/stat-comp/knowledge/' + CHAPTER_ID + '/', '#content-area');
  }
})();
</script>
```

**需要修改的 13 个知识页面及对应的 init 参数：**

| 文件 | pagePath | 学科 |
|------|----------|------|
| `subjects/stat-comp/knowledge/s4-dist.html` | `subjects/stat-comp/knowledge/s4-dist/` | stat-comp |
| `subjects/stat-comp/knowledge/s5-optimize.html` | `subjects/stat-comp/knowledge/s5-optimize/` | stat-comp |
| `subjects/stat-comp/knowledge/s6-supervised.html` | `subjects/stat-comp/knowledge/s6-supervised/` | stat-comp |
| `subjects/stat-comp/knowledge/s7-tree.html` | `subjects/stat-comp/knowledge/s7-tree/` | stat-comp |
| `subjects/stat-comp/knowledge/s8-unsupervised.html` | `subjects/stat-comp/knowledge/s8-unsupervised/` | stat-comp |
| `subjects/econstats/knowledge/ch1-gdp.html` | `subjects/econstats/knowledge/ch1-gdp/` | econstats |
| `subjects/econstats/knowledge/ch2-enterprise.html` | `subjects/econstats/knowledge/ch2-enterprise/` | econstats |
| `subjects/econstats/knowledge/ch3-industry.html` | `subjects/econstats/knowledge/ch3-industry/` | econstats |
| `subjects/econstats/knowledge/ch4-household.html` | `subjects/econstats/knowledge/ch4-household/` | econstats |
| `subjects/econstats/knowledge/ch5-price-index.html` | `subjects/econstats/knowledge/ch5-price-index/` | econstats |
| `subjects/econstats/knowledge/ch6-digital-economy.html` | `subjects/econstats/knowledge/ch6-digital-economy/` | econstats |
| `subjects/econstats/knowledge/ch7-data-asset.html` | `subjects/econstats/knowledge/ch7-data-asset/` | econstats |
| `subjects/econstats/knowledge/ch8-macro-overview.html` | `subjects/econstats/knowledge/ch8-macro-overview/` | econstats |

**关键注意事项：**
- stat-comp 知识页面有 Pyodide 脚本和 init 调用（s5-s8），不影响 annotation 集成
- econstats 知识页面不一定有 Pyodide 脚本，需逐文件确认
- 所有知识页面使用 `#content-area` 作为标注容器的 CSS 选择器

- [ ] **Step 2: 验证 13 个页面语法**

```bash
for f in subjects/stat-comp/knowledge/*.html subjects/econstats/knowledge/*.html; do
  echo "Checking: $f"
  node -e "var fs=require('fs'); var html=fs.readFileSync('$f','utf8'); if(!html.includes('annotations.js')) console.log('  MISSING annotations.js'); else console.log('  OK');"
done
```

---

### Task 7: 集成到测验页面（quiz pages）

**Files:**
- Modify: `subjects/stat-comp/quiz/s4-dist.html` ~ `s8-unsupervised.html` (5 pages)
- Modify: `subjects/econstats/quiz/ch1-gdp.html` ~ `ch8-macro-overview.html` (8 pages)

- [ ] **Step 1: 在每个测验页面添加 annotations.js + 初始化调用**

测验页面结构和知识页面类似。**以 `stat-comp/quiz/s4-dist.html` 为例**，修改后的 inline `<script>` 块：

```html
<script src="../../../shared/js/storage.js"></script>
<script src="../../../shared/js/router.js"></script>
<script src="../../../shared/js/annotations.js"></script>
<script src="../data/quiz.js"></script>
<script src="../../../shared/vendor/katex.min.js"></script>
<script src="../../../shared/vendor/auto-render.min.js"></script>
<script src="../../../shared/js/quiz-engine.js"></script>
<script>
var CHAPTER_ID = 's4-dist';
(function() {
  injectNavbar('quiz', 'stat-comp', CHAPTER_ID);
  var questions = window.STATCOMP_QUIZ ? (window.STATCOMP_QUIZ[CHAPTER_ID] || []) : [];
  QuizEngine.init('stat-comp', CHAPTER_ID, questions);
  if (typeof AnnotationSystem !== 'undefined') {
    AnnotationSystem.init('subjects/stat-comp/quiz/' + CHAPTER_ID + '/', '#quiz-container');
  }
})();
</script>
```

**需要修改的 13 个测验页面及对应的 init 参数：**

| 文件 | pagePath | 学科 | 数据变量 |
|------|----------|------|----------|
| `subjects/stat-comp/quiz/s4-dist.html` | `subjects/stat-comp/quiz/s4-dist/` | stat-comp | STATCOMP_QUIZ |
| `subjects/stat-comp/quiz/s5-optimize.html` | `subjects/stat-comp/quiz/s5-optimize/` | stat-comp | STATCOMP_QUIZ |
| `subjects/stat-comp/quiz/s6-supervised.html` | `subjects/stat-comp/quiz/s6-supervised/` | stat-comp | STATCOMP_QUIZ |
| `subjects/stat-comp/quiz/s7-tree.html` | `subjects/stat-comp/quiz/s7-tree/` | stat-comp | STATCOMP_QUIZ |
| `subjects/stat-comp/quiz/s8-unsupervised.html` | `subjects/stat-comp/quiz/s8-unsupervised/` | stat-comp | STATCOMP_QUIZ |
| `subjects/econstats/quiz/ch1-gdp.html` | `subjects/econstats/quiz/ch1-gdp/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch2-enterprise.html` | `subjects/econstats/quiz/ch2-enterprise/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch3-industry.html` | `subjects/econstats/quiz/ch3-industry/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch4-household.html` | `subjects/econstats/quiz/ch4-household/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch5-price-index.html` | `subjects/econstats/quiz/ch5-price-index/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch6-digital-economy.html` | `subjects/econstats/quiz/ch6-digital-economy/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch7-data-asset.html` | `subjects/econstats/quiz/ch7-data-asset/` | econstats | ECOSTATS_QUIZ |
| `subjects/econstats/quiz/ch8-macro-overview.html` | `subjects/econstats/quiz/ch8-macro-overview/` | econstats | ECOSTATS_QUIZ |

**关键注意事项：**
- 测验页面使用 `#quiz-container` 作为标注容器
- econstats 测验页面使用 `window.ECOSTATS_QUIZ` 而非 `STATCOMP_QUIZ`
- KaTeX CSS/JS 路径需确认在各页面中正确（部分页面可能未加载 KaTeX）

- [ ] **Step 2: 验证 13 个页面语法**

```bash
for f in subjects/stat-comp/quiz/*.html subjects/econstats/quiz/*.html; do
  echo "Checking: $f"
  node -e "var fs=require('fs'); var html=fs.readFileSync('$f','utf8'); if(!html.includes('annotations.js')) console.log('  MISSING annotations.js'); else console.log('  OK');"
done
```

---

### Task 8: 端到端集成测试

**验证方法：** 启动本地 HTTP 服务器，浏览器逐项测试。

- [ ] **Step 1: 启动测试服务器**

```bash
cd c:/Users/梁文洋/Desktop/stat-lab && python -m http.server 8765
```

Expected: `Serving HTTP on :: port 8765`

- [ ] **Step 2: 测试标注流程（基础知识页面）**
  1. 浏览器打开 `http://localhost:8765/subjects/stat-comp/knowledge/s4-dist.html`
  2. 选中一段正文 → 工具栏应浮现
  3. 点击「高亮」+ 黄色圆点 → 文字出现黄色荧光笔效果
  4. 点击另一个样式+颜色 → 样式切换
  5. 点击 💬 输入框，输入备注文字，回车 → 💬 图标出现
  6. 刷新页面 → 标注全部恢复
  7. 对 KaTeX 公式选中 → 工具栏浮现 → 标注后不破坏公式渲染

- [ ] **Step 3: 测试侧边栏**
  1. 点击右下角 📝 按钮 → 侧边面板滑出
  2. 搜索框输入关键词 → 卡片过滤
  3. 样式筛选下拉 → 仅显示对应样式标注
  4. 颜色筛选下拉 → 仅显示对应颜色标注
  5. 点击卡片 → 关闭面板 + 页面滚动到标注位置
  6. 点击 ✎ 编辑备注 → 修改并保存
  7. 点击导出 ⬇ → JSON 下载检查内容
  8. 点击导出 ⬇ → Markdown 下载检查格式
  9. 全选 → 批量删除 → 标注消失
  10. 按 Escape → 面板关闭

- [ ] **Step 4: 测试删除和编辑**
  1. 在已有标注上点击 → 工具栏显示「🗑 删除」
  2. 确认删除 → 标注消失 + 💬 消失
  3. 侧边栏中卡片也消失了
  4. 按 F12 查看 Application → localStorage → `statlab_annots` 键中的数据更新正确

- [ ] **Step 5: 跨页面测试**
  1. 打开测验页面 `http://localhost:8765/subjects/stat-comp/quiz/s4-dist.html`
  2. 标注功能正常工作
  3. 经济统计学知识页面 `http://localhost:8765/subjects/econstats/knowledge/ch1-gdp.html`
  4. 标注功能正常工作
  5. 各页面的标注互不干扰（不同 pagePath 的数据隔离）

- [ ] **Step 6: 边界情况测试**
  1. 选中跨段落文字 → 可标注
  2. 选中包含 KaTeX 公式的混合选区 → 可标注（只要选区起止在可标注区内）
  3. 选中后不操作工具栏，点击空白 → 工具栏消失，标注不创建
  4. 连续快速标注 5 处 → 无报错，5 条标注全部正确渲染
  5. 导出空页面 → JSON 为空数组 `[]`，Markdown 为空白模板
  6. 极长文本选中（300 字符以上）→ 正常标注

- [ ] **Step 7: 浏览器兼容性检查**

在 Chrome、Edge、Firefox 中分别验证：工具栏正常、侧边栏动画流畅、CSS 样式一致。

---

## 自审清单

1. **Spec 覆盖**: 
   - 划线标注 ✅ Task 1-4
   - 卡片备注 ✅ Task 3-4
   - 侧边栏+搜索+筛选+导出 ✅ Task 4
   - localStorage 持久化 ✅ Task 2
   - KaTeX 公式支持 ✅ Task 1 (TextOffsetIndexer)
   - 跨学科支持 ✅ Task 6-7
   - CSS 三样式+工具栏+面板 ✅ Task 5
   - 💬 图标 ✅ Task 5 (CSS)

2. **占位符检查**: ✅ 无 TBD/TODO/漏写代码

3. **类型一致性**: 
   - `AnnotationSystem.init(pagePath, containerSel)` ✅ 所有调用点签名一致
   - `addAnnotation(startOffset, endOffset, text, style, color, note)` ✅ 在 Task 3 中调用点匹配
   - `updateAnnotation(id, changes)` ✅ changes 对象字段名一致（style/color/note/tags）
   - `exportAnnotations(format, ids)` ✅ 导出按钮调用正确
