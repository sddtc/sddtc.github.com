import i18n from "../_data/i18n.js";
import taxonomyTranslations from "../_data/taxonomyTranslations.js";
import {
	localizedPostUrl,
	normalizeLanguage,
	postBasePath,
	translateMessage,
	translateTaxonomy,
	withLanguagePrefix,
} from "./i18n-helpers.js";

const ignoredTags = new Set(["all", "posts"]);

function sortedValues(values) {
	return [...values].sort((a, b) => String(a).localeCompare(String(b), "en"));
}

export default function addI18n(eleventyConfig) {
	eleventyConfig.addFilter("localizedUrl", withLanguagePrefix);
	eleventyConfig.addFilter("localizedPostUrl", localizedPostUrl);
	eleventyConfig.addFilter("t", (key, language) => translateMessage(i18n.messages, language, key));
	eleventyConfig.addFilter("taxonomyName", (value, type, language) =>
		translateTaxonomy(taxonomyTranslations, type, value, language)
	);
	eleventyConfig.addFilter("normalizeLanguage", normalizeLanguage);

	eleventyConfig.addCollection("localizedPosts", (collectionApi) => {
		const posts = collectionApi.getFilteredByTag("posts");
		return i18n.languages.flatMap((locale) =>
			posts.map((post) => ({
				locale,
				post,
				url: withLanguagePrefix(postBasePath(post), locale.code),
			}))
		);
	});

	eleventyConfig.addCollection("feedPosts", (collectionApi) => {
		return collectionApi.getFilteredByTag("posts").map((post) => {
			const feedPost = {
				date: post.date,
				data: post.data,
				inputPath: post.inputPath,
				fileSlug: post.fileSlug,
				url: withLanguagePrefix(postBasePath(post), i18n.defaultLanguage),
			};
			Object.defineProperty(feedPost, "content", {
				enumerable: true,
				get() {
					return post.content || post.templateContent;
				},
			});
			return feedPost;
		});
	});

	eleventyConfig.addCollection("localizedCategories", (collectionApi) => {
		const posts = collectionApi.getFilteredByTag("posts");
		const categories = sortedValues(new Set(posts.flatMap((post) => post.data.categories || [])));
		return i18n.languages.flatMap((locale) =>
			categories.map((category) => ({
				locale,
				category,
				url: withLanguagePrefix(`/categories/${category}/`, locale.code),
				posts: posts.filter((post) => post.data.categories?.includes(category)),
			}))
		);
	});

	eleventyConfig.addCollection("localizedTags", (collectionApi) => {
		const posts = collectionApi.getFilteredByTag("posts");
		const tags = sortedValues(
			new Set(posts.flatMap((post) => (post.data.tags || []).filter((tag) => !ignoredTags.has(tag))))
		);
		return i18n.languages.flatMap((locale) =>
			tags.map((tag) => ({
				locale,
				tag,
				url: withLanguagePrefix(`/tags/${tag}/`, locale.code),
				posts: posts.filter((post) => post.data.tags?.includes(tag)),
			}))
		);
	});
}
