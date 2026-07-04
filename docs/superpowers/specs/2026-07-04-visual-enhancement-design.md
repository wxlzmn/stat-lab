# Stat-Lab 视觉增强设计文档

> 日期: 2026-07-04
> 状态: 已批准

## 目标

提升全站视觉丰富度，解决背景单调、字体平淡的问题，采用科技抽象风格，引入 SVG 装饰层和中文字体。

## 方案概要

### 1. SVG 装饰层 (`base.css`)

- **Layer 1（保留）**: `body::before` — 点阵网格，`opacity: 0.3`
- **Layer 2（新增）**: `body::after` — SVG 装饰层，`opacity: 0.06`，包含：
  - 正弦波曲线
  - 正态分布曲线
  - 散点图数据点
  - 六边形网格片段
  - 柱状图轮廓
- **Layer 3（新增）**: 学科卡片右上角彩色圆形装饰（`::before`）

### 2. 中文字体引入 (`variables-warm.css`)

- **标题**: Noto Serif SC (思源宋体) — 学术感、权威感
- **正文**: Noto Sans SC (思源黑体) — 清晰易读
- **英文**: 保持 Inter
- 通过 `@import` 从 Google Fonts 加载

### 3. 标题艺术字增强 (`components.css`)

- Hero 标题: 渐变填充 + 发光动画（保留现有 shimmer，新增 `text-shadow` 光晕）
- 章节标题 (h2): 左边框增强 + 模糊光晕 (`::after` pseudo-element)
- 统计数字: 保持 `font-weight: 700` + 宋体

### 4. 粒子效果 (保留)

- `particle-network.js` 保持不变
- Hero 区域 canvas 层级在 SVG 装饰层之上、文字之下
- 鼠标交互效果保留（粒子排斥）

## 文件变更清单

| 文件 | 变更 |
|------|------|
| `shared/css/variables-warm.css` | 新增 `@import` 中文字体，更新 `--font-display` / `--font-body` |
| `shared/css/base.css` | 新增 `body::after` SVG 装饰层 |
| `shared/css/components.css` | 标题艺术字增强、卡片装饰、粒子 canvas 样式 |
| `visual-demo.html` | 预览文件，验证效果后删除 |

## 成功标准

- 背景有明显层次感，不再是纯白/纯灰
- 标题字体有辨识度，中英文搭配和谐
- 粒子效果正常工作，不被装饰层遮挡
- 移动端正常显示（SVG 装饰层在小屏上降低密度）
- 页面加载性能不受影响（字体缓存 + SVG 内联无请求）
