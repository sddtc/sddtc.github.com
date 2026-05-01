# Blog CSS Redesign — Design Spec

**Date**: 2026-05-01
**Scope**: Redesign the visual layout and color system of `sddtc.github.com` (Eleventy v3 personal blog). Light-mode only. Apply the colorhunt palette `#468432 / #9AD872 / #FFEF91 / #FFA02E`.

## Goals

1. Center content with proper container width — eliminate the full-viewport stretch that hurts long-form reading.
2. Replace the existing sage/cream theme with the new lemon-yellow + forest-green palette (lemon as page background, deep green as text).
3. Reposition the article-page TOC so it floats on the right of the centered article instead of squeezing the prose.
4. Drop dark-mode support entirely — the new palette is designed for light only.
5. Keep all current Eleventy plugins, JS behaviors (click effect, GA), and the markdown-it/prism config untouched.

## Non-Goals

- No web-font import; system fonts only.
- No syntax-highlight theme change (keep `prism-tomorrow.css`).
- No JS changes, no `eleventy.config.js` changes, no data-layer changes.
- No content reorganization (post structure, frontmatter conventions unchanged).
- No new pages, no nav restructuring.

## Layout

### Container Structure

```
body (full-width, background = #FFEF91 lemon)
└─ <header>
   └─ .page-wrap (max-width 720px, centered)
└─ <main>
   └─ .page-wrap
      └─ .post-layout  (post detail only — grid: minmax(0,720px) 220px)
         ├─ .post-content (article body, in .surface-card)
         └─ .post-toc    (sticky right, hidden < 1100px)
      └─ .surface-card  (list pages — wraps .postlist)
└─ <footer>
   └─ .page-wrap
```

### Responsive breakpoints

| Width | Behavior |
|---|---|
| `> 1100px` | TOC visible on post pages, 720px article + 220px TOC, gap 2rem, grid centered |
| `768px – 1100px` | Single column, 720px max-width, TOC hidden |
| `< 768px` | `.page-wrap` padding shrinks to `0 1rem`; `.surface-card` padding shrinks to `1.25rem` |

### TOC positioning detail

`.post-layout` uses `display: grid; grid-template-columns: minmax(0, 720px) 220px; gap: 2rem; justify-content: center`. This ensures the article column never exceeds 720px even when the TOC is present, and the two columns are centered together as a unit. `.post-toc` is `position: sticky; top: 1.5rem; max-height: calc(100vh - 3rem); overflow-y: auto`.

At `<= 1100px` a media query collapses `.post-layout` to `display: block` and sets `.post-toc { display: none }`.

## Color Tokens

Defined in `css/customized-theme.css` `:root`. The dark-mode block in `css/index.css` is **deleted**.

```css
:root {
  /* Palette */
  --c-green-deep: #468432;
  --c-green-soft: #9AD872;
  --c-yellow:     #FFEF91;
  --c-orange:     #FFA02E;

  /* Derived */
  --c-text:       #1F3A1A;
  --c-text-soft:  #4A5E3F;
  --c-surface:    #FFFDF5;
  --c-border:     rgba(154, 216, 114, 0.45);

  /* Role mapping (overrides index.css defaults) */
  --background-color:        var(--c-yellow);
  --text-color:              var(--c-text);
  --text-color-link:         var(--c-orange);
  --text-color-link-active:  var(--c-green-deep);
  --text-color-link-visited: var(--c-orange);

  --color-gray-20: var(--c-border);
  --color-gray-50: var(--c-text-soft);
  --color-gray-90: var(--c-text);
}
```

### Color application rules

