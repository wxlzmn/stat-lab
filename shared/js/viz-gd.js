/**
 * GDVisualizer — 梯度下降 2D 可视化
 * 用法: GDVisualizer.init('canvas-id', { function, learningRate, iterations, startX, startY })
 */
var GDVisualizer = (function() {
  'use strict';

  var canvas, ctx, w, h;
  var margin = { left: 70, bottom: 50, top: 20, right: 20 };

  function f_quadratic(x, y) { return x * x + y * y; }
  function grad_quadratic(x, y) { return [2 * x, 2 * y]; }

  function f_rosenbrock(x, y) {
    return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2);
  }
  function grad_rosenbrock(x, y) {
    var dx = -2 * (1 - x) - 400 * x * (y - x * x);
    var dy = 200 * (y - x * x);
    return [dx, dy];
  }

  function init(canvasId, config) {
    config = config || {};
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;

    var funcType = config.function || 'quadratic';
    var lr = config.learningRate || 0.1;
    var iters = config.iterations || 20;
    var sx = config.startX || 8;
    var sy = config.startY || 8;

    var f, grad, bounds;
    if (funcType === 'rosenbrock') {
      f = f_rosenbrock; grad = grad_rosenbrock;
      bounds = { xMin: -2, xMax: 2, yMin: -1, yMax: 5 };
    } else {
      f = f_quadratic; grad = grad_quadratic;
      var lim = Math.max(Math.abs(sx), Math.abs(sy)) + 2;
      bounds = { xMin: -lim, xMax: lim, yMin: -lim, yMax: lim };
    }

    var path = [];
    var x = sx, y = sy;
    for (var i = 0; i <= iters; i++) {
      path.push({ x: x, y: y, f: f(x, y) });
      var g = grad(x, y);
      x = x - lr * g[0];
      y = y - lr * g[1];
    }
    draw(funcType, bounds, path, lr);
  }

  function draw(funcType, bounds, path, lr) {
    ctx.clearRect(0, 0, w, h);
    var pw = w - margin.left - margin.right;
    var ph = h - margin.top - margin.bottom;
    var xMin = bounds.xMin, xMax = bounds.xMax;
    var yMin = bounds.yMin, yMax = bounds.yMax;

    function toX(val) { return margin.left + (val - xMin) / (xMax - xMin) * pw; }
    function toY(val) { return margin.top + (1 - (val - yMin) / (yMax - yMin)) * ph; }

    // Heatmap
    var grid = 50;
    var values = [];
    var fMin = Infinity, fMax = -Infinity;
    for (var gi = 0; gi <= grid; gi++) {
      for (var gj = 0; gj <= grid; gj++) {
        var cx = xMin + (xMax - xMin) * gi / grid;
        var cy = yMin + (yMax - yMin) * gj / grid;
        var fVal = funcType === 'rosenbrock' ?
          Math.pow(1 - cx, 2) + 100 * Math.pow(cy - cx * cx, 2) :
          cx * cx + cy * cy;
        if (fVal < fMin) fMin = fVal;
        if (fVal > fMax) fMax = fVal;
        values.push({ x: cx, y: cy, f: fVal });
      }
    }

    var cellW = pw / grid, cellH = ph / grid;
    for (var vi = 0; vi < values.length; vi++) {
      var v = values[vi];
      var t = (v.f - fMin) / (fMax - fMin + 1e-10);
      var r = Math.floor(30 + 200 * t);
      var g = Math.floor(30 + 200 * (1 - t));
      var b = Math.floor(60 + 180 * (1 - t));
      ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      ctx.fillRect(toX(v.x) - cellW / 2, toY(v.y) - cellH / 2, cellW + 1, cellH + 1);
    }

    // Axes
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    var ax0 = toY(0);
    if (ax0 > margin.top && ax0 < margin.top + ph)
      { ctx.moveTo(margin.left, ax0); ctx.lineTo(margin.left + pw, ax0); }
    var ay0 = toX(0);
    if (ay0 > margin.left && ay0 < margin.left + pw)
      { ctx.moveTo(ay0, margin.top); ctx.lineTo(ay0, margin.top + ph); }
    ctx.stroke();

    ctx.lineWidth = 2; ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top); ctx.lineTo(margin.left, margin.top + ph);
    ctx.moveTo(margin.left, margin.top + ph); ctx.lineTo(margin.left + pw, margin.top + ph);
    ctx.stroke();

    // Ticks
    ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    var xStep = (xMax - xMin) > 10 ? 2 : 1;
    for (var tx = Math.ceil(xMin); tx <= xMax; tx += xStep) {
      ctx.fillText(tx, toX(tx), margin.top + ph + 16);
      ctx.beginPath(); ctx.moveTo(toX(tx), margin.top + ph); ctx.lineTo(toX(tx), margin.top + ph + 4); ctx.stroke();
    }
    ctx.textAlign = 'right';
    var yStep = (yMax - yMin) > 10 ? 2 : 1;
    for (var ty = Math.ceil(yMin); ty <= yMax; ty += yStep) {
      ctx.fillText(ty, margin.left - 6, toY(ty) + 4);
      ctx.beginPath(); ctx.moveTo(margin.left - 4, toY(ty)); ctx.lineTo(margin.left, toY(ty)); ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillText('x', margin.left + pw / 2, margin.top + ph + 38);
    ctx.save();
    ctx.translate(12, margin.top + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('y', 0, 0);
    ctx.restore();

    // Path
    for (var pi = 0; pi < path.length; pi++) {
      var p = path[pi];
      var r = pi === 0 ? 5 : pi === path.length - 1 ? 5 : 3;
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), r, 0, Math.PI * 2);
      ctx.fillStyle = pi === 0 ? '#f59e0b' : pi === path.length - 1 ? '#22c55e' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
    }

    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(toX(path[0].x), toY(path[0].y));
    for (var pj = 1; pj < path.length; pj++)
      ctx.lineTo(toX(path[pj].x), toY(path[pj].y));
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    var lx = margin.left + pw - 180, ly = margin.top + 8;
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(lx, ly, 10, 10);
    ctx.fillStyle = '#1e293b'; ctx.textAlign = 'left';
    ctx.fillText('Start  (' + path[0].x.toFixed(1) + ', ' + path[0].y.toFixed(1) + ')', lx + 14, ly + 9);
    ly += 16;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(lx + 1, ly + 5); ctx.lineTo(lx + 9, ly + 5); ctx.stroke();
    ctx.fillText('Path (' + (path.length - 1) + ' steps)', lx + 14, ly + 9);
    ly += 16;
    var last = path[path.length - 1];
    ctx.fillStyle = '#22c55e'; ctx.fillRect(lx, ly, 10, 10);
    ctx.fillText('End    (' + last.x.toFixed(3) + ', ' + last.y.toFixed(3) + ')', lx + 14, ly + 9);
    ly += 16;
    ctx.fillText('f(x,y) = ' + last.f.toFixed(4), lx + 14, ly + 9);
    ly += 16;
    ctx.fillText('η = ' + lr, lx + 14, ly + 9);
  }

  return { init: init };
})();
