# Homepage Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Stat-Lab homepage with a dark Canvas particle network background, larger typography (16px base), animated Hero section with gradient title, stats counter bar, and enhanced subject cards.

**Architecture:** Five sequential tasks. Task 1 upgrades typography/base CSS. Task 2 builds the Canvas particle network. Task 3 enhances the Hero HTML/CSS. Task 4 adds the stats counter bar. Task 5 enhances subject cards with hover effects and staggered entrance. Each task is independently testable by opening `index.html` in a browser.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas API, CSS animations, IntersectionObserver for scroll-triggered animations

## Global Constraints

- Zero external dependencies (no CDN, no images, no font downloads) — use system fonts only
- Canvas particle network must be performant (requestAnimationFrame, max 60fps, mobile reduces particles to 40)
- Navbar remains unchanged (white, 56px, `var(--navbar-height)`)
- Base font-size increases from 14px to 16px
- All animations use CSS transforms and opacity only (GPU-accelerated)

---

### Task 1: Typography Upgrade — Base Font Size & Heading Scale

**Files:**
- Modify: `shared/css/base.css:8-57`

**Interfaces:**
- Consumes: Current `:root` and `html` selectors in base.css
- Produces: Updated font-size baseline (16px), new heading scales (h1: 3.5rem, h2: 2.5rem, h3: 1.5rem)

**Step 1: Update base font-size and headings in base.css**

In `shared/css/base.css`, change:

Line 9: `font-size: 14px;` → `font-size: 16px;`

Lines 54-57 (heading sizes):
```css
h1 { font-size: 3.5rem; margin-bottom: 0.5rem; }
h2 { font-size: 2.5rem; margin-bottom: 0.4rem; }
h3 { font-size: 1.5rem; margin-bottom: 0.3rem; }
```

Also update `--navbar-height` in `variables-warm.css` line 46 from `56px` to `56px` (keep same, no change needed).

Update body line-height in base.css line 20: `line-height: 1.7;` → `line-height: 1.75;`

**Step 2: Verify in browser**

Open `index.html` in browser. Confirm:
- Body text is noticeably larger
- All headings scale up proportionally
- No layout breakage in existing pages (they inherit the base font-size)
- Navbar text is still readable

**Step 3: Commit**

```bash
git add shared/css/base.css
git commit -m "style: upgrade base font-size to 16px and enlarge headings"
```

---

### Task 2: Canvas Particle Network

**Files:**
- Create: `shared/js/particle-network.js`
- Modify: `index.html:1-53` (add canvas + script)

**Interfaces:**
- Consumes: None (standalone module)
- Produces: `initParticleNetwork(canvasEl, options)` function that starts the animation loop

**Step 1: Create particle-network.js**

Create `shared/js/particle-network.js`:

```javascript
// Particle network background for homepage Hero section
var ParticleNetwork = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,
  mouse: { x: null, y: null, radius: 150 },
  isMobile: false,

  init: function(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isMobile = window.innerWidth < 768 || ('ontouchstart' in window);

    var count = this.isMobile ? 40 : 100;
    var maxSpeed = this.isMobile ? 0.5 : 0.8;

    this.particles = [];
    for (var i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * maxSpeed * 2,
        vy: (Math.random() - 0.5) * maxSpeed * 2,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    canvas.width = width;
    canvas.height = height;

    canvas.addEventListener('mousemove', (function(e) {
      var rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }).bind(this));

    canvas.addEventListener('mouseleave', (function() {
      this.mouse.x = null;
      this.mouse.y = null;
    }).bind(this));

    window.addEventListener('resize', (function() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }).bind(this));

    this.animate();
  },

  animate: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var particles = this.particles;
    var w = this.canvas.width;
    var h = this.canvas.height;
    var mouse = this.mouse;
    var connectionDist = this.isMobile ? 100 : 120;

    // Update positions
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          var force = (mouse.radius - dist) / mouse.radius * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Wrap edges
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    }

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          var opacity = (1 - dist / connectionDist) * 0.4;
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'rgba(147, 197, 253, ' + opacity + ')';
          this.ctx.lineWidth = 0.8;
          this.ctx.moveTo(particles[i].x, particles[i].y);
          this.ctx.lineTo(particles[j].x, particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(147, 197, 253, ' + p.opacity + ')';
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame((function() { this.animate(); }).bind(this));
  },

  destroy: function() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
};
```

**Step 2: Update index.html Hero section**

Replace the current `<style>` block and hero div in `index.html` with:

```html
<style>
  .hero-section {
    position: relative;
    width: 100%;
    min-height: 420px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    padding: 40px 20px;
  }

  .hero-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #60a5fa, #a78bfa, #60a5fa);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s ease-in-out infinite;
    margin-bottom: 12px;
    letter-spacing: -0.03em;
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: #94a3b8;
    opacity: 0;
    animation: fadeIn 0.8s ease-out 0.5s forwards;
    margin-bottom: 20px;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  .hero-divider {
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
    margin: 0 auto;
    animation: expandWidth 1s ease-out 0.8s forwards;
  }

  @keyframes expandWidth {
    to { width: 80px; }
  }
</style>
```

