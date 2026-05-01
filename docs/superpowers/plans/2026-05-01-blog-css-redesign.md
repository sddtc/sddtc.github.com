# Blog CSS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current sage/cream theme with a lemon-yellow + forest-green palette (`#468432 / #9AD872 / #FFEF91 / #FFA02E`), centralize content in a 720px column, float the article TOC sticky to the right, and drop dark-mode support.

**Architecture:** Single light-mode theme. Template wraps content in a `.page-wrap` (720px max-width centered) inside the full-width yellow body. Article pages use a CSS grid with article column (≤720px) + 220px sticky TOC, collapsing to single column below 1100px. CSS variables in `customized-theme.css` are the single source of truth for color and surface tokens.

**Tech Stack:** Eleventy v3 (Nunjucks templates), plain CSS (no preprocessor), system fonts only. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-01-blog-css-redesign-design.md`

**Verification model:** This is a visual/CSS change with no unit tests. Each task ends with `npm start` visual checks at one or more viewport widths and a commit. Run `npm run build` before the final commit to confirm production build succeeds.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `css/customized-theme.css` | Rewrite | Color tokens, typography, all component styles |
| `css/index.css` | Edit | Remove `prefers-color-scheme: dark` block; replace hardcoded colors with vars |
| `_includes/layouts/base.njk` | Edit | Wrap header/main/footer inner content in `.page-wrap` |
| `_includes/layouts/post.njk` | Edit | Rename `.post-main`→`.post-layout`; reorder; add `surface-card` to `.page-post` |
| `_includes/layouts/home.njk` | Edit | Drop now-unneeded `align-self: center` rules (handled in CSS task) |
| `_includes/postslist.njk` | Edit | Wrap `.postlist` in `.surface-card` |

No JS, config, data, or content changes.

---

## Task 1: Reset color tokens and drop dark mode

**Files:**
- Modify: `css/index.css` (delete lines ~23–36, replace hardcoded colors)
- Rewrite: `css/customized-theme.css` (root variables only at this stage)

- [ ] **Step 1: Delete the dark-mode media query in `css/index.css`**

Remove the entire block at lines 23–36:

```css
@media (prefers-color-scheme: dark) {
	:root {
		--color-gray-20: #e0e0e0;
		--color-gray-50: #C0C0C0;
		--color-gray-90: #dad8d8;

		/* --text-color is assigned to --color-gray-_ above */
		--text-color-link: #1493fb;
		--text-color-link-active: #6969f7;
		--text-color-link-visited: #a6a6f8;

		--background-color: #15202b;
	}
}
```

After deletion, the line `/* Global stylesheet */` should follow directly after the closing brace of the first `:root` block.

- [ ] **Step 2: Replace hardcoded `#333` and `#ddd` in `css/index.css`**

In the `th, td` rule, change `border-bottom: 1px solid #ddd;` to `border-bottom: 1px solid var(--color-gray-20);`.

In the `th` rule, change `color: #333;` to `color: var(--color-gray-90);`.

- [ ] **Step 3: Replace `css/customized-theme.css` `:root` with new tokens**

Open `css/customized-theme.css` and replace the existing `:root { ... }` block (lines 1–14) with:

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

	--syntax-tab-size: 2;
}

a {
	text-decoration: none;
}
```

Leave the rest of `customized-theme.css` (everything below `a { text-decoration: none; }`) **untouched for now** — later tasks rewrite each section. This task only swaps the variable layer.

- [ ] **Step 4: Visual sanity check**

Run: `npm start`
Open: `http://localhost:8080/`
Expected: page background is now lemon yellow, body text is dark green. Existing components (postlist, footer) will look broken/inconsistent — this is expected. We just confirm the variables took effect.

- [ ] **Step 5: Commit**

