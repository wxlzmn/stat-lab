# 视觉增强 Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance Stat-Lab's visual richness with SVG decoration layers, Chinese fonts, and artistic typography across all pages.

**Architecture:** Three CSS files are modified — `variables-warm.css` for font imports, `base.css` for SVG background decoration, `components.css` for typography and card enhancements. No HTML/JS changes needed. Particle network canvas is preserved.

**Tech Stack:** Pure CSS, Google Fonts (Noto Sans SC / Noto Serif SC), inline SVG data URIs. Zero new dependencies.

## Global Constraints

- Preserve existing particle-network.js canvas and its mouse interaction
- No HTML structure changes — all visual changes via CSS
- No new external libraries — only Google Fonts @import
- Mobile responsive: SVG decoration opacity reduces on screens < 768px
- Font loading must not block rendering (use `display=swap`)

---

### Task 1: 引入中文字体并更新 CSS 变量

**Files:**
- Modify: `shared/css/variables-warm.css`

**Consumes:** Existing `--font-display` and `--font-body` variables (currently both set to Inter stack)

**Produces:** Updated font variables pointing to Noto Serif SC (display) and Noto Sans SC (body)

- [ ] **Step 1: 添加 Google Fonts @import 并更新字体变量**

在 `shared/css/variables-warm.css` 文件最开头（`:root` 之前）添加：

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700;900&display=swap');