- **Body background**: `--c-yellow` full-width.
- **Reading surfaces** (`.surface-card`, `pre`, `blockquote`, `.post-toc`, inline `code` outline): `--c-surface` (off-white) — provides eye-rest within the yellow.
- **Headings (h1–h3)**: `--c-green-deep`, weight 700.
- **Links**: default orange with 1px solid orange underline (compensates for low contrast over yellow); hover/active turns deep-green; visited stays orange.
- **Inline `code`**: background `#FFE45F` (slightly deeper yellow), 1px `--c-green-soft` border, text `--c-green-deep`.
- **Blockquote**: surface background, 4px `--c-orange` left border, soft-text body color.
- **Tag pill (`.post-tag`)**: `--c-green-soft` background, `--c-text` text, rounded pill, no italic; hover → `--c-yellow`.
- **Active nav item (`aria-current="page"`)**: `--c-green-deep` background, white text, rounded pill — replaces the underline.
- **Dividers** (header bottom, footer top, prev/next top): `1px solid --c-border` (replaces existing dashed gray).

### Contrast self-check

- `--c-text` (`#1F3A1A`) on `--c-yellow` (`#FFEF91`): ratio ≈ 12.5 — AAA.
- `--c-orange` (`#FFA02E`) on `--c-yellow`: ratio ≈ 2.6 — fails AA on color alone. **Mitigation**: links carry a permanent 1px underline so identification does not depend on color contrast.
- `--c-green-deep` (`#468432`) on `--c-yellow`: ratio ≈ 4.0 — AA Large pass; used only for headings (large) and active-nav pill (white text on green, ratio ≈ 5.4 — AA pass).

## Typography

System font stack stays: `-apple-system, system-ui, sans-serif`. No web font.

| Element | Size | Line height | Weight |
|---|---|---|---|
| `body` | 1rem (16px) | 1.7 | 400 |
| `.page-post` (article body) | 1.0625rem (17px) | 1.75 | 400 |
| `h1` | 2rem | 1.3 | 700 |
| `h2` | 1.5rem | 1.35 | 700 |
| `h3` | 1.25rem | 1.4 | 700 |
| `.home-link` | 1.25rem | 1 | 700 |
| `.nav` | 0.9375rem | 1 | 500 |
| `.postlist-link` | 1.125rem | 1.4 | 600 |
| `.postlist-date`, `.post-metadata` | 0.875rem | 1 | 400 |
| `code` (inline) | 0.9em | inherit | 400 |

The `.page-post { font-size: 18px }` hardcoded rule is replaced with `1.0625rem`.

## Component Specs

### Header
- Site title (`.home-link`) deep-green, weight 700, left-aligned, no underline.
- `.nav` horizontal, right-aligned, gap 1em.
- `.nav a[aria-current="page"]`: deep-green pill (`background: var(--c-green-deep); color: #fff; padding: .25em .75em; border-radius: 999px`); the previous `text-decoration: underline` is removed.
- Header bottom divider: `1px solid var(--c-border)` (replacing dashed gray).

### Postlist (home / category / tag pages)
- Wrapped in `<div class="surface-card">`.
- Counter numbering retained; override `.postlist-date, .postlist-item:before { color: var(--color-gray-90) }` from `index.css` so `.postlist-item:before` becomes `color: var(--c-orange); font-weight: 700`. `.postlist-date` keeps `--c-text-soft`.
- `.postlist-link` weight 600, color = `--c-text`; hover → `--c-orange` with underline.
- Each `.postlist-item`: `padding-bottom: 1em; margin-bottom: 1.25em; border-bottom: 1px dashed var(--c-border)`; last child has no border.

### Tag pill (`.post-tag`)
```css
display: inline-block;
padding: .15em .6em;
background: var(--c-green-soft);
color: var(--c-text);
border-radius: 999px;
font-style: normal;          /* removes existing italic */
font-size: .8125em;
text-decoration: none;
```
Hover: `background: var(--c-yellow)`.

### Inline code
```css
padding: .1em .4em;
background: #FFE45F;
border: 1px solid var(--c-green-soft);
border-radius: 4px;
color: var(--c-green-deep);
font-size: .9em;
font-style: normal;
```

### Pre (code block container)
Prism's syntax colors stay (token coloring unchanged). Container additions:
```css
border-radius: 8px;
box-shadow: 0 2px 0 var(--c-green-soft);
margin: 1.25em 0;
```

### Blockquote
```css
background: var(--c-surface);
border-left: 4px solid var(--c-orange);
padding: .9em 1.1em;
border-radius: 0 6px 6px 0;
color: var(--c-text-soft);
```
Replaces both `blockquote` and `.page-post blockquote` rules; hardcoded `#333`/`#F2EFE7` removed.

