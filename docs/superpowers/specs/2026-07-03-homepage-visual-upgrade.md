# Homepage Visual Upgrade Design

**Date:** 2026-07-03
**Goal:** Transform the Stat-Lab homepage from a minimalist flat design into a visually engaging, animated experience with particle network background, larger typography, and rich micro-interactions.

**Architecture:** Single-page upgrade targeting `index.html` and associated CSS files. Canvas particle network rendered via vanilla JS in the Hero section. No external libraries.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas API, CSS animations

## Design Details

### 1. Hero Section — Dark Particle Network
- Full-width dark gradient background (`#0f172a` → `#1e293b`)
- Canvas element layered behind text, drawing floating particles connected by lines within proximity threshold
- Particles: 80-120 dots, speed 0.3-0.8 px/frame, connection distance 120px, line opacity fades with distance
- Title "Stat-Lab" centered, large, gradient text fill (blue → purple), breathing glow animation
- Subtitle "统计学习平台" fades in after title (0.5s delay)
- Divider line animates from 0 to full width

### 2. Stats Counter Bar
- Below Hero, light background, 3-4 stat cards:
  - Total chapters (13)
  - Total questions (250+)
  - Knowledge points (100+)
  - Subjects (2)
- Numbers animate counting up from 0 on scroll into view

### 3. Subject Cards — Enhanced
- Icon size: 4rem (from 2.8rem)
- Title: 1.75rem (from 1.35rem)
- New detail row: shows chapter count, question count, tool badges
- Hover: 3D lift effect (translateY -6px), colored glow border, top bar gradient intensifies
- Entrance: staggered fade-in + slide-up (60ms delay per card)

### 4. Typography Upgrade
- Base font-size: 16px (from 14px)
- h1: 3.5rem (from 2.4rem)
- h2: 2.5rem
- h3: 1.5rem (from 1.15rem)
- Body text: 1rem with 1.75 line-height

### 5. Animation System
- Page load: staggered entrance for all sections
- Hero title: gradient shimmer animation (infinite loop, subtle)
- Particles: continuous motion, mouse interaction (particles repel slightly near cursor)
- Cards: hover scale + shadow + border glow
- Stats: count-up animation triggered on visibility

### Files Modified
- `index.html` — Hero section, Canvas, stats bar, enhanced card HTML
- `shared/css/base.css` — Typography scale, body font-size, new animations
- `shared/css/components.css` — Enhanced card styles, button animations, new stat card styles
- `shared/css/pages.css` — Hero section styles, stats bar, page-specific layouts
- `shared/js/router.js` — Particle network init, stats counter logic, mouse interaction

### Files Created
- None (all existing files extended)

### Constraints
- Zero external dependencies (no CDN, no images)
- Canvas particle network must be performant (requestAnimationFrame, max 60fps)
- Must work on mobile (reduce particle count, disable mouse interaction)
- Maintain accessibility (contrast ratios, semantic HTML)
- Navbar remains unchanged (white, 56px)