:root {
```

然后将字体变量从：
```css
--font-display: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
```

改为：
```css
--font-display: "Noto Serif SC", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--font-body: "Noto Sans SC", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
```

- [ ] **Step 2: 验证字体文件语法正确**

用浏览器打开 `index.html`，打开 DevTools Console，确认没有 font loading 错误。页面标题应为宋体，正文应为黑体。

- [ ] **Step 3: Commit**

```bash
git add shared/css/variables-warm.css
git commit -m "style: add Noto Serif SC / Noto Sans SC Chinese fonts"
```

---

### Task 2: 添加 SVG 装饰层到 body::after

**Files:**
- Modify: `shared/css/base.css`

**Consumes:** Existing `body::before` dot grid (line 29-38 in base.css)

**Produces:** `body::after` pseudo-element with inline SVG containing math/stats decorative elements

- [ ] **Step 1: 在 base.css 中添加 SVG 装饰层**

在 `body::before` 规则之后（约第 38 行之后），`main` 规则之前，添加：

```css
/* SVG decoration layer — math curves, scatter plots, hex grids */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3Cstyle%3E.path %7B fill: none; stroke: %233b82f6; stroke-width: 1.5; %7D %3C/style%3E%3C/defs%3E%3Cpath class='path' d='M0,400 Q75,200 150,400 T300,400 T450,400 T600,400 T750,400 T900,400 T1050,400 T1200,400'/%3E%3Cpath class='path' d='M0,400 C100,400 150,250 200,250 C250,250 300,200 350,200 C400,200 450,250 500,250 C550,250 600,400 600,400 C600,400 650,250 700,250 C750,250 800,200 850,200 C900,200 950,250 1000,250 C1050,250 1100,400 1200,400'/%3E%3Cpath class='path' d='M100,100 Q300,700 600,700 Q900,700 1100,100'/%3E%3Ccircle cx='200' cy='300' r='4' fill='%233b82f6'/%3E%3Ccircle cx='250' cy='280' r='4' fill='%233b82f6'/%3E%3Ccircle cx='300' cy='320' r='4' fill='%233b82f6'/%3E%3Ccircle cx='350' cy='290' r='4' fill='%233b82f6'/%3E%3Ccircle cx='400' cy='310' r='4' fill='%233b82f6'/%3E%3Ccircle cx='450' cy='270' r='4' fill='%233b82f6'/%3E%3Ccircle cx='500' cy='300' r='4' fill='%233b82f6'/%3E%3Ccircle cx='550' cy='260' r='4' fill='%233b82f6'/%3E%3Ccircle cx='600' cy='290' r='4' fill='%233b82f6'/%3E%3Ccircle cx='650' cy='280' r='4' fill='%233b82f6'/%3E%3Ccircle cx='700' cy='310' r='4' fill='%233b82f6'/%3E%3Ccircle cx='750' cy='270' r='4' fill='%233b82f6'/%3E%3Ccircle cx='800' cy='300' r='4' fill='%233b82f6'/%3E%3Ccircle cx='850' cy='260' r='4' fill='%233b82f6'/%3E%3Ccircle cx='900' cy='290' r='4' fill='%233b82f6'/%3E%3Ccircle cx='950' cy='280' r='4' fill='%233b82f6'/%3E%3Ccircle cx='1000' cy='310' r='4' fill='%233b82f6'/%3E%3Ccircle cx='1050' cy='270' r='4' fill='%233b82f6'/%3E%3Ccircle cx='1100' cy='300' r='4' fill='%233b82f6'/%3E%3Cpath class='path' d='M50,600 L70,585 L90,600 L90,630 L70,645 L50,630Z'/%3E%3Cpath class='path' d='M95,600 L115,585 L135,600 L135,630 L115,645 L95,630Z'/%3E%3Cpath class='path' d='M140,600 L160,585 L180,600 L180,630 L160,645 L140,630Z'/%3E%3Crect x='950' y='550' width='20' height='60' fill='%233b82f6' opacity='0.5' rx='2'/%3E%3Crect x='980' y='520' width='20' height='90' fill='%233b82f6' opacity='0.5' rx='2'/%3E%3Crect x='1010' y='500' width='20' height='110' fill='%233b82f6' opacity='0.5' rx='2'/%3E%3Crect x='1040' y='530' width='20' height='80' fill='%233b82f6' opacity='0.5' rx='2'/%3E%3Crect x='1070' y='560' width='20' height='50' fill='%233b82f6' opacity='0.5' rx='2'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
```

SVG 包含：正弦波、正态分布曲线、抛物线、散点图、六边形网格、柱状图。所有元素使用 `stroke: #3b82f6`（accent 色），透明度 0.06。

- [ ] **Step 2: 验证 SVG 层正确叠加**

打开首页，背景应可见微弱的蓝色曲线和散点图。打开 DevTools 检查 `body::after` 伪元素是否正确渲染。

- [ ] **Step 3: Commit**

```bash
git add shared/css/base.css
git commit -m "style: add SVG decoration layer to body background"
```

---

### Task 3: 移动端 SVG 装饰层降密度

**Files:**
- Modify: `shared/css/base.css`

**Consumes:** Task 2's `body::after` rule

**Produces:** Reduced SVG decoration opacity on mobile (< 768px)

- [ ] **Step 1: 在 base.css 末尾添加移动端适配**

在 `shared/css/base.css` 文件末尾添加：

```css
/* Reduce SVG decoration density on mobile */
@media (max-width: 768px) {
  body::after {
    opacity: 0.03;
    background-size: 1.5x cover;
  }
}
```

- [ ] **Step 2: 验证移动端效果**

用 DevTools 切换到 375px 宽度，确认 SVG 装饰层更淡，不干扰内容。

- [ ] **Step 3: Commit**

```bash
git add shared/css/base.css
git commit -m "style: reduce SVG decoration opacity on mobile"
```

---

### Task 4: 标题艺术字增强

**Files:**
- Modify: `shared/css/components.css`

**Consumes:** Existing `.hero-title` (index.html inline styles), `.content-block h2`, `.stat-number`

**Produces:** Enhanced title glow, section heading shadow, improved stat numbers

- [ ] **Step 1: 增强 Hero 标题发光效果**

在 `shared/css/components.css` 中找到 `.hero-title` 相关样式（index.html 中有内联样式，但我们需要在 components.css 中覆盖/增强）。由于 hero-title 是内联在 index.html 的 `<style>` 块中，我们在 components.css 中添加覆盖规则：

```css
/* Enhanced hero title glow */
.hero-title {
  text-shadow: 0 0 40px rgba(96, 165, 250, 0.15);
}
```

- [ ] **Step 2: 增强章节标题 (h2) 光晕**

在 `shared/css/components.css` 中找到 `.content-block h2` 相关样式（pages.css 第 209-217 行），添加 `::after` 光晕伪元素：

```css
.content-block h2::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--accent), transparent);
  opacity: 0.3;
  filter: blur(3px);
  pointer-events: none;
}
```

- [ ] **Step 3: 增强统计数字字体**

确保 `.stat-number` 使用宋体加粗：

```css
.stat-number {
  font-family: var(--font-display);
  font-weight: 700;
}
```

（检查 pages.css 第 762-768 行，确认已有 `font-family: var(--font-display)` 和 `font-weight: 800`，保持不动）

- [ ] **Step 4: 验证标题效果**

打开知识点页面，h2 标题左侧应有模糊蓝色光晕。打开首页，hero 标题应有微妙发光。

- [ ] **Step 5: Commit**

```bash
git add shared/css/components.css
git commit -m "style: enhance title typography with glow effects"
```

---

### Task 5: 学科卡片装饰增强

**Files:**
- Modify: `shared/css/components.css`

**Consumes:** Existing `.subject-card` styles (index.html 内联 `border-top` 颜色)

**Produces:** Card corner gradient decoration, enhanced hover

- [ ] **Step 1: 添加卡片右上角圆形装饰**

在 `shared/css/components.css` 中添加：

```css
/* Decorative corner gradient on subject cards */
.subject-card::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.08;
  pointer-events: none;
}

.subject-card:nth-child(1)::before {
  background: #f59e0b;
}

.subject-card:nth-child(2)::before {
  background: #3b82f6;
}
```

- [ ] **Step 2: 验证卡片效果**

打开学科首页，每张卡片右上角应有对应主题的半透明圆形装饰。

- [ ] **Step 3: Commit**

```bash
git add shared/css/components.css
git commit -m "style: add decorative corner gradients to subject cards"
```

---

### Task 6: Hero 区域粒子 Canvas 层级保障

**Files:**
- Modify: `shared/css/components.css`

**Consumes:** Existing `.hero-canvas` (index.html 内联样式)

**Produces:** Ensures particle canvas renders between SVG decoration and hero text

- [ ] **Step 1: 添加粒子 canvas 样式**

在 `shared/css/components.css` 中添加：

```css
/* Particle canvas — between SVG decoration and hero text */
.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
```

- [ ] **Step 2: 验证粒子效果**

打开首页，粒子网络应在 hero 区域正确显示，鼠标移动时有排斥效果。SVG 装饰层在粒子之下（更淡）。

- [ ] **Step 3: Commit**

```bash
git add shared/css/components.css
git commit -m "style: ensure particle canvas z-index layering"
```

---

### Task 7: 清理 Demo 文件

**Files:**
- Delete: `visual-demo.html`

**Consumes:** All previous tasks completed and verified

**Produces:** Clean repo with no demo artifacts

- [ ] **Step 1: 删除 Demo 文件**

```bash
rm visual-demo.html
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove visual demo file"
```

---

## Self-Review

**Spec coverage:**
- SVG 装饰层 → Task 2, Task 3 (mobile)
- 中文字体 → Task 1
- 标题艺术字 → Task 4
- 粒子效果保留 → Task 6
- 卡片装饰 → Task 5
- 清理 → Task 7

**Placeholder scan:** No TBD/TODO/placeholder patterns found. All CSS rules are complete with exact values.

**Type consistency:** All CSS variable references (`--font-display`, `--font-body`, `--accent`, `--success`, etc.) match existing definitions in `variables-warm.css`.

**Performance:** SVG is inline data URI (zero HTTP requests). Font uses `display=swap` (no render blocking). Particle canvas uses `requestAnimationFrame` (unchanged from original).
