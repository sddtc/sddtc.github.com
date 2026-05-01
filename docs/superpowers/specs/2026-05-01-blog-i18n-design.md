# Blog Internationalization Design

## Goal

Add bilingual site UI for Chinese and English while keeping article bodies in Chinese for now. The site should have clear language-prefixed URLs, explicit language switching, browser-language detection only at the root entry point, and translated taxonomy display names for categories and common tags.

This project does not include German support, article-body translation, or a translation API integration.

## Languages

Supported languages:

- `zh`: Chinese, primary content language.
- `en`: English, secondary UI language.

Chinese remains the source content language. English pages reuse the same Chinese article body until a later article translation project exists.

## URL Structure

Only language-prefixed content URLs are canonical:

```text
/zh/
/zh/blog/
/zh/blog/<slug>/
/zh/categories/
/zh/categories/<category>/
/zh/tags/
/zh/tags/<tag>/
/zh/about/

/en/
/en/blog/
/en/blog/<slug>/
/en/categories/
/en/categories/<category>/
/en/tags/
/en/tags/<tag>/
/en/about/
```

The root path `/` is a language entry page. It should not be a full blog homepage.

Existing unprefixed routes are not generated as full pages in the new model. They are compatibility redirects to the matching Chinese route:

```text
/blog/*       -> /zh/blog/*
/categories/* -> /zh/categories/*
/tags/*       -> /zh/tags/*
/about/       -> /zh/about/
```

This keeps the long-term route model simple while reducing broken links for old URLs.

## Root Language Detection

Automatic language detection only runs on `/`.

Detection order:

1. If the user has explicitly selected a language, use the stored `localStorage` preference.
2. Otherwise inspect `navigator.language` or `navigator.languages`.
3. If the browser language starts with `zh`, navigate to `/zh/`.
4. Otherwise navigate to `/en/`.

Language-prefixed URLs are authoritative. Visiting `/zh/...` always renders Chinese UI, and visiting `/en/...` always renders English UI. The site should not automatically redirect prefixed pages based on browser settings.

If JavaScript is unavailable, `/` should still provide visible links to `/zh/` and `/en/`.

## Explicit Language Switcher

Every generated page has an explicit language switcher for `中文 | English`.

Switching language should:

- Navigate to the equivalent route in the target language when possible.
- Store the target language in `localStorage`.
- Preserve the current content context.

Examples:

```text
/zh/blog/example-post/ -> /en/blog/example-post/
/en/blog/example-post/ -> /zh/blog/example-post/
/zh/tags/java/         -> /en/tags/java/
/en/categories/技术开发/ -> /zh/categories/技术开发/
```

The URL slug stays stable across languages. Display names change by language, not URL path segments.

## UI Text

Site chrome and fixed page text should come from an i18n dictionary keyed by language.

Initial UI keys include:

- Site navigation: home, categories, tags, posts, about.
- Listing headings: latest posts, all posts, category list, tag list.
- Post metadata labels: date, tags.
- Post navigation labels: previous, next.
- Feed and metadata labels where applicable.
- 404 page fixed text.
- Language switcher labels.

Existing Chinese strings in templates should move behind this dictionary when they are part of the reusable UI.

## Taxonomy Translation

Categories and common tags should display translated names in English UI.

Rules:

- Category and tag URL values remain stable.
- Display names go through a translation lookup based on current language.
- Missing English mappings fall back to the original category or tag value.
- The translation table should be easy to extend as new categories and tags appear.

Example:

```js
{
  categories: {
    "技术开发": { en: "Development" },
    "工程实践": { en: "Engineering Practice" },
    "个人生活": { en: "Personal" }
  },
  tags: {
    "数据库": { en: "Database" },
    "年度总结": { en: "Yearly Review" },
    "碎碎念": { en: "Notes" },
    "爬虫": { en: "Crawler" }
  }
}
```

English technical tags such as `java`, `kafka`, `Fastify`, and `MCP` can usually fall back unchanged unless a better display name is needed.

## Content Model

Article markdown files remain the source of article content.

The implementation should avoid duplicating all markdown files only to generate language-specific UI. Prefer shared content plus language-aware generated pages or data transforms.

Each rendered page needs a clear `lang` value:

- `zh` for `/zh/...`.
- `en` for `/en/...`.

Article body content is unchanged between languages for this phase.

## Layout And Navigation

The base layout should set:

```html
<html lang="zh">
```

or:

```html
<html lang="en">
```

based on current page language.

Navigation links should target the current language prefix. For example, on English pages the top nav should link to `/en/`, `/en/categories/`, `/en/tags/`, `/en/blog/`, and `/en/about/`.

The root language entry page should use a minimal layout with links to both language homepages and a small script for preference/browser-language redirect.

## SEO And Feeds

Canonical URLs should use the language-prefixed route.

Pages with equivalents in both languages should expose alternate language links:

```html
<link rel="alternate" hreflang="zh" href="https://www.sddtc.florist/zh/...">
<link rel="alternate" hreflang="en" href="https://www.sddtc.florist/en/...">
```

The root entry page can use `x-default` pointing to `/`.

RSS can remain Chinese-only initially unless the implementation can produce a clear English UI feed without implying translated article bodies. If an English feed is added later, it should be explicit that article content is still Chinese.

## Redirects

Use the deployment platform redirect mechanism where possible. This project has `netlify.toml`, so old route redirects should be implemented there unless Eleventy already has a local redirect pattern that fits better.

Redirect behavior:

- Old unprefixed content routes redirect to `/zh/...`.
- Root `/` is not a static redirect to `/zh/`; it is the language detection entry point.
- Redirects should preserve path segments and query strings where supported.

## Testing And Verification

Verification should include:

- Build succeeds with Eleventy.
- Generated output contains `/zh/` and `/en/` versions of the main index, blog list, tags, categories, about, and post pages.
- `/` renders a language choice fallback and includes root detection logic.
- Language-prefixed pages set the correct `<html lang>`.
- Navigation links use the current language prefix.
- Language switcher links point to the equivalent route.
- English UI renders translated fixed text and translated category/tag display names.
- Missing taxonomy translations fall back to the original value.
- Existing unprefixed routes are covered by redirects to `/zh/...`.

Automated tests should cover pure helpers such as locale selection, translated taxonomy display, and language-aware URL generation when those helpers exist. Build verification remains mandatory because this is a static site generation change.

## Non-Goals

- German language support.
- Translating article bodies.
- Calling translation APIs during request time or build time.
- Browser-language detection on every route.
- Generating unprefixed full content pages after the migration.
- Changing article slugs as part of translation.

## Open Implementation Notes

The implementation plan should choose the smallest Eleventy-native structure that avoids mass-copying markdown files. If this requires introducing generated templates or collection helpers, keep them scoped to language routing and i18n rendering.

Because this change affects URLs, navigation, and generated output broadly, implementation should proceed with tests around URL helpers before changing templates.