### Surface card
```css
.surface-card {
  background: var(--c-surface);
  border-radius: 8px;
  padding: 2rem 2.25rem;
}
@media (max-width: 768px) {
  .surface-card { padding: 1.25rem; border-radius: 6px; }
}
```

### Article body wrapper
The existing `.page-post` div inside `.post-content` gets the additional `surface-card` class (template change: `class="page-post"` → `class="page-post surface-card"`) so the article reads on the calm off-white surface. No new wrapper element introduced.

### TOC (`.post-toc`)
```css
.post-toc {
  position: sticky;
  top: 1.5rem;
  width: 220px;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding: 1rem;
  background: var(--c-surface);
  border-radius: 8px;
  border: 1px solid var(--c-border);
  font-size: .875rem;
}
.post-toc a { color: var(--c-green-deep); }
.post-toc a:hover { color: var(--c-orange); }
@media (max-width: 1100px) {
  .post-toc { display: none; }
}
```
The previous `flex: 0 0 20em; padding-right: 2em` rule is removed (TOC is no longer a flex column squeezing the article).

### Prev/Next links (`.links-nextprev`)
- Top divider: `1px solid var(--c-border)`.
- Each item: `padding: .75em 1em; border-radius: 6px; transition: background .15s`.
- Hover: `background: var(--c-surface)`.

### Footer
Single line, centered, color `--c-text-soft`. No background change (inherits yellow body).

## File Changes

### `_includes/layouts/base.njk`
Wrap each of `<header>`, `<main>`, `<footer>`'s inner content in a `<div class="page-wrap">…</div>`. The semantic tags themselves stay full-width so the yellow background extends edge-to-edge; only their content is centered.

### `_includes/layouts/post.njk`
- Rename `.post-main` → `.post-layout`.
- Swap order: `.post-content` first, `.post-toc` second (so TOC sits to the right in source order; grid columns enforce position regardless).
- Wrap article body in `.surface-card` (or apply card styling to `.page-post`).

### `_includes/layouts/home.njk`
- Drop `align-self: center` rules for `.page-title`, `.postlist-container`, `.page-footer` — centering now comes from `.page-wrap` upstream.
- The `.home-container` div remains as a transparent flow container.

### `_includes/postslist.njk`
- Wrap the rendered `.postlist` in `<div class="surface-card">…</div>` directly inside this partial. Card scope is owned here so all callers (home, blog, tag, category pages) inherit consistent treatment.

### `css/index.css`
- **Delete** the entire `@media (prefers-color-scheme: dark) { ... }` block (lines 23–36).
- Replace remaining hardcoded colors with variables: `th { color: #333 }` → `var(--c-text)`; any leftover `#ddd`-style values → `var(--c-border)`.
- Otherwise structure preserved.

### `css/customized-theme.css`
**Complete rewrite** per §Color Tokens, §Typography, §Component Specs. This file becomes the canonical source for the new theme.

### Files NOT changed
- `eleventy.config.js`
- `_config/filters.js`
- `_data/*`
- `js/*` (click effect, GA)
- `css/prism-diff.css`
- `node_modules/prismjs/themes/prism-tomorrow.css` (still loaded in post.njk; syntax token colors unchanged)
- All content under `content/`

## Verification

- `npm start` → check at three viewport widths: `<768`, `768–1100`, `>1100`.
- Pages to spot-check: `/` (home), one post detail page (long, with TOC), `/about/`, `/tags/`, `/categories/`, one tag listing page, one category listing page.
- Verify in OS dark-mode: page should remain in the new light theme (no fallback to old dark colors).
- Verify all link states (default / hover / visited) on yellow background.
- Verify code block, inline code, blockquote, tag pill rendering on a real post.

## Out of Scope (potential follow-ups, not part of this spec)

- Web font for Chinese typography (e.g., 思源黑体).
- Header logo or favicon redesign.
- Search functionality.
- Comments system.
- RSS feed styling.
- Post excerpt / cover image support.
