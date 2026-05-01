import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

class FakeClassList {
	constructor() {
		this.values = new Set();
	}

	add(...names) {
		for (const name of names) {
			this.values.add(name);
		}
	}

	contains(name) {
		return this.values.has(name);
	}
}

class FakeElement {
	constructor(tagName, textContent = '') {
		this.tagName = tagName.toUpperCase();
		this.textContent = textContent;
		this.children = [];
		this.attributes = {};
		this.classList = new FakeClassList();
		this.listeners = {};
	}

	appendChild(child) {
		this.children.push(child);
		child.parentNode = this;
		return child;
	}

	querySelector(selector) {
		if (selector === 'code') {
			return this.children.find((child) => child.tagName === 'CODE') || null;
		}

		if (selector === '.code-copy-button') {
			return this.children.find((child) => child.classList.contains('code-copy-button')) || null;
		}

		return null;
	}

	setAttribute(name, value) {
		this.attributes[name] = value;
	}

	getAttribute(name) {
		return this.attributes[name];
	}

	addEventListener(name, listener) {
		this.listeners[name] = listener;
	}

	click() {
		return this.listeners.click?.({ preventDefault() {} });
	}
}

async function loadBlogScript() {
	const source = await readFile(new URL('../js/customized-bundle.js', import.meta.url), 'utf8');
	const timers = [];
	const context = {
		document: {
			createElement(tagName) {
				return new FakeElement(tagName);
			},
		},
		navigator: {
			language: 'zh-CN',
			languages: ['zh-CN'],
			clipboard: {
				writtenText: null,
				writeText(text) {
					this.writtenText = text;
					return Promise.resolve();
				},
			},
		},
		localStorage: {
			values: new Map(),
			getItem(key) {
				return this.values.get(key) || null;
			},
			setItem(key, value) {
				this.values.set(key, value);
			},
		},
		location: {
			assignedUrl: null,
			assign(url) {
				this.assignedUrl = url;
			},
		},
		setTimeout(callback) {
			timers.push(callback);
		},
		addEventListener() {},
		runTimers() {
			while (timers.length > 0) {
				timers.shift()();
			}
		},
	};
	context.window = context;

	vm.createContext(context);
	vm.runInContext(source, context);
	return context;
}

test('initCodeCopyButtons decorates code blocks and copies code text', async () => {
	const context = await loadBlogScript();
	const pre = new FakeElement('pre');
	pre.appendChild(new FakeElement('code', 'const answer = 42;'));
	const document = {
		querySelectorAll(selector) {
			assert.equal(selector, 'pre');
			return [pre];
		},
	};

	context.blog.initCodeCopyButtons(document);

	const button = pre.querySelector('.code-copy-button');
	assert.ok(button);
	assert.equal(button.textContent, '复制');
	assert.equal(button.getAttribute('aria-label'), '复制代码');

	button.click();
	await Promise.resolve();

	assert.equal(context.navigator.clipboard.writtenText, 'const answer = 42;');
	assert.equal(button.textContent, '已复制');

	context.runTimers();
	assert.equal(button.textContent, '复制');
});

test('pickLanguage prefers stored language, then browser languages', async () => {
	const context = await loadBlogScript();

	assert.equal(context.blog.pickLanguage('en', ['zh-CN']), 'en');
	assert.equal(context.blog.pickLanguage('', ['zh-CN']), 'zh');
	assert.equal(context.blog.pickLanguage('', ['de-DE', 'en-US']), 'en');
	assert.equal(context.blog.pickLanguage('', ['de-DE']), 'zh');
});

test('initLanguageEntry redirects and stores explicit language preferences', async () => {
	const context = await loadBlogScript();

	context.localStorage.setItem('preferredLanguage', 'en');
	context.blog.initLanguageEntry({ zh: '/zh/', en: '/en/' });
	assert.equal(context.location.assignedUrl, '/en/');

	context.blog.storeLanguagePreference('zh');
	assert.equal(context.localStorage.getItem('preferredLanguage'), 'zh');
});