```bash
git add css/index.css css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: introduce new color tokens and drop dark mode

Establishes the palette layer for the redesign. Subsequent commits
restyle individual components against these tokens.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add `.page-wrap` container and global type styles

**Files:**
- Modify: `_includes/layouts/base.njk`
- Modify: `css/customized-theme.css` (append global rules)

- [ ] **Step 1: Wrap header/main/footer content in `.page-wrap`**

In `_includes/layouts/base.njk`, replace the `<header>` block (lines 27–39) with:

```html
<header>
	<div class="page-wrap header-inner">
		<a href="/" class="home-link">{{ metadata.title }}</a>

		{#- Read more about `eleventy-navigation` at https://www.11ty.dev/docs/plugins/navigation/ #}
		<nav>
			<h2 class="visually-hidden">Top level navigation menu</h2>
			<ul class="nav">
			{%- for entry in collections.all | eleventyNavigation %}
				<li class="nav-item"><a href="{{ entry.url }}"{% if entry.url == page.url %} aria-current="page"{% endif %}>{{ entry.title }}</a></li>
			{%- endfor %}
			</ul>
		</nav>
	</div>
</header>
```

Replace the `<main>` block (lines 41–45) with:

```html
<main id="main">
	<div class="page-wrap">
		<heading-anchors>
			{{ content | safe }}
		</heading-anchors>
	</div>
</main>
```

Replace the `<footer>` block (lines 47–49) with:

```html
<footer>
	<div class="page-wrap">
		<p>Copyright © <span id="copyright-year"></span></p>
	</div>
</footer>
```

- [ ] **Step 2: Append global type rules to `css/customized-theme.css`**

Append the following at the end of `css/customized-theme.css`:

```css
/* —— Global layout & typography —— */
.page-wrap {
	max-width: 720px;
	margin: 0 auto;
	padding: 0 1.25rem;
}

body {
	line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
	color: var(--c-green-deep);
	font-weight: 700;
	line-height: 1.35;
}

h1 { font-size: 2rem; line-height: 1.3; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; line-height: 1.4; }

a[href]:hover,
a[href]:active {
	text-decoration: underline;
}

@media (max-width: 768px) {
	.page-wrap {
		padding: 0 1rem;
	}
}
```

- [ ] **Step 3: Visual check**

Run: `npm start`
Open: `http://localhost:8080/`
Expected: header, main, footer content is now constrained to 720px and centered. Yellow background extends edge-to-edge. Headings (`h2` "最新的 N 篇文章") are now deep green and bold.

- [ ] **Step 4: Commit**

```bash
git add _includes/layouts/base.njk css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: center content in 720px page-wrap

Adds the .page-wrap container around header/main/footer content so the
yellow body background extends full-width while content reads in a
centered column.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Style header, nav, and active-page pill

**Files:**
- Modify: `css/customized-theme.css` (append)

- [ ] **Step 1: Append header/nav rules**

Append to `css/customized-theme.css`:

```css
/* —— Header & nav —— */
header {
	border-bottom: 1px solid var(--c-border);
}

.header-inner {
	display: flex;
	gap: 1em;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding-top: 1em;
	padding-bottom: 1em;
}

header > .header-inner {
	/* page-wrap already provides horizontal padding */
}

.home-link {
	color: var(--c-green-deep);
	font-size: 1.25rem;
	font-weight: 700;
	text-decoration: none;
}

.nav {
	font-size: 0.9375rem;
	font-weight: 500;
}

.nav-item a {
	color: var(--c-text);
	text-decoration: none;
	padding: 0.25em 0.5em;
	border-radius: 999px;
	transition: background 0.15s, color 0.15s;
}

.nav-item a:hover {
	color: var(--c-orange);
	text-decoration: none;
}

.nav a[href][aria-current="page"] {
	background: var(--c-green-deep);
	color: #fff;
	padding: 0.25em 0.75em;
	text-decoration: none;
}
```

Note: `index.css` lines 217–224 already set `header { display: flex; padding: 1em; ... }`. The new rules deliberately move flex behavior onto `.header-inner` (the inner `.page-wrap`). This means the outer `<header>` keeps `display: flex` from index.css but it now contains a single child (`.header-inner`), so flex layout is harmless. To remove redundancy, also override:

```css
header {
	display: block;
	padding: 0;
}
```

Add this rule **before** the `header-inner` rule above (so the inner div fully owns the flex layout). Final block order in this step: `header { display: block; padding: 0; border-bottom: ... }` → `.header-inner { display: flex; ... }` → rest.

- [ ] **Step 2: Visual check**

Run: `npm start`
Open: `http://localhost:8080/` and `http://localhost:8080/about/`
Expected:
- Header has a thin green-soft bottom border (no longer dashed gray).
- Site title "大蜕" is deep green, bold, ~20px.
- Nav items: hover turns orange. The current page nav item ("主页" on `/`) is a deep-green pill with white text.
- Header content stays centered in 720px column.

- [ ] **Step 3: Commit**

```bash
git add css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: restyle header and nav with active-page pill

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Surface card and postlist

**Files:**
- Modify: `_includes/postslist.njk`
- Modify: `_includes/layouts/home.njk`
- Modify: `css/customized-theme.css` (append)

- [ ] **Step 1: Wrap postlist in `.surface-card`**

Replace the entire contents of `_includes/postslist.njk` with:

```html
<div class="postlist-container surface-card">
	<ol reversed class="postlist" style="--postlist-index: {{ (postslistCounter or postslist.length) + 1 }}">
	{%- for post in postslist | reverse %}
		<li class="postlist-item{% if post.url == url %} postlist-item-active{% endif %}">
			<a href="{{ post.url }}" class="postlist-link">{% if post.data.title %}{{ post.data.title }}{% else %}<code>{{ post.url }}</code>{% endif %}</a>
			<time class="postlist-date" datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate("LLLL yyyy") }}</time>
		</li>
	{%- endfor %}
	</ol>
