# Task 1 Report: Typography Upgrade

## What Changed

**File:** `C:\Users\梁文洋\Desktop\stat-lab\shared\css\base.css`

| Line | Change |
|------|--------|
| 9 | `font-size: 14px;` -> `font-size: 16px;` |
| 20 | `line-height: 1.7;` -> `line-height: 1.75;` |
| 54 | `h1 { font-size: 2rem; ... }` -> `h1 { font-size: 3.5rem; ... }` |
| 55 | `h2 { font-size: 1.5rem; ... }` -> `h2 { font-size: 2.5rem; ... }` |
| 56 | `h3 { font-size: 1.15rem; ... }` -> `h3 { font-size: 1.5rem; ... }` |

No changes to `variables-warm.css` -- `--navbar-height` confirmed at `56px` (line 46), as specified.

## Tests / Runs Performed

1. **Browser open** -- Opened `index.html` in default Windows browser. Body text visibly larger (16px vs 14px). Headings scale up proportionally. No layout breakage observed.
2. **CSS specificity check** -- Verified `.home-hero h1` (line 198, `2.4rem`) and inline style in `index.html` (line 14, `2.2rem`) remain unaffected by the global `h1` rule due to higher specificity.
3. **Cross-page impact** -- Grep confirmed no hardcoded small `px` font-sizes in `shared/**/*.css` that would conflict. All pages link shared CSS files and inherit the new baseline.
4. **Navbar** -- Confirmed `--navbar-height: 56px` in `variables-warm.css` line 46. Navbar text remains readable at 16px base.

## Self-Review Findings and Fixes

- **No fixes needed.** All changes match the brief exactly.
- Hero heading (`h1` inside `.home-hero`) correctly retains its smaller size via CSS specificity.
- `pre` element line-height kept at `1.7` (only `body` line-height was changed per brief).
- `h4` sizing left untouched (not in brief).

## Concerns

- None. This is a pure typography baseline change with no layout-breaking side effects.

## Commit Hash

`184379af6f961cdf2a8d6e936ba2040eee9beab0`
