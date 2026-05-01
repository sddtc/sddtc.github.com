export const SUPPORTED_LANGUAGES = ["zh", "en"];
export const DEFAULT_LANGUAGE = "zh";

export function normalizeLanguage(language) {
	const normalized = String(language || "").toLowerCase();
	if (normalized.startsWith("zh")) {
		return "zh";
	}
	if (normalized.startsWith("en")) {
		return "en";
	}
	return DEFAULT_LANGUAGE;
}

export function stripLanguagePrefix(url) {
	const value = url || "/";
	const stripped = value.replace(/^\/(zh|en)(?=\/|$)/, "");
	return stripped || "/";
}

export function withLanguagePrefix(url, language) {
	const lang = normalizeLanguage(language);
	const path = stripLanguagePrefix(url);
	if (path === "/") {
		return `/${lang}/`;
	}
	return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}

export function switchLanguageUrl(url, language) {
	return withLanguagePrefix(url || "/", language);
}

export function postBasePath(post) {
	if (post?.inputPath) {
		const stem = post.inputPath
			.replace(/^\.?\//, "")
			.replace(/^content\//, "")
			.replace(/\.[^.]+$/, "");
		return pathFromParts(stem.split("/"));
	}
	const filePathStem = post?.page?.filePathStem || post?.filePathStem;
	if (filePathStem) {
		return pathFromParts(filePathStem.replace(/^\/+/, "").split("/"));
	}
	return `/blog/${post.fileSlug}/`;
}

function pathFromParts(parts) {
	if (parts.length >= 3 && parts.at(-1) === parts.at(-2)) {
		parts.pop();
	}
	return `/${parts.join("/")}/`;
}

export function localizedPostUrl(post, language) {
	return withLanguagePrefix(postBasePath(post), language);
}

export function translateMessage(messages, language, key) {
	const lang = normalizeLanguage(language);
	const value = key.split(".").reduce((node, part) => node?.[part], messages?.[lang]);
	return typeof value === "string" ? value : key;
}

export function translateTaxonomy(translations, type, value, language) {
	const lang = normalizeLanguage(language);
	return translations?.[type]?.[value]?.[lang] || value;
}