</div>
```

(Single-class addition: `class="postlist-container"` → `class="postlist-container surface-card"`.)

- [ ] **Step 2: Simplify `home.njk`**

Replace `_includes/layouts/home.njk` with:

```html
---
layout: layouts/base.njk
---

<div class="home-container">
    {{ content | safe }}
</div>
```

(No change to HTML structure — the existing file is already this. Confirm by reading the file.)

- [ ] **Step 3: Append surface-card and postlist styles**

Append to `css/customized-theme.css`:

```css
/* —— Surface card —— */
.surface-card {
	background: var(--c-surface);
	border-radius: 8px;
	padding: 2rem 2.25rem;
}

@media (max-width: 768px) {
	.surface-card {
		padding: 1.25rem;
		border-radius: 6px;
	}
}

/* —— Page title (home, listing pages) —— */
.page-title {
	margin: 1.5rem 0 1rem;
}

.page-title h2 {
	margin: 0;
}

/* —— Postlist —— */
.postlist {
	margin: 0;
}

.postlist-item {
	padding-bottom: 1em;
	margin-bottom: 1.25em;
	border-bottom: 1px dashed var(--c-border);
}

.postlist-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
	padding-bottom: 0;
}

.postlist-item:before {
	color: var(--c-orange);
	font-weight: 700;
	font-size: 0.8125em;
}

.postlist-date {
	color: var(--c-text-soft);
	font-size: 0.875rem;
}

.postlist-link {
	color: var(--c-text);
	font-size: 1.125rem;
	font-weight: 600;
	text-decoration: none;
}

.postlist-link:hover {
	color: var(--c-orange);
	text-decoration: underline;
}

.page-footer {
	margin-top: 1.5rem;
	text-align: center;
	color: var(--c-text-soft);
	font-size: 0.9375rem;
}
```

Note: the previous `.home-container { display: flex; flex-direction: column }` rule and three `align-self: center` rules in the existing `customized-theme.css` (lines 113–128) become redundant once the surface card and `.page-wrap` handle layout. They will be removed in Task 9 (cleanup pass) — leaving them now does no visual harm.

- [ ] **Step 4: Visual check**

Run: `npm start`
Open: `http://localhost:8080/`
Expected:
- The post list now sits in an off-white rounded card on the yellow background.
- Counter numbers (01, 02, …) are orange and bold.
- Post titles are deep green, hover turns orange with underline.
- Each item has a soft green-dashed bottom border (last item: no border).
- "更多文章可以从 这里 找到" footer text is muted green, centered.

