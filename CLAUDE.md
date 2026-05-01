# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog (大蜕 / sddtc's blog) built with **Eleventy (11ty) v3** as a static site generator. Content is primarily in Chinese. Deployed to GitHub Pages at `www.sddtc.florist`.

## Commands

```bash
npm start              # Dev server with auto-reload (http://localhost:8080)
npm run build          # Production build → _site/
npm run debugstart     # Dev server with Eleventy debug logging
npm run build-ghpages  # Build with GitHub Pages path prefix
```

## Architecture

- **Content input**: `content/` — blog posts in `content/blog/`, pages as `.njk` files
- **Templates**: `_includes/layouts/` — Nunjucks templates (`base.njk` → `post.njk`/`home.njk`)
- **Config**: `eleventy.config.js` — plugins, markdown-it setup, bundling, image optimization
- **Filters**: `_config/filters.js` — custom Nunjucks filters (date formatting, etc.)
- **Data**: `_data/metadata.js` (site metadata), `_data/eleventyDataSchema.js` (Zod draft validation)
- **Static assets**: `public/` → copied to `_site/` root
- **Styles**: `css/` — main styles, theme, Prism syntax highlighting
- **JS**: `js/` — click effect animation, Google Analytics
- **Output**: `_site/` (gitignored)

## Blog Post Conventions

Posts live in `content/blog/` with filename format `YYYY-MM-DD-slug.md`. Frontmatter:

```yaml
---
title: 文章标题
date: YYYY-MM-DD
tags: [tag1, tag2]
categories: [分类名]
---
```

- All posts automatically get the `posts` tag and `layouts/post.njk` layout via `blog.11tydata.js`
- Set `draft: true` in frontmatter to exclude from production builds (drafts show in dev server)
- Categories and tags generate dynamic listing pages (15 items per page)

## Key Plugins

- `eleventy-plugin-dynamic-categories` — auto-generates category pages
- `@11ty/eleventy-img` — image optimization (AVIF, WebP)
- `@11ty/eleventy-plugin-rss` — Atom feed at `/feed.xml`
- `eleventy-plugin-toc` + `markdown-it-anchor` — table of contents and heading anchors
- `@11ty/eleventy-plugin-syntaxhighlight` — Prism.js code blocks

## Deployment

Push to `main` triggers `.github/workflows/deploy-to-ghpages.yml` which builds and deploys to GitHub Pages via `peaceiris/actions-gh-pages`.

## Style

- ES modules throughout (`"type": "module"`)
- Tab indentation, 2-space width, UTF-8, LF line endings (see `.editorconfig`)