Replace the current `<div class="home-hero">` with:

```html
<div class="hero-section">
  <canvas class="hero-canvas" id="particle-canvas"></canvas>
  <div class="hero-content">
    <h1 class="hero-title">Stat-Lab</h1>
    <p class="hero-subtitle">统计学习平台 · 经济统计学 + 统计计算</p>
    <div class="hero-divider"></div>
  </div>
</div>
```

Update the script at the bottom of `index.html` to initialize the particle network:

```html
<script src="shared/js/particle-network.js"></script>
<script src="shared/js/storage.js"></script>
<script src="shared/js/router.js"></script>
<script>
(function() {
  // Initialize particle network
  var canvas = document.getElementById('particle-canvas');
  if (canvas) {
    var parent = canvas.parentElement;
    ParticleNetwork.init(canvas, parent.offsetWidth, parent.offsetHeight);
  }

  // ... rest of existing card rendering code unchanged ...
})();
</script>
```

**Step 3: Verify in browser**

Open `index.html`. Confirm:
- Dark gradient background fills the Hero area
- Particles float and connect with blue lines
- Moving mouse near particles pushes them away
- Title has blue-purple gradient shimmer
- Subtitle fades in after 0.5s
- Divider line expands from center after 0.8s
- Mobile viewport shows fewer particles

**Step 4: Commit**

```bash
git add shared/js/particle-network.js index.html
git commit -m "feat: add canvas particle network background with mouse interaction"
```

---

### Task 3: Stats Counter Bar

**Files:**
- Modify: `index.html` (add stats bar HTML between hero and subject cards)
- Modify: `shared/css/pages.css` (add stats bar styles)
- Modify: `shared/js/particle-network.js` — no, create `shared/js/stats-counter.js`

Actually, keep it simple: add stats bar HTML inline in index.html and CSS in pages.css, JS inline in the existing script.

**Step 1: Add stats bar HTML to index.html**

After the hero section `</div>`, before `<div id="subject-cards">`, insert:

```html
<div class="stats-bar" id="stats-bar">
  <div class="stats-container">
    <div class="stat-item">
      <span class="stat-number" data-target="13">0</span>
      <span class="stat-label">章节</span>
    </div>
    <div class="stat-item">
      <span class="stat-number" data-target="250">0</span>
      <span class="stat-label">题库</span>
    </div>
    <div class="stat-item">
      <span class="stat-number" data-target="100">0</span>
      <span class="stat-label">知识点</span>
    </div>
    <div class="stat-item">
      <span class="stat-number" data-target="2">0</span>
      <span class="stat-label">学科</span>
    </div>
  </div>
</div>
```

**Step 2: Add stats bar styles to pages.css**

Append to `shared/css/pages.css`:

```css
/* ===== Stats Bar ===== */
.stats-bar {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 24px 20px;
  position: relative;
  z-index: 1;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 48px;
  max-width: 800px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  min-width: 100px;
}

.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent);
  line-height: 1.2;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}
```

**Step 3: Add counter animation to index.html script**

In the existing IIFE in `index.html`, after the particle network init, add:

```javascript
// Stats counter animation
var statNumbers = document.querySelectorAll('.stat-number');
var counted = false;

function animateCount(el) {
  var target = parseInt(el.getAttribute('data-target'));
  var duration = 1500;
  var start = 0;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + '+';
    }
  }

  requestAnimationFrame(step);
}

// Trigger when stats bar enters viewport
if (typeof IntersectionObserver !== 'undefined') {
  var statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(function(el) { animateCount(el); });
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(statsBar);
  }
}
```

**Step 4: Verify in browser**

Open `index.html`. Confirm:
- Stats bar appears below Hero with white background
- Four stat items centered: 13 章节, 250+ 题库, 100+ 知识点, 2 学科
- Numbers count up from 0 when scrolled into view
- Accent color matches brand blue

**Step 5: Commit**

```bash
git add index.html shared/css/pages.css
git commit -m "feat: add animated stats counter bar below hero section"
```

---

### Task 4: Enhanced Subject Cards

**Files:**
- Modify: `shared/css/components.css` (enhanced card styles)
- Modify: `index.html` (updated card HTML template)

**Step 1: Enhance card CSS in components.css**

Replace the existing `.subject-card` styles in `shared/css/components.css` (lines 134-225):

