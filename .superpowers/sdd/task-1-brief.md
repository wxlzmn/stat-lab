### Task 1: Typography Upgrade — Base Font Size & Heading Scale

**Files:**
- Modify: `shared/css/base.css:8-57`

**Interfaces:**
- Consumes: Current `:root` and `html` selectors in base.css
- Produces: Updated font-size baseline (16px), new heading scales (h1: 3.5rem, h2: 2.5rem, h3: 1.5rem)

**Step 1: Update base font-size and headings in base.css**

In `shared/css/base.css`, change:

Line 9: `font-size: 14px;` → `font-size: 16px;`

Lines 54-57 (heading sizes):
```css
h1 { font-size: 3.5rem; margin-bottom: 0.5rem; }
h2 { font-size: 2.5rem; margin-bottom: 0.4rem; }
h3 { font-size: 1.5rem; margin-bottom: 0.3rem; }
```

Also update `--navbar-height` in `variables-warm.css` line 46 from `56px` to `56px` (keep same, no change needed).

Update body line-height in base.css line 20: `line-height: 1.7;` → `line-height: 1.75;`

**Step 2: Verify in browser**

Open `index.html` in browser. Confirm:
- Body text is noticeably larger
- All headings scale up proportionally
- No layout breakage in existing pages (they inherit the base font-size)
- Navbar text is still readable

**Step 3: Commit**

```bash
git add shared/css/base.css
git commit -m "style: upgrade base font-size to 16px and enlarge headings"
```

---

