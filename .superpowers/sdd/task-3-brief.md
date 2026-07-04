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