```css
/* ===== Subject Card ===== */
.subject-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 36px 28px;
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-fast);
  position: relative;
  overflow: hidden;
  animation: fadeSlideIn 0.4s ease-out both;
}

.subject-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--subject-color), var(--subject-color-deep));
  opacity: 0.6;
  transition: opacity var(--transition-fast), height var(--transition-fast);
}

.subject-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: var(--subject-color);
}

.subject-card:hover::before {
  opacity: 1;
  height: 4px;
}

.subject-card .card-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
  transition: transform var(--transition-base);
}

.subject-card:hover .card-icon {
  transform: scale(1.1);
}

.subject-card h3 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 700;
}

.subject-card p {
  color: var(--text-secondary);
  margin-bottom: 14px;
  font-size: 0.95rem;
  line-height: 1.65;
}

.subject-card .card-meta {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.subject-card .card-meta span {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  background: var(--accent-soft);
  color: var(--accent);
  margin: 3px 4px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid var(--accent-border);
}

.subject-card .enter-btn {
  display: inline-block;
  padding: 12px 36px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.subject-card .enter-btn:hover {
  background: var(--accent-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
  color: #fff;
}
```

**Step 2: Update card HTML template in index.html**

Replace the card rendering IIFE in `index.html`:

```javascript
(function() {
  var cardsHtml = '';
  for (var i = 0; i < SUBJECT_REGISTRY.length; i++) {
    var subj = SUBJECT_REGISTRY[i];
    var toolNames = { knowledge: '知识点', quiz: '测验', calculators: '计算器', lab: '实验' };
    var toolsHtml = subj.tools.map(function(t) { return '<span>' + (toolNames[t] || t) + '</span>'; }).join(' ');
    var chapterCount = subj.chapters.length;
    var questionCount = subj.id === 'econstats' ? '125题' : '100+题';
    var desc = subj.id === 'econstats' ? 'GDP核算、价格指数、产业统计、住户调查' : '模拟仿真、优化方法、机器学习、数据可视化';
    cardsHtml += '' +
      '<div class="subject-card" style="--i:' + i + ';border-color:var(--border);border-top:2px solid ' + subj.color + ';">' +
        '<span class="card-icon">' + subj.icon + '</span>' +
        '<h3 style="color:var(--text-primary);">' + subj.name + '</h3>' +
        '<p>' + desc + '</p>' +
        '<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:10px;">' + chapterCount + ' 章节 · ' + questionCount + '</div>' +
        '<div class="card-meta">' + toolsHtml + '</div>' +
        '<a href="subjects/' + subj.id + '/index.html" class="enter-btn" style="background:var(--accent);">进入 →</a>' +
      '</div>';
  }
  document.getElementById('subject-cards').innerHTML = cardsHtml;
  injectNavbar('home');
})();
```

**Step 3: Verify in browser**

Open `index.html`. Confirm:
- Icons are larger (4rem) and scale up on hover
- Titles are bigger (1.75rem)
- Cards lift 6px on hover with enhanced shadow
- Top bar gradient intensifies on hover
- Description text and chapter/question count shown
- Tool badges more prominent
- "进入" button scales and glows on hover
- Staggered entrance animation works (cards appear one by one)

**Step 4: Commit**

```bash
git add shared/css/components.css index.html
git commit -m "feat: enhance subject cards with larger icons, hover effects, and detail rows"
```

---

### Task 5: Polish — Entrance Animations & Responsive Fixes

**Files:**
- Modify: `shared/css/base.css` (add entrance animation keyframes)
- Modify: `shared/css/components.css` (ensure stagger delays work)
- Modify: `shared/css/pages.css` (mobile adjustments for hero/stats)

**Step 1: Ensure stagger animation works in components.css**

The `--i` CSS custom property is already set inline in the HTML. Add this to `shared/css/components.css` after the `.subject-card` rules:

```css
.subject-card {
  animation-delay: calc(var(--i, 0) * 100ms);
}
```

Also ensure the `fadeSlideIn` keyframe exists in `base.css` (it already does at line 120-123).

**Step 2: Add mobile responsiveness for hero**

Append to `shared/css/pages.css`:

```css
/* ===== Hero Mobile ===== */
@media (max-width: 768px) {
  .hero-section {
    min-height: 320px;
    padding: 30px 16px;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .stats-container {
    gap: 24px;
  }
  .stat-item {
    min-width: 70px;
  }
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 0.9rem;
  }
}
```

**Step 3: Final verification**

Open `index.html` in browser at multiple widths:
- Desktop (1920px): Hero full-width, 4 stats in a row, cards side by side
- Tablet (768px): Stats wrap to 2x2 grid, hero title scales down
- Mobile (375px): Single column, reduced font sizes, fewer particles

Check:
- No horizontal scroll on any width
- Text contrast meets WCAG AA (light gray text on dark hero background)
- Particle network stops smoothly if user navigates away
- All animations play once on page load (no jank)

**Step 4: Commit**

```bash
git add shared/css/base.css shared/css/components.css shared/css/pages.css
git commit -m "style: polish entrance animations, stagger delays, and mobile responsiveness"
```

---

## Execution Order

1. Task 1 → 2 → 3 → 4 → 5 (sequential, each builds on the previous)
2. Each task is independently testable by opening `index.html`
3. Total estimated time: 30-45 minutes