- [ ] **Step 5: Commit**

```bash
git add _includes/postslist.njk css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: introduce surface-card and restyle postlist

Wraps the post list in an off-white card so the yellow body background
becomes a frame. Restyles list items, dates, and counter numbering with
new tokens.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Article layout — grid, sticky TOC, surface card

**Files:**
- Modify: `_includes/layouts/post.njk`
- Modify: `css/customized-theme.css` (append, replace existing post rules)

- [ ] **Step 1: Update `post.njk`**

Replace `_includes/layouts/post.njk` with:

```html
---
layout: layouts/base.njk
---
<div class="post-layout">
	<article class="post-content">
		{# Only include the syntax highlighter CSS on blog posts, included with the CSS per-page bundle #}
		<style>{% include "node_modules/prismjs/themes/prism-tomorrow.css" %}</style>
		<h1>{{ title }}</h1>

		<ul class="post-metadata">
			<li><time datetime="{{ page.date | htmlDateString }}">{{ page.date | readableDate }}</time></li>
			标签:
			{%- for tag in tags | filterTagList %}
			{%- set tagUrl %}/tags/{{ tag }}/{% endset %}
			<li><a href="{{ tagUrl }}" class="post-tag">{{ tag }}</a>{%- if not loop.last %}, {% endif %}</li>
			{%- endfor %}
		</ul>

		<div class="page-post surface-card">
			{{ content | safe }}
		</div>

		{%- if collections.posts %}
		{%- set previousPost = collections.posts | getPreviousCollectionItem %}
		{%- set nextPost = collections.posts | getNextCollectionItem %}
		{%- if nextPost or previousPost %}
		<ul class="links-nextprev">
			{%- if previousPost %}<li class="links-nextprev-prev">← Previous<br> <a href="{{ previousPost.url }}">{{ previousPost.data.title }}</a></li>{% endif %}
			{%- if nextPost %}<li class="links-nextprev-next">Next →<br><a href="{{ nextPost.url }}">{{ nextPost.data.title }}</a></li>{% endif %}
		</ul>
		{%- endif %}
		{%- endif %}
	</article>
	<aside class="post-toc">
		{{ content | toc(ul=true, wrapper='div', wrapperClass='content-tableau') | safe }}
	</aside>
</div>
```

Key changes from current file:
- `.post-main` → `.post-layout`
- Order: content first, TOC second (grid handles visual placement)
- Added `surface-card` class to `.page-post` div
- `<div class="post-content">` → `<article class="post-content">`
- TOC container is now `<aside class="post-toc">`

- [ ] **Step 2: Replace `.post-main` rules in `customized-theme.css`**

Find these rules in `css/customized-theme.css`:

```css
.post-main {
	display: flex;
	flex-direction: row;
	overflow: hidden;
	height: 100%;
}

.post-toc {
	flex: 0 0 20em;
	padding-right: 2em;
	flex-shrink: 0;
}

.post-content {
	flex: 1;
}

@media screen and (max-width: 768px) {
	.post-toc {
		display: none !important;
		/* 强制隐藏 */
	}
}
```

Replace them with:

```css
/* —— Post layout —— */
.post-layout {
	display: grid;
	grid-template-columns: minmax(0, 720px) 220px;
	gap: 2rem;
	justify-content: center;
	align-items: start;
}

.post-content {
	min-width: 0;
}

.post-content h1 {
	margin-top: 0.5rem;
}

.post-metadata {
	color: var(--c-text-soft);
	font-size: 0.875rem;
}

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
	font-size: 0.875rem;
}

.post-toc a {
	color: var(--c-green-deep);
	text-decoration: none;
}

.post-toc a:hover {
	color: var(--c-orange);
	text-decoration: underline;
}

.post-toc ul {
	padding-left: 1.1em;
	margin: 0.25em 0;
}

