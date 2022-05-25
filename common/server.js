/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id server.js 2019.10.6 $
 * @author winder
 */

// 也可以npm方式，但是考虑npm包太大，故直接引入
import md5 from './js-md5/js-md5.js'
import util from './util.js'

const SERVER = 'https://cnstore.edisonwang.cn/api'
const APPID = 'wx18c7c6c6d8e4c3f5'
const SECRET = 'f7945c071f33f01815760c38de2e3384'

/**
 * 通用请求封装
 * @param {Object} api
 * @param {Object} params
 * @param {Object} doSuccess
 * @param {Object} showLoad
 */
function request(api, params, doSuccess, showLoad) {
	let token = uni.getStorageSync('access_token') || ''
	if (util.isEmpty(token)) {
		doRequest('auth/token', params, function(res) {
			if (res.code == 0) {
				uni.setStorageSync('access_token', res.data.token)
				doRequest(api, params, doSuccess, showLoad)
			}
		}, false)
	} else {
		doRequest(api, params, doSuccess, showLoad)
	}
}

/**
 * 上传文件/图片到服务器
 * @param {Object} filePath
 * @param {Object} params
 * @param {Object} doSuccess
 */
function upload(filePath, params, doSuccess) {
	uni.uploadFile({
		url: SERVER + (params.mode == 'add' ? '/upload/add' : '/upload/file'),
		name: params.fileVal,
		filePath: filePath,
		//fileType: 'image', // image/video/audio 仅支付宝小程序，且必填
		formData: build(params, false),
		success: function(res) {
			if (typeof doSuccess == "function") {
				doSuccess(JSON.parse(res.data))
			}
		},
		fail: function(err) {
			console.log(err)
		}
	})
}

/**
 * 通用请求封装
 * @param {Object} api
 * @param {Object} params
 * @param {Object} doSuccess
 * @param {Object} showLoad
 */
function doRequest(api, params, doSuccess, showLoad = false) {

	// 显示加载中动画
	if (showLoad !== false) {
		uni.showLoading({
			title: "加载中...",
			// #ifndef MP-TOUTIAO
			mask: true
			// #endif
		})
	}

	uni.request({
		url: SERVER + '/' + api,
		data: build(params),
		dataType: 'json',
		header: {
			'content-type': 'application/json'
		},
		method: 'post',
		success: (res) => {
			// TOEKN过期或TOKEN非法，重新获取
			if (res.data.code == 4003 || res.data.code == 4002) {
				uni.removeStorageSync('visitor')
				uni.removeStorageSync('access_token')
				request(api, params, doSuccess, showLoad)
			} else if (typeof doSuccess == "function") {
				doSuccess(res.data)
			} else {
				console.log(res)
			}

			if (showLoad !== false) {
				uni.hideLoading()
			}
		},
		fail: (err) => {
			console.log(err)
			if (err.errMsg == 'request:fail') {
				uni.showToast({
					title: "网络连接失败",
					icon: "none",
					duration: 3000
				})
				uni.stopPullDownRefresh()
			}
		},
		complete: () => {}
	});
}

/**
 * Promise方式获取数据
 * @param {Object} api
 * @param {Object} params
 * @param {Object} doSuccess
 * @param {Object} showLoad
 * @used
 * async function detail(that) {
 *   let goodsInfo = await server.promise('goods/read', {goods_id: that.id})
 *   console.log(goodsInfo)
 * }
 */
function promise(api, params, doSuccess, showLoad) {
	return new Promise((resolve, reject) => {
		request(api, params, function(res) {
			if (res.code == 0) {
				resolve(res.data)
				if (typeof doSuccess == "function") {
					doSuccess(res.data)
				}
			} else {
				console.log(res)
				reject(new Error(res.message))
			}
		}, showLoad)
	})
}

/**
 * 创建请求BODY
 * @param {Object} params
 * @param {bool} pssl  
 */
function build(params, pssl = false) {

	var obj = {}

	// 系统级参数
	obj.appid = APPID
	obj.version = '3.0'
	obj.sign_type = 'md5'
	obj.timestamp = formatTime(new Date())
	obj.format = 'json' // json/xml
	obj.pssl = pssl // 为true表示业务参数也参与加密

	// TOKEN
	obj.token = uni.getStorageSync('access_token')

	// 业务级参数
	obj.params = JSON.stringify(params)

	// 排序
	obj = ksort(obj)

	let string = getEncryptionString(obj)
	obj.sign = md5(string + SECRET).toUpperCase()
	return obj;
}

/**
 * 获取待加密的字符串
 * @var bool pssl 业务参数是否参与加密（安全性更高，但也更消耗性能）
 */
function getEncryptionString(obj) {

	let string = ''

	// 业务参数不参与加密
	if (!obj.pssl) {
		for (var key in obj) {
			if (key != 'params') {
				obj[key] = encodeURIComponent(obj[key])
				string += key + "=" + character(obj[key]) + "&"
			}
		}
	}
	// 业务参数也参与加密，可能还要考虑剔除文件、字节流数据
	else {
		for (var key in obj) {
			obj[key] = encodeURIComponent(obj[key])
			string += key + "=" + character(obj[key]) + "&"
		}
	}

	return string ? string.substr(0, string.length - 1) : ''
}

/**
 * 数组排序
 * @param {Object} obj
 */
function ksort(obj) {

	var keyArray = Object.keys(obj).sort()

	var newObj = {}
	for (var i = 0; i < keyArray.length; i++) {
		newObj[keyArray[i]] = obj[keyArray[i]];
	}
	return newObj
}

/**
 * 处理特殊字符
 * @param {Object} value
 */
function character(value) {
	if (typeof value === "string") {

		// 替换全部空格，使JSON编译后的字符串在前端和后端保持一致
		value = value.replace(/%20/g, '+')
	}
	return value
}

/**
 * 格式化时间（yyyy-mm-dd hh:ii:ss）
 * @param {Object} time
 */
function formatTime(time) {
	const year = time.getFullYear()
	const month = time.getMonth() + 1
	const day = time.getDate()
	const hour = time.getHours()
	const minute = time.getMinutes()
	const second = time.getSeconds()

	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * @param {Object} n
 */
function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

module.exports = {
	request: request,
	promise: promise,
	upload: upload
}
