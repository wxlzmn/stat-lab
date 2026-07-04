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
