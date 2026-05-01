function getAdjacentPost(posts, currentPost, offset) {
	const index = posts.findIndex((post) => post.inputPath === currentPost.inputPath);
	return index === -1 ? undefined : posts[index + offset];
}

export default class LocalizedPosts {
	data() {
		return {
			pagination: {
				data: "collections.localizedPosts",
				size: 1,
				alias: "localizedPost",
			},
			layout: "layouts/post.njk",
			eleventyExcludeFromCollections: true,
			eleventyComputed: {
				lang: (data) => data.localizedPost.locale.code,
				permalink: (data) => data.localizedPost.url,
				title: (data) => data.localizedPost.post.data.title,
				date: (data) => data.localizedPost.post.date,
				tags: (data) => data.localizedPost.post.data.tags,
				categories: (data) => data.localizedPost.post.data.categories,
				sourcePost: (data) => data.localizedPost.post,
				previousPost: (data) =>
					getAdjacentPost(data.collections.posts, data.localizedPost.post, -1),
				nextPost: (data) =>
					getAdjacentPost(data.collections.posts, data.localizedPost.post, 1),
			},
		};
	}

	render(data) {
		return data.localizedPost.post.templateContent;
	}
}
