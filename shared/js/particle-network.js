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
