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

