# Task 2 Report: Canvas Particle Network

**Status:** Completed
**Commit:** `bc26dc2`
**Files changed:** 2 files, +215/-8 lines

## What was done

1. Created `shared/js/particle-network.js` -- a standalone `ParticleNetwork` module with:
   - `init(canvas, width, height)` -- creates particles, sets up mouse listeners, starts animation loop
   - `animate()` -- renders particles, draws connections within 120px (desktop) / 100px (mobile), handles mouse repulsion within 150px radius
   - `destroy()` -- cancels animation frame
   - Desktop: 100 particles, mobile: 40 particles
   - Blue-ish particles using `rgba(147, 197, 253, ...)`

2. Updated `index.html`:
   - Replaced `.home-hero` div with `.hero-section` containing a `<canvas id="particle-canvas">` element
   - Added CSS for hero section (dark gradient background, shimmer title, fade-in subtitle, expanding divider)
   - Added script tag for `particle-network.js` before `storage.js` and `router.js`
   - Initialized particle network in the IIFE before card rendering

## Verification

- Files match the brief exactly (code copied verbatim from task-2-brief.md)
- Script load order: particle-network.js -> storage.js -> router.js (as specified)
- Hero section uses `var(--font-display)` from variables-warm.css for title font
- All existing subject card rendering code preserved unchanged

## Concerns

- The `parent.offsetWidth` / `parent.offsetHeight` may return 0 if the hero section has `min-height: 420px` but no explicit fixed height at init time. The resize listener will correct this, but the initial canvas dimensions might be 0 on fast-loading pages.
- No touch-move handler for mobile mouse repulsion (only desktop mousemove). Touch devices get fewer particles but no interactivity beyond that.
