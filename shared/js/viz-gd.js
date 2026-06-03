var GDVisualizer = {
  init: function(canvasId, config) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var lr = config.learningRate || 0.1;
    var iterations = config.iterations || 20;
    var startX = config.startX || 8;
    var startY = config.startY || 8;
    var funcType = config.function || 'quadratic';

    ctx.clearRect(0, 0, w, h);
    this.drawContour(ctx, w, h, funcType);
    this.drawPath(ctx, w, h, startX, startY, lr, iterations, funcType);
  },

  drawContour: function(ctx, w, h, funcType) {
    var cx = w / 2, cy = h / 2, scale = 20;

    // Draw grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    for (var gx = 0; gx < w; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (var gy = 0; gy < h; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // Draw contour ellipses for quadratic (z = x^2 + y^2)
    if (funcType === 'quadratic') {
      for (var r = 1; r < 12; r++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * scale, r * scale, 0, 0, Math.PI * 2);
        ctx.strokeStyle = r % 3 === 0 ? '#cbd5e1' : '#e2e8f0';
        ctx.lineWidth = r % 3 === 0 ? 1 : 0.5;
        ctx.stroke();
      }
    } else if (funcType === 'rosenbrock') {
      // Rosenbrock: banana-shaped contours (simplified)
      for (var r = 1; r < 10; r++) {
        ctx.beginPath();
        var ry = r * scale * 0.7;
        ctx.ellipse(cx + 40, cy, r * scale * 0.5, ry, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = r % 3 === 0 ? '#cbd5e1' : '#e2e8f0';
        ctx.lineWidth = r % 3 === 0 ? 1 : 0.5;
        ctx.stroke();
      }
    }

    // Axes
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('θ₁', w - 20, cy - 8);
    ctx.fillText('θ₂', cx + 6, 16);
  },

  drawPath: function(ctx, w, h, startX, startY, lr, iters, funcType) {
    var cx = w / 2, cy = h / 2, scale = 20;
    var points = [{x: startX, y: startY}];
    var px = startX, py = startY;

    for (var i = 0; i < iters; i++) {
      var gx, gy;
      if (funcType === 'rosenbrock') {
        // Rosenbrock: f(x,y) = (1-x)^2 + 100*(y-x^2)^2
        gx = -2 * (1 - px) - 400 * px * (py - px * px);
        gy = 200 * (py - px * px);
      } else {
        // Quadratic: f(x,y) = x^2 + y^2
        gx = 2 * px;
        gy = 2 * py;
      }
      px = px - lr * gx;
      py = py - lr * gy;
      // Clamp for display
      px = Math.max(-12, Math.min(12, px));
      py = Math.max(-12, Math.min(12, py));
      points.push({x: px, y: py});

      // Early stop if converged
      if (Math.abs(gx) < 0.001 && Math.abs(gy) < 0.001) break;
    }

    // Draw path line with gradient color
    for (var j = 1; j < points.length; j++) {
      var sx = cx + points[j-1].x * scale;
      var sy = cy + points[j-1].y * scale;
      var ex = cx + points[j].x * scale;
      var ey = cy + points[j].y * scale;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);

      // Color gradient: amber → blue as it converges
      var progress = j / points.length;
      var r = Math.round(245 - progress * 186);
      var gVal = Math.round(158 - progress * 99);
      var b = Math.round(11 + progress * 235);
      ctx.strokeStyle = 'rgb(' + r + ',' + gVal + ',' + b + ')';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Start marker
    var sx0 = cx + startX * scale;
    var sy0 = cy + startY * scale;
    this.drawDot(ctx, sx0, sy0, '#f59e0b', 'Start (' + startX.toFixed(1) + ',' + startY.toFixed(1) + ')');

    // End marker
    var lastP = points[points.length - 1];
    var ex0 = cx + lastP.x * scale;
    var ey0 = cy + lastP.y * scale;
    this.drawDot(ctx, ex0, ey0, '#22c55e', 'End (' + lastP.x.toFixed(2) + ',' + lastP.y.toFixed(2) + ')');

    // Legend
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('lr=' + lr + ', iters=' + (points.length - 1), 12, h - 12);
    ctx.fillText('● Start', 12, 20);
    ctx.fillText('● End', 12, 36);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('●', 3, 21);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('●', 3, 37);
  },

  drawDot: function(ctx, x, y, color, label) {
    // Outer glow
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px sans-serif';
    var labelX = x + 12;
    var labelY = y + 4;
    if (labelX + ctx.measureText(label).width > ctx.canvas.width - 10) {
      labelX = x - ctx.measureText(label).width - 12;
    }
    ctx.fillText(label, labelX, labelY);
  }
};

// Auto-initialize visualization blocks when DOM is ready
(function() {
  if (typeof document !== 'undefined') {
    var initViz = function() {
      var containers = document.querySelectorAll('.viz-container[data-algo="gradient-descent"]');
      for (var i = 0; i < containers.length; i++) {
        var canvas = containers[i].querySelector('canvas');
        if (canvas) {
          var config = {};
          try { config = JSON.parse(containers[i].getAttribute('data-config') || '{}'); } catch(e) {}
          GDVisualizer.init(canvas.id, config);
        }
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { setTimeout(initViz, 200); });
    } else {
      setTimeout(initViz, 200);
    }
  }
})();
