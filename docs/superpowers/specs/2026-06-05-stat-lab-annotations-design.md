# Stat-Lab 标注与笔记功能设计文档

> 日期：2026-06-05 | 状态：已确认

---

## 一、功能概述

为 Stat-Lab 平台（所有学科的知识点页面 + 测验页面）新增交互式标注与笔记功能。用户可选中正文段落、KaTeX 公式、代码注释等文字内容，进行划线标注并添加卡片备注。所有标注持久化存储，支持搜索、筛选、导出。

## 二、适用范围

| 维度 | 范围 |
|------|------|
| **页面类型** | 知识点页面（knowledge/）+ 测验页面（quiz/） |
| **学科** | 所有学科（统计计算 stat-comp、经济统计学 econ-stats 等） |
| **可标注内容** | 正文段落文字、KaTeX 渲染公式、代码块注释 |

## 三、核心功能

### 3.1 划线标注（Annotation）

- **触发方式**：选中文字后浮动工具栏（MiniToolbar）
- **标注样式**：高亮（highlight）、下划线（underline）、波浪线（wavy，点状/波浪下划线）
- **颜色选项**：5 种预设颜色（黄 #fef08a、绿 #bbf7d0、红 #fecaca、紫 #e9d5ff、橙 #fed7aa）
- **操作**：在已有标注上点击 → 工具栏显示「改样式 / 改颜色 / 编辑备注 / 🗑 删除」
- **默认行为**：选中文字 + 工具栏出现 → 默认高亮黄色，点一下即可

### 3.2 卡片备注（Card Notes）

- **添加方式**：工具栏中点击 💬 按钮，展开文本输入框，回车保存
- **展示方式**：
  - 划线文字旁显示 💬 小图标（点击打开侧边栏并定位到对应卡片）
  - 侧边栏中按章节分组列表展示所有备注
- **编辑/删除**：侧边栏卡片内支持内联编辑和删除

### 3.3 侧边面板（SidePanel）

- **触发**：页面右下角 📝 固定按钮（显示当前页标注数量徽标）
- **布局**：右侧滑出，宽 340px，遮罩层半透明
- **搜索**：全文模糊搜索笔记内容
- **筛选**：按样式筛选（全部/高亮/下划线/波浪线）、按颜色筛选
- **分组**：按页面/章节折叠分组，显示每组数量
- **导出下拉**：
  - JSON 格式（完整数据，可再导入）
  - Markdown 格式（可阅读笔记）
- **批量操作**：全选/单选 → 删除选中 / 导出选中
- **卡片交互**：点击卡片 → 页面滚动到对应划线位置 + 高亮闪烁 1 秒

## 四、技术架构

### 4.1 方案选型：全局文本偏移模型

选择「方案 A：全局文本偏移模型」。页面加载后，把所有可标注 DOM 节点预处理成统一文本流，建立字符偏移量 → DOM 文本节点的双向映射表。用户选中文字后，通过偏移量定位并存储标注。

**选型理由**：
- 偏移量天然稳定，页面刷新后精确恢复（不像 XPath 方案受 DOM 结构变化影响）
- 统一模型处理段落、公式、代码注释，不需要分类特殊处理
- 跨段落跨节点选中天然支持

### 4.2 架构图

```
Page (knowledge / quiz)
├── content-blocks（现有渲染模块 renderContentBlock）
│   ├── text block    (paragraph)
│   ├── formula block (KaTeX)
│   └── code block    (highlight)
│
├── TextOffsetIndexer (文本索引器)
│   ├── 遍历所有可标注 DOM 节点
│   ├── 提取纯文本 + 建立 char→DOM node 映射
│   └── API: textAt(offset), nodeRange(start, end)
│
├── AnnotationManager (CRUD)
│   ├── addAnnotation(range, style, color, note) → store
│   ├── removeAnnotation(id) → 移除高亮 + 删记录
│   ├── updateAnnotation(id, changes)
│   ├── getPageAnnotations(pagePath) → Array
│   ├── restoreAnnotations(pagePath) → 重建 DOM 高亮
│   └── searchAnnotations(query, filters) → Array
│
├── MiniToolbar (浮动工具栏)
│   ├── 监听 mouseup → 检测选区是否在可标注区
│   ├── 渲染样式/颜色选择 + 备注按钮
│   └── 自动定位（选区上方/下方避让）
│
├── SidePanel (侧边面板)
│   ├── 右侧滑出面板 + 遮罩
│   ├── 搜索框 + 样式筛选 + 颜色筛选
│   ├── 按章节折叠分组
│   ├── 卡片列表（预览、编辑、删除、跳转）
│   ├── 导出（JSON / Markdown）
│   └── 批量操作（全选、删除选中、导出选中）
│
├── EcoStore (localStorage)
│   └── key: "statlab_annots"
│
└── Export (导出工具)
    └── toJSON(), toMarkdown()
```

