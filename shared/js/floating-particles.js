// Floating particles for content areas — lightweight, non-interactive
var FloatingParticles = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,
  isMobile: false,

  init: function(container) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;';
    container.style.position = 'relative';
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.isMobile = window.innerWidth < 768;

    var count = this.isMobile ? 15 : 30;
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    this.canvas.width = w;
    this.canvas.height = h;

    this.particles = [];
    for (var i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        drift: Math.random() * 0.002 - 0.001
      });
    }

    this.animate();

    var self = this;
    window.addEventListener('resize', function() {
      var cw = container.offsetWidth;
      var ch = container.offsetHeight;
      self.canvas.width = cw;
      self.canvas.height = ch;
    });
  },

  animate: function() {
    var ctx = this.ctx;
    var particles = this.particles;
    var w = this.canvas.width;
    var h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx += p.drift;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(147, 197, 253, ' + p.opacity + ')';
      ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.animate.bind(this));
  },

  destroy: function() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
};
