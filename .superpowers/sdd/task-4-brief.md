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