### 4.3 模块划分

| 模块 | 文件 | 行数估算 |
|------|------|----------|
| TextOffsetIndexer | shared/js/annotations.js | ~80 行 |
| AnnotationManager | shared/js/annotations.js | ~120 行 |
| MiniToolbar | shared/js/annotations.js | ~100 行 |
| SidePanel | shared/js/annotations.js | ~150 行 |
| CSS 样式 | shared/css/components.css | ~180 行 |

所有模块放在 `annotations.js` 一个文件中（~450 行），遵循项目现有风格（如 `router.js` 大文件模式）。

## 五、数据模型

### 5.1 标注记录（Annotation Record）

```js
{
  id: "ann_1713456789_a3f2",       // 唯一 ID
  pagePath: "subjects/stat-comp/knowledge/s4-dist/",
  blockId: null,                   // 可选，关联 contentBlock ID
  startOffset: 42,                 // 全局文本流起始偏移
  endOffset: 58,                   // 全局文本流结束偏移
  text: "最大似然估计的核心思想",    // 冗余原文（搜索/导出用）
  style: "highlight",              // highlight | underline | wavy
  color: "#fef08a",               // 颜色值
  note: "MLE 的核心理解",           // 备注内容
  tags: ["核心概念"],              // 可选标签
  createdAt: "2026-06-05T14:30:00Z",
  updatedAt: "2026-06-05T14:30:00Z"
}
```

### 5.2 localStorage 结构

```js
// 存储键：statlab_annots
// 格式：按 pagePath 分组
{
  "subjects/stat-comp/knowledge/s4-dist/": [ ann1, ann2, ... ],
  "subjects/econ-stats/knowledge/ch1/":    [ ann3, ... ],
  "subjects/stat-comp/quiz/s4-dist/":      [ ann4, ... ]
}
```

加载时只读取当前页面的标注数组，避免全量加载。

### 5.3 Markdown 导出格式

每条标注导出为：

```markdown
### 📝 最大似然估计的核心思想
> **原文位置：** 统计计算 > 分布、随机数与似然推断
> **创建时间：** 2026-06-05 14:30
> **标签：** #核心概念

MLE 的核心理解：用数据反推参数
```

---

## 六、交互设计

### 6.1 浮动工具栏（MiniToolbar）

```
用户划选文字 → mouseup
  ├─ 选区内仅空白/非标注区 → 忽略
  ├─ 选区与已有标注重叠 → 显示"编辑/删除"模式
  └─ 新选区 → 显示标准工具栏

标准工具栏：
┌──────────────────────────────┐
│ 🔵高亮  🔵下划线  🔵波浪线    │  ← 当前选中项高亮
│ 🟡 🟢 🔴 🟣 🟠              │  ← 5 色圆点，当前色加框
│ ─────────────────────         │
│ 💬 添加备注...                │  ← 点击展开输入框
└──────────────────────────────┘

工具栏位置：选区上方 8px，如空间不足则下方，始终水平居中于选区
```

### 6.2 侧边面板（SidePanel）

```
触发：右下角 📝 按钮（badge 显示当前页标注数）

面板布局：
┌────────────────────────────┐
│ ✕  我的笔记         ⬇ 导出  │
├────────────────────────────┤
│ 🔍 搜索笔记...             │
├────────────────────────────┤
│ 📋 [全部样式 ▾] [全部颜色 ▾]│
├────────────────────────────┤
│ ▼ 分布、随机数与似然推断 (5) │  ← 折叠分组
│   ┌────────────────────┐  │
│   │ 🟡 最大似然估计...   │  │
│   │ MLE的核心理解       │  │
│   │ #核心概念     ✎ 🗑 │  │
│   └────────────────────┘  │
│ ...                        │
├────────────────────────────┤
│ ☐ 全选  已选 2 条          │
│ [🗑 删除选中] [📥 导出选中] │
└────────────────────────────┘

关闭方式：点击 ✕、点击遮罩层、按 Escape

章节分组标签从页面内现有的导航栏标题（injectNavbar 传入的 chapterTitle 参数）提取，测验页面则从章节选择器的选中项获取。
```

### 6.3 💬 图标交互

- 划线文字末尾显示 💬 图标（`font-size: 0.7rem`，半透明，hover 不透明）
- 点击 💬 → 打开侧边面板 + 自动滚动到对应卡片 + 卡片高亮闪烁
- 图标位置：紧贴划线的 `::after` 伪元素

## 七、KaTeX 公式标注支持

### 7.1 挑战

KaTeX 渲染输出是深层嵌套的 `<span>` 树（如 `.katex > .katex-html > .base > .mord > ...`），不能简单用 textContent 建立偏移映射，因为：
- `.strut` 是隐藏占位符，不产生可见文本
- `.mspace` 是空格节点，需要映射为 " " 
- `<span>` 层级深度可达 6-8 层

