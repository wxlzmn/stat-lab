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

  // ========== 占位桩（后续任务实现） ==========

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
      // KaTeX 间距 → 映射为空格
      if (node.classList && node.classList.contains('mspace')) {
        self._textMap.push({ char: ' ', node: null, offset: -1 });
        return;
      }
      // .katex-display 是显示模式公式的容器，递归其子节点（会被 .katex 捕获）
      if (node.classList && node.classList.contains('katex-display')) {
        for (var dc = node.firstChild; dc; dc = dc.nextSibling) {
          self._walkTextNodes(dc);
        }
        return;
      }
      // <br> 映射为换行
      if (node.tagName === 'BR') {
        self._textMap.push({ char: '\n', node: null, offset: -1 });
        return;
      }
      // 标注系统的 <mark> 元素 — 递归子节点，不跳过（需支持二次选择和编辑）
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
    // 如果传入的是 .katex 容器，找到 .katex-html；如果本身就是 .katex-html，直接用
    var html = katexEl.classList.contains('katex-html') ? katexEl : katexEl.querySelector('.katex-html');
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
      if (entry.node === endNode && entry.offset == endOff - 1) {
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
  },

  // ========== AnnotationManager ==========

  /**
   * 从 localStorage 加载当前页面的标注列表
   */
  _load: function() {
    var self = this;
    try {
      var all = JSON.parse(localStorage.getItem(self._STORAGE_KEY) || '{}');
      var pageData = all[self._pagePath];
      self._annots = Array.isArray(pageData) ? pageData : [];
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

    // 检查是否与已有标注重叠 — 重叠则先清理 DOM 再移除
    var overlaps = self._annots.filter(function(a) {
      return !(endOffset <= a.startOffset || startOffset >= a.endOffset);
    });
    for (var oi = 0; oi < overlaps.length; oi++) {
      var om = document.querySelector('mark[data-ann-id="' + overlaps[oi].id + '"]');
      if (om) {
        var op = om.parentNode;
        if (op) {
          while (om.firstChild) { op.insertBefore(om.firstChild, om); }
          op.removeChild(om);
          op.normalize();
        }
      }
    }
    self._annots = self._annots.filter(function(a) {
      return (endOffset <= a.startOffset || startOffset >= a.endOffset);
    });

    self._annots.push(ann);
    self._save();
    self._renderAnnotation(ann);
    self._buildIndex();  // 重建索引，确保后续选择能定位
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
      if (parent) {
        while (mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
        // 合并相邻文本节点
        parent.normalize();
      }
    }
    // 从数据中移除
    self._annots = self._annots.filter(function(a) { return a.id !== id; });
    self._save();
    self._buildIndex();  // 重建索引
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
      var annUpdated = self._annots.filter(function(a) { return a.id === id; })[0];
      if (annUpdated) self._applyMarkStyle(mark, annUpdated);
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
    } else {
      mark.classList.remove('ann-has-note');
    }
  },

  /**
   * 页面加载时恢复所有标注
   * 按偏移量降序排序，从后往前渲染，避免偏移量变化
   */
  _restoreAnnotations: function() {
    var self = this;
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
  },

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
      // 点击空白处关闭工具栏
      setTimeout(function() {
        if (!self._toolbarHovered) self._hideToolbar();
      }, 200);
      return;
    }

    var text = selection.toString().trim();
    if (!text) { self._hideToolbar(); return; }

    // 检查选区是否在可标注容器内
    var containers = document.querySelectorAll(self._containerSel);
    var inContainer = false;
    var range = selection.getRangeAt(0);
    var commonAncestor = range.commonAncestorContainer;
    containers.forEach(function(container) {
      if (container.contains(commonAncestor)) inContainer = true;
    });
    if (!inContainer) return;

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
    var styles = [
      { val: 'highlight', label: '高亮' },
      { val: 'underline', label: '下划线' },
      { val: 'wavy', label: '波浪线' }
    ];
    var styleRow = '';
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

    // 定位 — 先插入再测量
    var tbRect = tb.getBoundingClientRect();
    var finalX = x - tbRect.width / 2;
    var finalY = y - tbRect.height;
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
    if (tb) { tb.remove(); this._toolbar = null; this._toolbarHovered = false; }
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
        var colorEl = tb.querySelector('.ann-color-sel');
        var col = colorEl ? colorEl.getAttribute('data-color') : '#fef08a';
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
        var styleBtnEl = tb.querySelector('.ann-style-btn.active');
        var style = styleBtnEl ? styleBtnEl.getAttribute('data-style') : 'highlight';
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
          var ann;
          if (existing) {
            self.updateAnnotation(existing.id, { note: noteVal });
            ann = self._annots.filter(function(a) { return a.id === existing.id; })[0];
          } else {
            var colEl = tb.querySelector('.ann-color-sel');
            var col = colEl ? colEl.getAttribute('data-color') : '#fef08a';
            var styleBtnEl = tb.querySelector('.ann-style-btn.active');
            var style = styleBtnEl ? styleBtnEl.getAttribute('data-style') : 'highlight';
            ann = self.addAnnotation(offsets.start, offsets.end, text, style, col, noteVal);
          }
          self._refreshPanel();
          // 更新 💬 图标
          if (ann && ann.note) {
            var mark = document.querySelector('mark[data-ann-id="' + ann.id + '"]');
            if (mark) mark.classList.add('ann-has-note');
          }
        }
      });
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
  },

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
    var colorOptions = '';
    var colorLabels = ['🟡 黄色', '🟢 绿色', '🔴 红色', '🟣 紫色', '🟠 橙色'];
    for (var ci = 0; ci < colors.length; ci++) {
      colorOptions += '<option value="' + colors[ci] + '">' + colorLabels[ci] + '</option>';
    }

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
          colorOptions +
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
      if (e.key === 'Escape' && self._panel && self._panel.classList.contains('open')) {
        self._closePanel();
      }
    });
  },

  /**
   * 创建右下角浮动按钮
   */
  _createFloatingBtn: function() {
    var self = this;
    // 避免重复创建
    if (document.querySelector('.ann-floating-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'ann-floating-btn';
    btn.title = '我的笔记';
    btn.innerHTML = '📝<span class="ann-badge" id="ann-floating-badge" style="display:none;"></span>';
    btn.addEventListener('click', function() { self._openPanel(); });
    document.body.appendChild(btn);
    self._updateFloatingBtnBadge();
  },

  _updateFloatingBtnBadge: function() {
    var badge = document.getElementById('ann-floating-badge');
    if (badge) {
      var count = this._annots.length;
      badge.textContent = count > 0 ? count : '';
      badge.style.display = count > 0 ? 'inline' : 'none';
    }
  },

  /**
   * 打开侧边栏
   */
  _openPanel: function(scrollToId) {
    var self = this;
    if (!self._panel) return;
    self._renderPanelList(scrollToId);
    self._panel.classList.add('open');
    self._overlay.classList.add('open');
  },

  /**
   * 关闭侧边栏
   */
  _closePanel: function() {
    if (this._panel) this._panel.classList.remove('open');
    if (this._overlay) this._overlay.classList.remove('open');
  },

  /**
   * 刷新面板内容
   */
  _refreshPanel: function() {
    if (this._panel && this._panel.classList.contains('open')) {
      this._renderPanelList();
    }
  },

  /**
   * 渲染面板列表
   */
  _renderPanelList: function(scrollToId) {
    var self = this;
    if (!self._panel) return;
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
        return (a.text || '').toLowerCase().indexOf(q) !== -1 ||
               (a.note || '').toLowerCase().indexOf(q) !== -1;
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
      list.innerHTML = '<div style="text-align:center;padding:32px;color:#cbd5e1;font-size:0.9rem;">暂无笔记<br><span style="font-size:0.8rem;">选中文字开始标注吧 ✍️</span></div>';
    } else {
      var html = '<div class="ann-card-list">';
      for (var i = 0; i < filtered.length; i++) {
        var ann = filtered[i];
        var notePreview = (ann.note || '').substring(0, 80);
        if ((ann.note || '').length > 80) notePreview += '...';
        var styleLabel = ann.style === 'highlight' ? '高亮' : ann.style === 'underline' ? '下划线' : '波浪线';
        var dateStr = (ann.createdAt || '').substring(0, 10);
        html += '' +
          '<div class="ann-card' + (ann.id === scrollToId ? ' ann-card-flash' : '') + '" data-ann-id="' + ann.id + '">' +
            '<input type="checkbox" class="ann-item-cb" data-ann-id="' + ann.id + '">' +
            '<span class="ann-card-color" style="background:' + ann.color + '"></span>' +
            '<div class="ann-card-body">' +
              '<div class="ann-card-text">' + self._escHtml(ann.text.substring(0, 60)) + (ann.text.length > 60 ? '...' : '') + '</div>' +
              (ann.note ? '<div class="ann-card-note">' + self._escHtml(notePreview) + '</div>' : '') +
              '<div class="ann-card-meta">' +
                '<span class="ann-card-style">' + styleLabel + '</span>' +
                '<span class="ann-card-date">' + dateStr + '</span>' +
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
    if (!self._panel) return;

    // 点击卡片跳转
    var cards = self._panel.querySelectorAll('.ann-card');
    cards.forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        var id = this.getAttribute('data-ann-id');
        var ann = self._annots.filter(function(a) { return a.id === id; })[0];
        if (!ann) return;
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
    if (!panel) return;
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
    var data = ids && ids.length ? self._annots.filter(function(a) { return ids.indexOf(a.id) !== -1; }) : self._annots.slice();

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
