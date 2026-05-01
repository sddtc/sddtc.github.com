import test from "node:test";
import assert from "node:assert/strict";
import {
	DEFAULT_LANGUAGE,
	normalizeLanguage,
	stripLanguagePrefix,
	withLanguagePrefix,
	switchLanguageUrl,
	postBasePath,
	translateMessage,
	translateTaxonomy,
} from "../_config/i18n-helpers.js";

test("normalizes supported and unsupported languages", () => {
	assert.equal(DEFAULT_LANGUAGE, "zh");
	assert.equal(normalizeLanguage("zh-CN"), "zh");
	assert.equal(normalizeLanguage("en-US"), "en");
	assert.equal(normalizeLanguage("de-DE"), "zh");
});

test("adds and switches language prefixes", () => {
	assert.equal(withLanguagePrefix("/", "en"), "/en/");
	assert.equal(withLanguagePrefix("/blog/", "zh"), "/zh/blog/");
	assert.equal(withLanguagePrefix("/zh/tags/js/", "en"), "/en/tags/js/");
	assert.equal(stripLanguagePrefix("/en/categories/devops/"), "/categories/devops/");
	assert.equal(switchLanguageUrl("/zh/blog/a-post/", "en"), "/en/blog/a-post/");
});

test("builds localized post base path from file slug", () => {
	assert.equal(postBasePath({ fileSlug: "hello-world" }), "/blog/hello-world/");
	assert.equal(postBasePath({ page: { filePathStem: "/blog/2017-03-03-all-years-note" } }), "/blog/2017-03-03-all-years-note/");
	assert.equal(
		postBasePath({
			inputPath: "./content/blog/2017-03-03-all-years-note.md",
			page: { filePathStem: "/blog/all-years-note" },
		}),
		"/blog/2017-03-03-all-years-note/"
	);
	assert.equal(postBasePath({ inputPath: "./content/blog/2015-12-28-all-years-note.md" }), "/blog/2015-12-28-all-years-note/");
	assert.equal(
		postBasePath({
			inputPath:
				"./content/blog/2026-03-04-fastify-modular-db-orm-intro/2026-03-04-fastify-modular-db-orm-intro.md",
		}),
		"/blog/2026-03-04-fastify-modular-db-orm-intro/"
	);
});

test("translates messages and taxonomy with fallback", () => {
	const messages = { zh: { nav: { home: "主页" } }, en: { nav: { home: "Home" } } };
	const taxonomy = { tags: { security: { zh: "安全", en: "Security" } } };
	assert.equal(translateMessage(messages, "en", "nav.home"), "Home");
	assert.equal(translateMessage(messages, "en", "nav.missing"), "nav.missing");
	assert.equal(translateTaxonomy(taxonomy, "tags", "security", "zh"), "安全");
	assert.equal(translateTaxonomy(taxonomy, "tags", "unknown", "en"), "unknown");
});