### 7.2 方案：递归文本提取 + 叶节点映射

**Step 1 — 识别：** 遍历页面所有 `.katex` 容器，标记为可标注区。

**Step 2 — DFS 文本提取：**
```
规则：
├─ 文本节点 → 记录文本 + 每个字符绑定到该 textNode
├─ .strut  → 跳过
├─ .mspace → 映射为单空格 " "
├─ 无子元素的叶子 <span> → 提取其 textContent
└─ 其他 <span> → 递归子节点
```

**Step 3 — 偏移→DOM 映射：** 每字符记录 `[textNode, charIndex]`。

**Step 4 — 高亮恢复：** 找到起止偏移 → 用 Range 定位对应的文本节点位置 → `surroundContents()` 包裹 `<mark>`。操作在文本节点层级，不破坏 KaTeX 布局结构。

### 7.3 约束

- 标注包裹在最底层文本节点层级
- `.strut` 和纯布局 `<span>` 不产生可见文本偏移
- 多行公式（`\begin{aligned}` 等）按渲染顺序（从左到右、从上到下）提取

---

## 八、CSS 样式新增

### 8.1 标注样式

```css
/* 可标注区域光标 */
[data-annotatable] { cursor: text; }

/* 高亮标注（作用于 mark 元素） */
mark.ann-highlight {
  background-color: var(--ann-color, #fef08a);
  border-radius: 2px;
  padding: 0 1px;
  color: inherit;
}

/* 下划线标注 */
mark.ann-underline {
  background: transparent;
  text-decoration: underline;
  text-decoration-color: var(--ann-color, #fef08a);
  text-underline-offset: 2px;
  color: inherit;
}

/* 波浪线标注 */
mark.ann-wavy {
  background: transparent;
  text-decoration: underline wavy;
  text-decoration-color: var(--ann-color, #fef08a);
  text-underline-offset: 3px;
  color: inherit;
}

/* 备注图标 */
mark.ann-has-note::after {
  content: '💬';
  font-size: 0.7rem;
  vertical-align: super;
  opacity: 0.6;
  cursor: pointer;
}
mark.ann-has-note:hover::after {
  opacity: 1;
}
```

### 8.2 工具栏样式

```css
.ann-toolbar {           /* 浮动工具栏容器 */
  position: fixed;
  z-index: 10000;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
}

.ann-toolbar .style-row { /* 样式按钮行 */
  display: flex; gap: 4px;
}

.ann-toolbar .color-row { /* 颜色圆点行 */
  display: flex; gap: 6px; justify-content: center;
}

.ann-toolbar .note-input { /* 备注输入框 */
  display: none;
  border-top: 1px solid #334155;
  padding-top: 6px;
}
.ann-toolbar .note-input.show { display: block; }
```

### 8.3 侧边栏样式

```css
.ann-panel-overlay {       /* 遮罩层 */
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 9998;
  opacity: 0; transition: opacity 0.2s;
}
.ann-panel-overlay.open { opacity: 1; }

.ann-panel {               /* 面板 */
  position: fixed; top: 0; right: -360px;
  width: 340px; height: 100vh;
  background: var(--bg-primary, #0f172a);
  border-left: 1px solid var(--border-color, #334155);
  z-index: 9999;
  transition: right 0.25s ease;
  display: flex; flex-direction: column;
}
.ann-panel.open { right: 0; }
```

---

## 九、跨学科支持

### 9.1 路由适配

`annotations.js` 通过页面 URL 自动确定 `pagePath`，不关心学科。

### 9.2 injectNavbar 调用点

在 `router.js` 的 `renderContentBlock` 处理完所有 block 后（即知识点页面渲染完成时），调用初始化：

```js
// 在 renderKnowledgePage 末尾追加
if (typeof AnnotationSystem !== 'undefined') {
  AnnotationSystem.init(pagePath);
}
```

测验页面同理，在各测验页面渲染完成后（quiz 页面自身脚本末尾）调用 `AnnotationSystem.init(pagePath)`。

### 9.3 经济统计学适配

经济统计学使用相同的页面结构（knowledge/index.html + quiz/index.html），初始化调用参数会自动适配。

---

## 十、验证方法

1. 打开 `stat-comp` 知识点页面，选中一段正文 → 工具栏应浮现
2. 选择高亮 + 黄色 → 文字出现黄色荧光笔效果
3. 刷新页面 → 高亮应恢复
4. 对 KaTeX 公式选中标注 → 高亮应出现且不破坏公式渲染
5. 添加备注 → 💬 图标出现 → 点击图标打开侧边栏
6. 侧边栏搜索 "MLE" → 过滤对应卡片
7. 按颜色筛选 → 仅显示该颜色标注
8. 导出 Markdown → 检查格式
9. 切换到测验页面 → 标注功能同样可用
10. 删除标注 → 划线消失 + 💬 消失 + localStorage 同步更新
