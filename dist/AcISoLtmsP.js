window.blog = {}

/**
 * 工具，兼容的方式添加事件
 * @param {单个DOM节点} dom
 * @param {事件名} eventName
 * @param {事件方法} func
 * @param {是否捕获} useCapture
 */
blog.addEvent = function (dom, eventName, func, useCapture) {
	if (window.attachEvent) {
		dom.attachEvent('on' + eventName, func)
	} else if (window.addEventListener) {
		if (useCapture != undefined && useCapture === true) {
			dom.addEventListener(eventName, func, true)
		} else {
			dom.addEventListener(eventName, func, false)
		}
	}
}

blog.copyText = function (text) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(text)
	}

	var textarea = document.createElement('textarea')
	textarea.value = text
	textarea.setAttribute('readonly', '')
	textarea.style.position = 'fixed'
	textarea.style.top = '-9999px'
	document.body.appendChild(textarea)
	textarea.select()

	try {
		document.execCommand('copy')
		return Promise.resolve()
	} catch (err) {
		return Promise.reject(err)
	} finally {
		document.body.removeChild(textarea)
	}
}

blog.initCodeCopyButtons = function (root) {
	root = root || document
	var blocks = root.querySelectorAll ? root.querySelectorAll('pre') : []

	Array.prototype.forEach.call(blocks, function (pre) {
		if (pre.querySelector('.code-copy-button')) {
			return
		}

		var code = pre.querySelector('code')
		if (!code) {
			return
		}

		var button = document.createElement('button')
		button.type = 'button'
		button.classList.add('code-copy-button')
		button.textContent = '复制'
		button.setAttribute('aria-label', '复制代码')
		button.setAttribute('title', '复制代码')

		pre.classList.add('code-copy-enabled')
		pre.appendChild(button)

		blog.addEvent(button, 'click', function (ev) {
			if (ev.preventDefault) ev.preventDefault()
			if (ev.stopPropagation) ev.stopPropagation()

			blog.copyText(code.textContent).then(function () {
				button.textContent = '已复制'
				button.setAttribute('aria-label', '代码已复制')
				setTimeout(function () {
					button.textContent = '复制'
					button.setAttribute('aria-label', '复制代码')
				}, 1600)
			}).catch(function () {
				button.textContent = '失败'
				button.setAttribute('aria-label', '复制失败')
				setTimeout(function () {
					button.textContent = '复制'
					button.setAttribute('aria-label', '复制代码')
				}, 1600)
			})
		})
	})
}

blog.pickLanguage = function (storedLanguage, browserLanguages) {
	if (storedLanguage === 'zh' || storedLanguage === 'en') {
		return storedLanguage
	}

	var languages = Array.isArray(browserLanguages) ? browserLanguages : []
	for (var i = 0; i < languages.length; i++) {
		if (String(languages[i]).toLowerCase().indexOf('zh') === 0) {
			return 'zh'
		}
	}
	for (var j = 0; j < languages.length; j++) {
		if (String(languages[j]).toLowerCase().indexOf('en') === 0) {
			return 'en'
		}
	}
	return 'zh'
}

blog.storeLanguagePreference = function (language) {
	if (language !== 'zh' && language !== 'en') {
		return
	}
	if (window.localStorage && window.localStorage.setItem) {
		window.localStorage.setItem('preferredLanguage', language)
	}
}

blog.initLanguageEntry = function (options) {
	var storedLanguage = window.localStorage && window.localStorage.getItem
		? window.localStorage.getItem('preferredLanguage')
		: ''
	var browserLanguages = navigator.languages && navigator.languages.length
		? navigator.languages
		: [navigator.language]
	var language = blog.pickLanguage(storedLanguage, browserLanguages)
	window.location.assign(options[language])
}

/**
 * 特效：点击页面文字冒出特效
 */
blog.initClickEffect = function (textArr) {
	function createDOM(text) {
		var dom = document.createElement('span')
		dom.innerText = text
		dom.style.left = 0
		dom.style.top = 0
		dom.style.position = 'fixed'
		dom.style.fontSize = '12px'
		dom.style.whiteSpace = 'nowrap'
		dom.style.webkitUserSelect = 'none'
		dom.style.userSelect = 'none'
		dom.style.opacity = 0
		dom.style.transform = 'translateY(0)'
		dom.style.webkitTransform = 'translateY(0)'
		return dom
	}

	blog.addEvent(window, 'click', function (ev) {
		var tagName = ev.target.tagName.toLocaleLowerCase()
		if (tagName == 'a') {
			return
		}
		var text = textArr[parseInt(Math.random() * textArr.length)]
		var dom = createDOM(text)

		document.body.appendChild(dom)
		var w = parseInt(window.getComputedStyle(dom, null).getPropertyValue('width'))
		var h = parseInt(window.getComputedStyle(dom, null).getPropertyValue('height'))

		var sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
		dom.style.left = ev.pageX - w / 2 + 'px'
		dom.style.top = ev.pageY - sh - h + 'px'
		dom.style.opacity = 1

		setTimeout(function () {
			dom.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out'
			dom.style.webkitTransition = 'transform 500ms ease-out, opacity 500ms ease-out'
			dom.style.opacity = 0
			dom.style.transform = 'translateY(-26px)'
			dom.style.webkitTransform = 'translateY(-26px)'
		}, 20)

		setTimeout(function () {
			document.body.removeChild(dom)
			dom = null
		}, 520)
	})
}
; (function () {
			if (window.blog && window.blog.initLanguageEntry) {
				window.blog.initLanguageEntry({ zh: '/zh/', en: '/en/' })
			}
		})()