@media (max-width: 1100px) {
	.post-layout {
		grid-template-columns: minmax(0, 720px);
	}
	.post-toc {
		display: none;
	}
}
```

Because the article column lives inside `main > .page-wrap` (which is already 720px max), the grid `minmax(0, 720px) 220px` overflows the wrap on wide screens — and it should: at `>1100px` the TOC appears to the right, outside the 720px wrap. To allow the grid to overflow the wrap horizontally on wide screens only, also append:

```css
@media (min-width: 1101px) {
	main > .page-wrap {
		max-width: none;
		padding-left: 0;
		padding-right: 0;
	}
	.post-layout {
		max-width: 980px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}
}
```

(Above 1100px, the main wrap unwraps so `.post-layout` controls its own centering and width: 720 + 220 + 32px gap + 8px slack ≈ 980px.)

- [ ] **Step 3: Visual check (wide viewport)**

Run: `npm start` (if not already running)
Open a post detail page, e.g. `http://localhost:8080/blog/<some-post-slug>/` (pick any from `content/blog/`)
Expected at viewport > 1100px:
- Article body sits in an off-white card centered in the page.
- TOC floats as a small off-white card to the right of the article.
- Scrolling the page: the TOC stays sticky near the top until scrolled past the article.

Resize viewport to 900px wide:
Expected:
- TOC disappears.
- Article remains centered in 720px column.

Resize to 600px (mobile):
Expected:
- Article card padding shrinks; TOC still hidden.

- [ ] **Step 4: Commit**

```bash
git add _includes/layouts/post.njk css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: rebuild post layout with grid and sticky TOC

Replaces the flex .post-main with a grid that places the TOC as a
sticky 220px column to the right of the 720px article on wide
viewports, collapsing to single column below 1100px. Article body now
sits inside a surface card.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Article body typography and inline elements

**Files:**
- Modify: `css/customized-theme.css` (replace existing `.page-post` rules and add new ones)

- [ ] **Step 1: Locate and replace existing `.page-post` rules**

Find these rules in `css/customized-theme.css`:

```css
/* 文章内部样式 */
.page-post {
	margin: 10px 0;
}

.page-post {
	font-size: 18px;
}

.page-post a {
	text-decoration: none;
	color: #8AA624;
	border-bottom: 1px solid #8AA624
}

/* 引用 */
.page-post blockquote {
	border-left: 3px solid #333333;
	background-color: #F2EFE7;
	padding: 9px 9px 9px 15px;
}

/* 单行代码 */
.page-post code {
	font-size: 13px;
	background-color: #F2EFE7;
	word-break: break-all;
	padding: 3px 5px;
	margin: 0 4px;
	border-radius: 5px;
	color: #333333;
	transition: all 500ms ease;
	font-style: normal;
}
```

Also find this earlier block:

```css
/* 其他页面样式, 例如: 关于我 */
blockquote {
	border-left: 3px solid #333333;
	background-color: #F2EFE7;
	padding: 9px 9px 9px 15px;
}
```

Replace **all five blocks** (the top-level `blockquote`, and all `.page-post*` rules) with:

```css
/* —— Article body —— */
.page-post {
	font-size: 1.0625rem;
	line-height: 1.75;
	margin: 1rem 0;
}

.page-post p {
	margin: 0 0 1em;
}

.page-post a {
	color: var(--c-orange);
	text-decoration: none;
	border-bottom: 1px solid var(--c-orange);
}

.page-post a:hover {
	color: var(--c-green-deep);
	border-bottom-color: var(--c-green-deep);
}

/* Inline code */
.page-post code,
code {
	font-size: 0.9em;
	background: #FFE45F;
	border: 1px solid var(--c-green-soft);
	color: var(--c-green-deep);
	padding: 0.1em 0.4em;
	margin: 0 2px;
	border-radius: 4px;
	font-style: normal;
	word-break: break-all;
}

/* Pre block (Prism token colors stay; container restyled) */
.page-post pre[class*="language-"],
pre[class*="language-"] {
	border-radius: 8px;
	box-shadow: 0 2px 0 var(--c-green-soft);
	margin: 1.25em 0;
}

/* Code inside pre: reset inline-code styling */
pre[class*="language-"] code {
	background: transparent;
	border: none;
	color: inherit;
	padding: 0;
	margin: 0;
	border-radius: 0;
}

