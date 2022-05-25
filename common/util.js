/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id util.js 2019.10.6 $
 * @author winder
 */

/**
 * 定义PC端网关
 */
const PCWEBURL = 'https://cnstore.edisonwang.cn/'

/**
 * 定义H5端网关
 */
const H5WEBURL = 'https://cnstore.edisonwang.cn/'

/**
 * 通用参数在此配置，请不要配置风险参数（如支付秘钥等信息）
 */
const CONFIG = {
	// 微信小程序原始ID
	wxid: 'gh_e7f715102bb0',
	appId: 'wx18c7c6c6d8e4c3f5',
	seller: {
		appId: ''
	}
}

/**
 * 关于 setStorageSync 存储时间问题
 * H5端为localStorage，浏览器限制5M大小，是缓存概念，可能会被清理
 * App端为原生的plus.storage，无大小限制，不是缓存，是持久化的
 * 各个小程序端为其自带的storage api，数据存储生命周期跟小程序本身一致，即除用户主动删除或超过一定时间被自动清理，否则数据都一直可用。
 * 微信小程序单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
 * 支付宝小程序单条数据转换成字符串后，字符串长度最大200*1024。同一个支付宝用户，同一个小程序缓存总上限为10MB。
 * 百度、字节跳动小程序文档未说明大小限制
 */
function verifyLogin(tologin = true, redirect = null, confirm = false, opentype = 'redirect') {
	let visitor = uni.getStorageSync('visitor') || {}
	if (visitor.userid) {
		return true
	} else {
		if (tologin) {
			// 成功登录后的回跳
			if (redirect !== false) {
				if (isEmpty(redirect)) {
					redirect = uni.getStorageSync('redirect') || false
				} else {
					// for this.$mp.page.route, example as 'pages/...'
					if (redirect.substr(0, 1) != '/') redirect = '/' + redirect
					storageRedirectUrl(redirect)
				}
			}
			let loginUrl = '/pages/login/login' + (redirect ? '?redirect=yes' : '')
			if (confirm) {
				uni.showModal({
					title: "提示",
					content: "请先登录",
					success: function(res) {
						if (res.confirm) {
							return redirectUrl(loginUrl, opentype, 'slide-in-bottom')
						}
					}
				})
			} else {
				return redirectUrl(loginUrl, opentype, 'slide-in-bottom')
			}
		} else {
			return false
		}
	}
}

/**
 * 验证卖家身份
 */
function verifySeller(redirect = true, dialog = true) {
	let visitor = uni.getStorageSync('visitor') || {}
	// 是卖家
	if (visitor.store_id) {
		return true
	}
	// 没有登录，执行登录
	else if (!visitor.userid) {
		return (redirect == false) ? false : redirectUrl('/pages/login/login')
	}
	// 已登录，但不是卖家
	else {
		// 是否弹窗提示
		if (dialog == false) {
			return false
		}
		uni.showModal({
			title: '提示',
			content: '您不是卖家，无权访问',
			showCancel: false,
			complete() {
				uni.navigateBack()
			}
		})
	}
}

/**
 * 跳转到第三方小程序
 * @param {Object} page
 */
function redirectMp(page, appId = '') {
	// #ifdef MP
	uni.navigateToMiniProgram({
		appId: appId ? appId : this.CONFIG.appId,
		path: page
	})
	// #endif

	// #ifndef MP
	redirectUrl(page, 'navigate')
	// #endif
}

/**
 * 跳转到指定页面
 */
function redirectUrl(url, opentype = 'redirect', animationType = 'pop-in') {
	// 将服务端的地址转成客户端的地址
	url = formatUrl(url)

	// 跳转到Tab页
	if (opentype == 'switch' || (inArray(url, [
			'/pages/index/index',
			'/pages/category/list',
			'/pages/cart/index',
			'/pages/user/index',

			// 商家端独立的情况
			// '/pages/seller/index/index',
			// '/pages/seller/module/index',
			// '/pages/seller/store/setting'
		]))) {
		uni.switchTab({
			url: url
		})
	}
	// 关闭当前页
	else if (opentype == 'redirect') {
		uni.redirectTo({
			url: url
		})
	}
	// 保留当前页
	else {
		uni.navigateTo({
			url: url,
			animationType: animationType,
			animationDuration: animationType == 'slide-in-bottom' ? 300 : 200
		})
	}
}

