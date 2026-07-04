# Stat-Lab

交互式统计学习平台 — 理论 + 计算 + 可视化

## 项目结构

```
stat-lab/
├── index.html                  # 首页（学科卡片 + 粒子动画）
├── shared/                     # 公共资源
│   ├── css/                    # 样式表
│   │   ├── variables-warm.css  # CSS 变量（颜色、字体、间距）
│   │   ├── base.css            # 基础重置 + 排版
│   │   ├── components.css      # 组件（导航栏、卡片、代码块等）
│   │   ├── pages.css           # 页面布局（知识页、测验页、仪表盘等）
│   │   └── responsive.css      # 响应式断点
│   ├── js/                     # 核心模块
│   │   ├── router.js           # 学科注册、导航注入、页面路由
│   │   ├── storage.js          # localStorage 数据持久化
│   │   ├── quiz-engine.js      # 测验引擎（选择题、填空题、计算题等）
│   │   ├── exam-engine.js      # 模拟考试引擎
│   │   ├── flashcard-engine.js # 闪卡系统（间隔重复算法）
│   │   ├── annotations.js      # 文本标注与笔记系统
│   │   ├── floating-particles.js # 页面浮动粒子效果
│   │   ├── particle-network.js # 首页粒子连线动画
│   │   └── pyodide-runtime.js  # Pyodide Python 运行时
│   └── vendor/                 # 第三方库
│       ├── katex.min.js        # KaTeX 公式渲染
│       ├── auto-render.min.js
│       └── katex.min.css
├── subjects/                   # 学科目录
│   ├── econstats/              # 经济统计学
│   │   ├── index.html          # 学科首页
│   │   ├── knowledge/          # 知识点页面
│   │   ├── quiz/               # 测验页面
│   │   ├── calculators/        # 计算器页面
│   │   └── data/               # 数据文件
│   │       ├── knowledge.js    # 知识点内容
│   │       ├── quiz.js         # 题库
│   │       ├── cases.js        # 案例数据
│   │       └── glossary.js     # 术语表
│   └── stat-comp/              # 统计计算
│       ├── index.html
│       ├── knowledge/
│       ├── quiz/
│       ├── lab/                # 实验页面
│       └── data/
├── dashboard/                  # 学习仪表盘
├── exam/                       # 考试配置页
├── flashcards/                 # 闪卡复习页
├── errors/                     # 错题本页
├── search/                     # 搜索页
└── login/                      # 登录页（离线模式）
```

## 功能

| 功能 | 说明 |
|------|------|
| 知识点 | 分章节展示，含公式、代码块、案例、术语表 |
| 测验 | 单选、多选、判断、填空、简答、计算、流程图 |
| 模拟考试 | 跨章节随机抽题，支持题型/难度筛选 |
| 闪卡 | 基于术语表生成，支持 SM-2 间隔重复算法 |
| 错题本 | 自动收集错题，支持按章节筛选和重做 |
| 标注笔记 | 划词高亮/下划线/波浪线，支持颜色和备注 |
| 学习进度 | localStorage 持久化，跨标签页同步 |
| 数据导出 | 一键导出所有学习数据为 JSON |

## 如何添加新学科

### 1. 注册学科

编辑 `shared/js/router.js`，在 `SUBJECT_REGISTRY` 数组中添加条目：

```javascript
{
  id: 'my-subject',
  name: '我的学科',
  icon: '🧪',
  color: '#8b5cf6',
  colorDeep: '#7c3aed',
  colorLight: '#f5f3ff',
  colorText: '#5b21b6',
  chapters: [
    { id: 'm1-topic', title: '第一章标题', icon: '📖' },
    { id: 'm2-topic', title: '第二章标题', icon: '📗' },
  ],
  tools: ['knowledge', 'quiz']  // 可选: knowledge, quiz, lab, calculators
}
```

### 2. 创建目录结构

```
subjects/my-subject/
├── index.html              # 学科首页（复制任一学科首页修改）
├── knowledge/
│   └── m1-topic.html       # 知识点页面
├── quiz/
│   └── m1-topic.html       # 测验页面
└── data/
    ├── knowledge.js         # 知识点内容数据
    ├── quiz.js              # 题库数据
    └── glossary.js          # 术语表（可选）
```

### 3. 复制页面模板

从现有学科复制 HTML 页面模板，修改 `CHAPTER_ID` 和脚本路径：

**知识点页面** (`knowledge/m1-topic.html`)：
```html
<script>
var CHAPTER_ID = 'm1-topic';
(function() {
  injectNavbar('knowledge', 'my-subject', CHAPTER_ID);
  renderKnowledgePage('my-subject', CHAPTER_ID);
  var layout = document.getElementById('knowledge-layout');
  if (layout) FloatingParticles.init(layout);
})();
</script>
```

**测验页面** (`quiz/m1-topic.html`)：
```html
<script>
var CHAPTER_ID = 'm1-topic';
(function() {
  var questions = window.MYSUBJECT_QUIZ ? (window.MYSUBJECT_QUIZ[CHAPTER_ID] || []) : [];
  QuizEngine.init('my-subject', CHAPTER_ID, questions);
  var main = document.querySelector('main');
  if (main) FloatingParticles.init(main);
})();
</script>
```

### 4. 创建数据文件

**knowledge.js** — 知识点内容：
```javascript
window.MYSUBJECT_KNOWLEDGE = {
  'm1-topic': {
    title: '第一章标题',
    sections: [
      {
        title: '概念介绍',
        keyPoints: ['要点1', '要点2'],
        content: [
          { type: 'text', body: '正文内容...' },
          { type: 'formula', label: '高斯公式', latex: '\\int_a^b f(x)dx', note: '说明' },
          { type: 'highlight', level: 'important', body: '重要提示...' },
          { type: 'code', language: 'Python', body: 'print("hello")', explain: '代码说明' },
        ]
      }
    ]
  }
};
```

**quiz.js** — 题库数据：
```javascript
window.MYSUBJECT_QUIZ = {
  'm1-topic': [
    {
      id: 'm1-q01',
      type: 'single',       // single | multi | truefalse | fill | short | calc
      question: '题目内容',
      options: ['A. 选项一', 'B. 选项二', 'C. 选项三', 'D. 选项四'],
      answer: 0,             // 选项索引（0-based）
      difficulty: 1,         // 1=简单, 2=中等, 3=困难
      explanation: '解析...',
      knowledgePoint: '知识点名称'
    }
  ]
};
```

### 5. 更新首页统计

编辑 `index.html`，修改 `.stat-number` 的 `data-target` 值以反映新的章节数和题库数。

## 技术栈

- **前端**: 原生 HTML / CSS / JavaScript（无框架）
- **公式渲染**: KaTeX
- **Python 执行**: Pyodide (WASM)
- **存储**: localStorage
- **字体**: Noto Sans SC / Noto Serif SC (Google Fonts)

## 本地运行

无需服务器，直接双击 `index.html` 或用任意静态服务器：

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

然后访问 `http://localhost:8080`