/* Blockquote */
blockquote,
.page-post blockquote {
	background: var(--c-surface);
	border-left: 4px solid var(--c-orange);
	padding: 0.9em 1.1em;
	border-radius: 0 6px 6px 0;
	color: var(--c-text-soft);
	margin: 1em 0;
}

.page-post blockquote p:last-child {
	margin-bottom: 0;
}
```

- [ ] **Step 2: Visual check on a post**

Run: `npm start`
Open a post that contains inline code, a code block, and a blockquote (try `http://localhost:8080/blog/` and pick one with mixed content).
Expected:
- Body font ~17px, line-height generous.
- Article links: orange with thin orange underline; hover turns deep-green.
- Inline `code` snippets: small slightly-deeper-yellow pill with green-soft border, deep-green text.
- Code blocks: dark Prism background unchanged inside, but container has rounded corners and a 2px green-soft "underline" shadow below.
- Blockquotes: off-white panel with 4px orange left bar.

- [ ] **Step 3: Commit**

```bash
git add css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: restyle article body, inline code, code blocks, blockquotes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Tag pills, prev/next links, page metadata

**Files:**
- Modify: `css/customized-theme.css` (replace `.post-tag`, append prev/next rules)

- [ ] **Step 1: Replace `.post-tag` rule**

Find in `css/customized-theme.css`:

```css
/* Tags */
.post-tag {
	font-style: italic;
}
```

Replace with:

```css
/* —— Tag pills —— */
.post-tag {
	display: inline-block;
	padding: 0.15em 0.6em;
	background: var(--c-green-soft);
	color: var(--c-text);
	border-radius: 999px;
	font-style: normal;
	font-size: 0.8125em;
	text-decoration: none;
	border: none;
}

.post-tag:hover {
	background: var(--c-yellow);
	color: var(--c-text);
	text-decoration: none;
}
```

- [ ] **Step 2: Append prev/next link styles**

Append to `css/customized-theme.css`:

```css
/* —— Prev / next links —— */
.links-nextprev {
	border-top: 1px solid var(--c-border);
	margin-top: 2rem;
	padding-top: 1rem;
}

.links-nextprev > li {
	padding: 0.75em 1em;
	border-radius: 6px;
	transition: background 0.15s;
}

.links-nextprev > li:hover {
	background: var(--c-surface);
}

.links-nextprev a {
	color: var(--c-green-deep);
	text-decoration: none;
	font-weight: 600;
}

.links-nextprev a:hover {
	color: var(--c-orange);
	text-decoration: underline;
}
```

- [ ] **Step 3: Visual check**

Run: `npm start`
Open a post with tags and where prev/next links exist.
Expected:
- Tags appear as small green-soft pills at the top of the article (no italic). Hover → yellow.
- Prev/next at the bottom: top divider is solid green-soft. Hovering each item gives a soft off-white background.

Open `/tags/` and `/categories/` pages.
Expected: tag/category lists render with the green pill styling.

- [ ] **Step 4: Commit**

```bash
git add css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: tag pills and prev/next link hover

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Cleanup obsolete rules and footer

**Files:**
- Modify: `css/customized-theme.css` (delete obsolete blocks)

- [ ] **Step 1: Remove obsolete home-container rules**

Find and **delete** these rules in `css/customized-theme.css` (they are residue from the prior pre-`.page-wrap` centering hack):

```css
.home-container {
	display: flex;
	flex-direction: column;
}

.page-title {
	align-self: center;
}

.postlist-container {
	align-self: center;
}

.page-footer {
	align-self: center;
}
```

Note: a new `.page-title` rule was added in Task 4 — that one stays. Only delete the `align-self: center` variants.

- [ ] **Step 2: Append footer style**

Append to `css/customized-theme.css`:

```css
/* —— Footer —— */
footer {
	margin-top: 3rem;
	border-top: 1px solid var(--c-border);
}

footer .page-wrap {
	padding-top: 1rem;
	padding-bottom: 1rem;
	text-align: center;
	color: var(--c-text-soft);
	font-size: 0.875rem;
}

footer p {
	margin: 0;
}
```