/**
 * 跳转到信息提示页面
 * @param {Object} status
 * @param {Object} title
 * @param {Object} content
 * @param {Object} btns
 */
function redirectMessage(status, title, content = '', btns = null) {
	let url = '/pages/message/message?status=' + status + '&title=' + title + '&content=' + content + (btns ?
		'&btns=' + JSON.stringify(btns) : '')
	return redirectUrl(url)
}


/**
 * 将服务器设置的路由格式化为客户端的路由
 * @param {Object} url
 */
function formatUrl(url) {

	if (url.substr(0, 7) == '/pages/') {
		return url
	}
	if (url.substr(0, 6) == 'pages/') {
		return '/' + url
	}

	url = url.replace(PCWEBURL, '')
	if (url.substr(0, 1) == '/') {
		url = url.substr(1)
	}

	let route = url.split('?')[0]
	if (route.indexOf('.html') > -1) {
		route = route.replace('.html', '')
	}

	if (inArray(route, ['goods'])) {
		route = 'goods/index'
	}

	if (inArray(route, ['category/index', 'limitbuy/index'])) {
		route = route.replace('/index', '/list')
	}

	return '/pages/' + route + (isEmpty(url.split('?')[1]) ? '' : '?' + url.split('?')[1])
}

/**
 * 获取当前页面地址及参数
 */
function getUrl() {
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let curRoute = routes[routes.length - 1].route //获取当前页面路由
	let curParam = routes[routes.length - 1].options; //获取路由参数
	// 拼接参数
	let param = ''
	for (let key in curParam) {
		param += '&' + key + '=' + curParam[key]
	}

	return '/' + curRoute + (param ? '?' + param.substr(1) : '')
}

/**
 * APP/小程序中扫码
 * 允许从相机和相册扫码
 */
function scanCode() {
	// #ifdef APP-PLUS || MP
	uni.scanCode({
		success: function(res) {
			if (res.path) {
				redirectUrl(res.path)
			} else if (res.result) {
				uni.showModal({
					title: '扫码结果',
					content: res.result
				})
			}
		}
	})
	// #endif
}

/**
 * 获取UniAPP支付代码
 * @param {Object} payment_code
 */
function uniProvider(payment_code) {
	if (payment_code.indexOf('alipay') > -1) {
		return 'alipay'
	}
	if (payment_code.indexOf('wxapppay') > -1 || payment_code.indexOf('wxmppay') > -1 || payment_code.indexOf(
			'wxh5pay') >
		-1) {
		return 'wxpay'
	}
	return payment_code
}

/**
 * 获取微信小程序支付需要的code
 * 适用于购物支付和充值
 */
function getWxCode() {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		uni.login({
			provider: 'weixin',
			success: res => {
				resolve(res.code)
			},
			fail: err => {
				reject(err)
			}
		})
		// #endif

		// #ifndef MP-WEIXIN
		resolve(0)
		reject(0)
		// #endif
	})
}

/**
 * 判断是否在微信公众号中
 */
function isWechat() {
	// #ifdef H5
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/micromessenger/i) == 'micromessenger') {
		return true;
	}
	// #endif

	return false
}

/**
 * 判断是否在QQ内置浏览器中
 */
function isQqbrowser() {
	// #ifdef H5
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/qq/i) == 'qq') {
		return true;
	}
	// #endif

	return false
}

/**
 * 判断是否在支付宝客户端（内嵌浏览器）
 */
function isAlipay() {
	// #ifdef H5
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/alipayclient/i) == 'alipayclient') {
		return true;
	}
	// #endif

	return false
}


/**
 * APP中分享
 * 默认分享为小程序卡片，如果没有配置小程序原始ID，则分享为图文（点击后进入H5页面）
 * @param {Object} that
 * @param {Object} provider
 */
function share(body, provider) {
	uni.share(Object.assign(body, {
		provider: provider,
		scene: "WXSceneSession", // provider == weixin
		type: CONFIG.wxid ? 5 : (H5WEBURL ? 0 : 2), // 分享类型 0 = 图文, 2 = 纯图片, 5=小程序
		href: H5WEBURL + body.path,
		miniProgram: CONFIG.wxid ? {
			id: CONFIG.wxid, // 小程序原始ID
			path: body.path,
			type: 0, // 正式版小程序
			webUrl: H5WEBURL + body.path
		} : null,
		success: function(res) {
			// console.log("success:" + JSON.stringify(res));
		},
		fail: function(err) {}
	}));
}

