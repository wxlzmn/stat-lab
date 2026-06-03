var TreeVisualizer = {
  init: function(canvasId, config) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;

    // Generate synthetic 2D classification data
    var data = this.generateData(config);
    var tree = this.buildSimpleTree(data, config.maxDepth || 3);

    ctx.clearRect(0, 0, w, h);

    // Draw data points
    var margin = { left: 60, right: 20, top: 20, bottom: 40 };
    var pw = w - margin.left - margin.right;
    var ph = h - margin.top - margin.bottom;

    // Find data bounds
    var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (var i = 0; i < data.length; i++) {
      if (data[i].x < xMin) xMin = data[i].x;
      if (data[i].x > xMax) xMax = data[i].x;
      if (data[i].y < yMin) yMin = data[i].y;
      if (data[i].y > yMax) yMax = data[i].y;
    }
    xMin -= 0.5; xMax += 0.5; yMin -= 0.5; yMax += 0.5;

    // Draw decision boundaries recursively
    this.drawBoundaries(ctx, tree, margin.left, margin.top, pw, ph, xMin, xMax, yMin, yMax, 0);

    // Draw axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top); ctx.lineTo(margin.left, margin.top + ph);
    ctx.moveTo(margin.left, margin.top + ph); ctx.lineTo(margin.left + pw, margin.top + ph);
    ctx.stroke();

    // Draw data points on top
    for (var j = 0; j < data.length; j++) {
      var sx = margin.left + (data[j].x - xMin) / (xMax - xMin) * pw;
      var sy = margin.top + (1 - (data[j].y - yMin) / (yMax - yMin)) * ph;

      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = data[j].label === 0 ? '#3b82f6' : '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Legend
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(margin.left, h - 20, 10, 10);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px sans-serif';
    ctx.fillText('Class A', margin.left + 14, h - 10);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(margin.left + 80, h - 20, 10, 10);
    ctx.fillText('Class B', margin.left + 94, h - 10);

    ctx.fillText('maxDepth=' + (config.maxDepth || 3) + '  |  n=' + data.length, w - 200, h - 10);
  },

  generateData: function(config) {
    var n = config.n || 50;
    var seed = config.seed || 42;
    var data = [];

    // Simple pseudo-random
    var rng = this.simpleRNG(seed);

    for (var i = 0; i < n; i++) {
      var label = rng() > 0.5 ? 1 : 0;
      var x, y;
      if (label === 0) {
        x = rng() * 3 + 0.5;
        y = rng() * 3 + 0.5;
      } else {
        x = rng() * 3 + 4.5;
        y = rng() * 3 + 4.5;
      }
      data.push({ x: x + (rng() - 0.5) * 2, y: y + (rng() - 0.5) * 2, label: label });
    }
    return data;
  },

  simpleRNG: function(seed) {
    var s = seed;
    return function() {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s >> 16) / 32768;
    };
  },

  buildSimpleTree: function(data, maxDepth, depth) {
    depth = depth || 0;
    if (depth >= maxDepth || data.length < 5) {
      // Leaf node: majority vote
      var count0 = 0, count1 = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].label === 0) count0++; else count1++;
      }
      return { isLeaf: true, value: count0 >= count1 ? 0 : 1 };
    }

    // Find best split (simple greedy: try splitting on x median, y median, pick best gini)
    var splitFeature = depth % 2 === 0 ? 'x' : 'y'; // alternate features
    var sorted = data.slice().sort(function(a, b) { return a[splitFeature] - b[splitFeature]; });
    var mid = Math.floor(sorted.length / 2);
    var threshold = sorted[mid][splitFeature];

    var left = [];
    var right = [];
    for (var j = 0; j < data.length; j++) {
      if (data[j][splitFeature] <= threshold) left.push(data[j]);
      else right.push(data[j]);
    }

    if (left.length === 0 || right.length === 0) {
      var c0 = 0, c1 = 0;
      for (var k = 0; k < data.length; k++) {
        if (data[k].label === 0) c0++; else c1++;
      }
      return { isLeaf: true, value: c0 >= c1 ? 0 : 1 };
    }

    return {
      isLeaf: false,
      feature: splitFeature,
      threshold: threshold,
      left: this.buildSimpleTree(left, maxDepth, depth + 1),
      right: this.buildSimpleTree(right, maxDepth, depth + 1)
    };
  },

  drawBoundaries: function(ctx, node, mx, my, pw, ph, xMin, xMax, yMin, yMax, depth) {
    if (node.isLeaf) {
      // Fill leaf region with semi-transparent color
      ctx.fillStyle = node.value === 0 ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)';
      ctx.fillRect(mx, my, pw, ph);

      // Draw leaf border
      ctx.strokeStyle = node.value === 0 ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(mx, my, pw, ph);
      ctx.setLineDash([]);
      return;
    }

    var colors = ['#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

    if (node.feature === 'x') {
      // Vertical split
      var splitSx = mx + (node.threshold - xMin) / (xMax - xMin) * pw;

      // Draw split line
      ctx.strokeStyle = colors[depth % colors.length];
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(splitSx, my);
      ctx.lineTo(splitSx, my + ph);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label the split
      ctx.fillStyle = colors[depth % colors.length];
      ctx.font = 'bold 10px monospace';
      ctx.fillText('x ≤ ' + node.threshold.toFixed(1), splitSx + 4, my + 14);

      var leftW = splitSx - mx;
      this.drawBoundaries(ctx, node.left, mx, my, leftW, ph, xMin, node.threshold, yMin, yMax, depth + 1);
      this.drawBoundaries(ctx, node.right, splitSx, my, pw - leftW, ph, node.threshold, xMax, yMin, yMax, depth + 1);
    } else {
      // Horizontal split
      var splitSy = my + (1 - (node.threshold - yMin) / (yMax - yMin)) * ph;

      ctx.strokeStyle = colors[depth % colors.length];
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(mx, splitSy);
      ctx.lineTo(mx + pw, splitSy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = colors[depth % colors.length];
      ctx.font = 'bold 10px monospace';
      ctx.fillText('y ≤ ' + node.threshold.toFixed(1), mx + 4, splitSy - 4);

      var topH = splitSy - my;
      this.drawBoundaries(ctx, node.left, mx, my, pw, topH, xMin, xMax, yMin, node.threshold, depth + 1);
      this.drawBoundaries(ctx, node.right, mx, splitSy, pw, ph - topH, xMin, xMax, node.threshold, yMax, depth + 1);
    }
  }
};

(function() {
  if (typeof document !== 'undefined') {
    var initViz = function() {
      var containers = document.querySelectorAll('.viz-container[data-algo="decision-tree"]');
      for (var i = 0; i < containers.length; i++) {
        var canvas = containers[i].querySelector('canvas');
        if (canvas) {
          var config = {};
          try { config = JSON.parse(containers[i].getAttribute('data-config') || '{}'); } catch(e) {}
          TreeVisualizer.init(canvas.id, config);
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
