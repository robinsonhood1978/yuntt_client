/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id login.js 2019.10.9 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 登录注册（其他页面也调用该方法，最好不要用that参数
 * @param {Object} params
 */
function login(params) {
	server.request('auth/login', params, function(res) {
		// console.log('Robin auth login:', res)
		if (res.code == 0 && res.data) {
			let data = res.data

			// 严格验证是商家登录
			if (params.checkseller && !data.user_info.store_id) {
				uni.showModal({
					title: '提示',
					content: '对不起，您还不是卖家',
					showCancel: false
				})
				return false;
			}

			uni.setStorageSync('access_token', data.token)
			uni.setStorageSync('visitor', data.user_info)
			uni.showToast({
				title: "登录成功",
				duration: 500,
				complete() {
					let redirect = uni.getStorageSync('redirect')
					setTimeout(function() {
						if (util.isEmpty(redirect)) {
							uni.switchTab({
								url: '/pages/user/index'
							})
						} else {
							util.redirectUrl(redirect)
						}
					}, 500)
				}
			})
		} else if (res.message) {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	})
}

/**
 * 手机号登录注册
 * @param {Object} that
 * @param {Object} params
 */
function mblogin(that, params) {
	if (that.accord != 1) {
		uni.showModal({
			title: '提示',
			content: '请勾选并同意《用户协议》和《隐私政策》',
			showCancel: false
		})
		return
	}

	// 手机号密码登录
	if (that.logintype == 'password') {
		params.phone_mob = that.phone_mob
		params.password = that.password
	}
	// 手机号验证码登录
	else if (that.logintype == 'verifycode') {
		params.phone_mob = that.phone_mob
		params.verifycode = that.verifycode
		// #ifdef MP || H5
		params.verifycodekey = uni.getStorageSync('smsverifycodekey')
		// #endif
	}
	login(params)
}

/**
 * UniAPP统一登录接口
 * 兼容APP微信登录/QQ登录
 * @param {Object} that
 * @param {Object} params
 */
function unilogin(that, params) {

	// 操作系统版本
	let system = Math.floor(parseFloat(uni.getSystemInfoSync().system))
	if (params.logintype == 'apple' && system < 13) {
		uni.showModal({
			title: '提示',
			content: 'iOS13及以上系统版本才支持苹果登录',
			showCancel: false
		})
		return
	}

	// 调用登录接口
	wx.login({
		success: (res) => {
			let sdata = {
				'code': res.code
			}
			// console.log('Robin code:', res)
			server.request('article/wechatopenid', sdata, function(res) {
				// console.log('Robin server response:', res)
				if (res.code == 0) {
					
				}
			})
		}
	  })

	uni.login({
		provider: params.logintype,
		success: function(res) {
			// #ifdef MP-WEIXIN
			let code = res.code ? res.code : ''
			// #endif
			uni.getUserInfo({
				provider: params.logintype,
				lang: 'zh_CN',
				success(res) {
					// console.log('Robin uni code:', code)
					let userInfo = res.userInfo // 如果授权过，微信小程序也会有值，如果没有授权过，则进入fail
					Object.assign(params, {
						// #ifdef MP-WEIXIN
						code: code, // 微信小程序才有
						scene: 'weixinmp',
						// #endif
						unionid: userInfo.unionId ? userInfo.unionId : (userInfo.openId ?
							userInfo.openId : ''), // APP才有，微信小程序没有
						openid: userInfo.openId ? userInfo.openId : '', // APP才有，微信小程序没有
						portrait: userInfo.avatarUrl,
						nickname: userInfo.fullName ? (userInfo.fullName.familyName + userInfo
							.fullName.givenName) : userInfo.nickName
					})
					// console.log('Robin params:', params)
					login(params)
				},
				fail(res) {
					// 微信没有授权，先跳转去授权
					// #ifdef MP-WEIXIN
					if (params.logintype == 'weixin') {
						uni.navigateTo({
							url: '/pages/login/weixin?code=' + code
						})
						return false
					}
					// #endif
					uni.showModal({
						title: '提示',
						content: res.errMsg,
						showCancel: false
					})
				}
			})
		},
		fail(err) {
			console.log(err)
		}
	})
}


/**
 * 针对微商城/H5的登录
 * @param {Object} that
 * @param {Object} params
 */
function weblogin(that, params) {
	server.request('connect/login', Object.assign(params, {
		callback: util.H5WEBURL + '/pages/login/callback'
	}), function(res) {
		if (res.code == 0 && res.data) {
			location.href = res.data
		}
	})
}

/**
 * 发送短信
 * @param {Object} that
 */
function sendcode(that) {
	server.request('sms/send', {
		phone_mob: that.phone_mob,
		purpose: 'verifycode'
	}, function(res) {
		if (res.code == 0) {
			uni.setStorageSync('smsverifycodekey', res.data.codekey)
			uni.showToast({
				title: res.message,
				success() {
					that.seconds = 120
					countDown(that)
				}
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	}, false)
}

/**
 * 倒计时
 * @param {Object} that
 */
function countDown(that) {
	that.sendsms = true
	let timer = setInterval(() => {
		that.seconds--
		if (that.seconds < 0) {
			clearInterval(timer)
			that.sendsms = false
			return
		}
	}, 1000)
}

module.exports = {
	login: login,
	mblogin: mblogin,
	unilogin: unilogin,
	weblogin: weblogin,
	sendcode: sendcode
}