/**
 * 判断对象/数组是否为空
 * @param {Object} array
 */
function isEmpty(array) {
	if (typeof array == "undefined" || array == undefined || array == null || array == '') {
		return true
	}
	return false
}

/**
 * 数组去重
 * @param {Object} arr
 */
function unique(arr) {
	//Set数据结构，它类似于数组，其成员的值都是唯一的
	return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
}

/**
 * 判断某个元素是否在数组里面
 * @param {Object} search
 * @param {Object} array
 */
function inArray(search, array) {
	for (let index in array) {
		if (array[index] == search) {
			return true
			break
		}
	}
	return false
}

/**
 * 判断是否为手机号
 * @param {Object} str
 */
function isPhone(str) {
	let reg = /^[1][3456789][0-9]{9}$/
	if (reg.test(str)) {
		return true
	}
	return false
}

/**
 * 临时存储跳转Url地址
 * 考虑到微信不支持跳转地址过长（或参数过多），故采用此方式
 * @param {Object} route
 * @param {Object} params
 */
function storageRedirectUrl(route, params = null) {
	uni.setStorage({
		key: 'redirect',
		data: spliceUrl(route, params)
	})
}

/**
 * 移除某个缓存
 */
function reomveStorage(key, confirm = true) {
	if (confirm) {
		uni.removeStorage({
			key: key
		})
	}
}

/**
 * 拼接url带参数
 */
function spliceUrl(string, object = null) {
	let path = ''
	if (typeof string == 'string' && !isEmpty(string)) {
		let params = {}
		let obj = string.split('?')
		path = obj[0]
		if (!isEmpty(path)) {
			if (typeof obj[1] == 'string' && !isEmpty(obj[1])) {
				let keyval = obj[1].split('&')
				for (let index in keyval) {
					let value = keyval[index].split('=')
					if (!isEmpty(value[0])) {
						params[value[0]] = isEmpty(value[1]) ? '' : value[1]
					}
				}
			}
			Object.assign(params, object)
		}

		let uri = ''
		for (var key in params) {
			uri += key + "=" + params[key] + "&"
		}
		if (uri != '') {
			path += '?' + uri.substr(0, uri.length - 1)
		}
	}

	return path
}

/**
 * 该方法用于将有父子关系的数组转换成树形结构的数组
 * 接收一个具有父子关系的数组作为参数
 * 返回一个树形结构的数组
 */
function translateDataToTree(data) {
	//没有父节点的数据
	let parents = data.filter(value => value.parent_id == 0)

	//有父节点的数据
	let children = data.filter(value => value.parent_id !== 0 && value.parent_id != null)

	//定义转换方法的具体实现
	let translator = (parents, children) => {
		//遍历父节点数据
		parents.forEach((parent) => {
			//遍历子节点数据
			children.forEach((current, index) => {
				//此时找到父节点对应的一个子节点
				if (current.parent_id === parent.value) {
					//对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
					let temp = JSON.parse(JSON.stringify(children))
					//让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
					temp.splice(index, 1)
					//让当前子节点作为唯一的父节点，去递归查找其对应的子节点
					translator([current], temp)
					//把找到子节点放入父节点的children属性中
					typeof parent.children !== 'undefined' ? parent.children.push(current) : parent
						.children = [current]
				}
			})
		})
	}

	//调用转换方法
	translator(parents, children)

	//返回最终的结果
	return parents
}

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) +
			'-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	H5WEBURL: H5WEBURL,
	CONFIG: CONFIG,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	isEmpty: isEmpty,
	isPhone: isPhone,
	unique: unique,
	inArray: inArray,
	spliceUrl: spliceUrl,
	getUrl: getUrl,
	storageRedirectUrl: storageRedirectUrl,
	reomveStorage: reomveStorage,
	verifyLogin: verifyLogin,
	verifySeller: verifySeller,
	redirectUrl: redirectUrl,
	redirectMp: redirectMp,
	formatUrl: formatUrl,
	redirectMessage: redirectMessage,
	uniProvider: uniProvider,
	getWxCode: getWxCode,
	scanCode: scanCode,
	share: share,
	isWechat: isWechat,
	isAlipay: isAlipay,
	isQqbrowser: isQqbrowser,
	translateDataToTree: translateDataToTree
}