- [ ] **Step 3: Visual check**

Run: `npm start`
Expected:
- Footer copyright line is muted green, centered, with a soft top divider.
- Pages still look consistent — removing the `align-self` rules should be invisible since `.page-wrap` already centers content.

- [ ] **Step 4: Commit**

```bash
git add css/customized-theme.css
git commit -m "$(cat <<'EOF'
style: footer treatment and remove obsolete align-self rules

The .page-wrap container now handles horizontal centering, so the
prior align-self hacks on .page-title / .postlist-container /
.page-footer are dead code.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Full-site visual verification

**Files:** none modified — this task is verification only.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build completes without errors. Spot-check a few generated files in `_site/` exist (e.g. `_site/index.html`, `_site/blog/index.html`).

- [ ] **Step 2: Restart dev server**

Run: `npm start` (kill any existing one first)
Open: `http://localhost:8080/`

- [ ] **Step 3: Page-by-page check**

Open each page and verify the listed expectations.

| Page | URL | Expected |
|---|---|---|
| Home | `/` | Yellow body, header pill on "主页", postlist in off-white card, orange counters |
| About | `/about/` | Body content centered in 720px, no postlist, content readable |
| Blog index | `/blog/` | Postlist in card, paginated if applicable |
| Tags index | `/tags/` | Tag pills laid out as wrapped row of green pills |
| Categories index | `/categories/` | Category list renders correctly |
| Single tag page | `/tags/<some-tag>/` | Filtered postlist in card |
| Single category page | `/categories/<some-cat>/` | Filtered postlist in card |
| Post detail (long) | pick any from `content/blog/` | TOC sticky on right (>1100px); article in card; tags as pills; prev/next at bottom |

- [ ] **Step 4: Responsive sweep**

Use browser devtools responsive mode. Check three widths on one post page:
- 1280px: TOC visible right.
- 900px: TOC hidden, article 720px centered.
- 480px: article card padding reduced, no horizontal scroll.

- [ ] **Step 5: OS dark-mode check**

Switch macOS appearance to Dark (System Settings → Appearance). Reload the dev page.
Expected: page stays in the new light theme — yellow background, green text. No fallback to old dark theme.

- [ ] **Step 6: Link state check**

On any page with links, hover/click and confirm:
- Default link: orange with orange underline (article body) or just colored (header/nav).
- Hover: deep-green.
- Visited link: still orange (test by clicking a postlist link, then going back).

- [ ] **Step 7: If any issue is found, fix it and add a step to that task's commit, OR add a new commit with a focused message.** Otherwise no commit needed for verification.

---

## Self-Review (post-write checklist — completed inline)

**Spec coverage:**
- Layout & containers → Task 2, 5
- Color tokens → Task 1
- Typography → Task 2 (headings), Task 6 (body)
- Header/nav/active pill → Task 3
- Surface card + postlist → Task 4
- Article body / inline code / pre / blockquote → Task 6
- TOC sticky right + responsive collapse → Task 5
- Tag pills + prev/next → Task 7
- Footer + cleanup → Task 8
- Verification across pages → Task 9
- Drop dark mode → Task 1 step 1

All sections of the spec have an owning task.

**Placeholder scan:** no TBD/TODO. All code blocks are concrete.

**Type/name consistency:**
- `.page-wrap` used consistently across base.njk and CSS.
- `.surface-card` introduced in Task 4, applied to `.page-post` in Task 5 — class name matches.
- `.post-layout` (renamed from `.post-main`) used consistently in Task 5 template + CSS.
- `--c-*` token names match between Task 1 definition and all later usages.

---

## Execution Notes

- Each task ends with a commit. Commits accumulate on `main`. If you prefer a feature branch, create one before Task 1.
- All tasks are CSS/template — no test runner involved. Visual verification replaces unit tests.
- If Prism token colors look wrong over the new theme during Task 6, the spec says **leave Prism alone** — do not modify `prism-tomorrow.css` or `prism-diff.css`. Adjust the `pre` container only.
