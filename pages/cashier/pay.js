/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id pay.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 获取收银台数据
 * @param {Object} that
 */
function cashier(that) {
	console.log('Robin that', that)
	server.request('cashier/build', {
		bizOrderId: that.bizOrderId,
		bizIdentity: that.bizIdentity
	}, function(res) {
		if (res.code == 0) {
			that.orderInfo = res.data.orderInfo
			console.log(res.data.payments)
			that.payments = availablePayments(res.data.payments)
			that.orderId = res.data.orderId

			// 绑定默认支付方式
			defpayment(that)
		} else {
			uni.showModal({
				title: '提示',
				content: res.message,
				showCancel: false,
				success() {
					uni.redirectTo({
						url: '/pages/my/order/list'
					})
				}
			})
		}
		uni.stopPullDownRefresh()
	})
}

/**
 * 绑定默认支付方式
 * @param {Object} that
 */
function defpayment(that) {
	let payments = Object.values(that.payments)
	for (let index in payments) {
		if (payments[index].selected) {
			that.payment_code = payments[index].code
			break
		}
	}
	if (!that.payment_code) {
		that.payment_code = payments.length > 0 ? payments[0].code : ''
	}
}

/**
 * 获取适合当前终端可用的支付方式
 * @param {Object} payments
 */
function availablePayments(payments) {

	// #ifdef MP-WEIXIN
	delete(payments.wxpay)
	// #endif

	// #ifdef H5
	delete(payments.wxmppay)
	delete(payments.wxapppay)
	delete(payments.alipay_app)
	if (!util.isWechat()) {
		delete(payments.wxh5pay)
	}
	// #endif

	// #ifdef APP-PLUS
	delete(payments.alipay_wap)
	delete(payments.wxh5pay)
	// #endif
	delete(payments.latipay)
	return payments
}

/**
 * 提交支付
 * @param {Object} that
 * @param {Object} password
 */
async function submit(that, password) {
	if (that.payment_code == '') {
		uni.showModal({
			title: '提示',
			content: "请选择付款方式",
			showCancel: false
		})
	} else {

		// 微信小程序支付才需要
		let wxcode = await util.getWxCode()

		server.request('cashier/pay', {
			// #ifdef H5
			callback: getCallback(that.payment_code),
			// #endif
			orderId: that.orderId,
			payment_code: that.payment_code,
			password: password,
			wxcode: wxcode
		}, function(res) {
			if (res.code == 0) {
				if (that.payment_code == 'deposit') {
					if (res.data.payResult) {
						uni.showToast({
							title: '付款成功',
							duration: 1000,
							complete() {
								setTimeout(function() {
									uni.redirectTo({
										url: '/pages/my/order/list'
									})
								}, 1000)
							}
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.errMsg,
							showCancel: false
						})
					}
				}
				// 微信公众号支付/H5支付(跳转)
				else if (util.inArray(that.payment_code, ['wxpay', 'wxh5pay', 'alipay_wap'])) {
					// #ifdef H5
					location.href = res.data.redirect
					// #endif
				} else {
					if (that.payment_code == 'latipay') {
						console.log('latipay')
						let visitor = uni.getStorageSync('visitor') || {}
						if (!visitor.userid) {
							uni.showModal({
								title: '提示',
								content: '请先登录',
								showCancel: false,
								success(res) {
									uni.navigateTo({
										url: "/pages/login/login?redirect=yes",
										animationType: 'slide-in-bottom',
										animationDuration: 300
									})
								}
							})
							return false
						}
						let sdata = {
							userId: visitor.userid,
							orderId: that.orderId,
							bizOrderId: that.bizOrderId
						}
						console.log('Robin sdata:', sdata)
						server.request('article/latipaywechat', sdata, function(resp) {
							console.log('Robin server latipaywechat response:', resp)
							if (resp.code == 0) {
								wx.requestPayment({
									...resp.data.result,
									success: function (res) {
										console.log(res)

										uni.showToast({
											title: '支付成功',
											duration: 1000,
											complete() {
												setTimeout(function() {
													uni.redirectTo({
														url: '/pages/my/order/list'
													})
												}, 1000)
											}
										})
									},
									fail (res) {
										console.log(res)
										// showFail("支付失败，请选择其他途径")
										uni.showToast({
											title: res.message,
											icon: "支付失败，请选择其他途径"
										})
									}
								})
							}
						})
					} else {
						uni.requestPayment({
							provider: util.uniProvider(that.payment_code),
							// #ifdef APP-PLUS
							orderInfo: res.data.orderInfo, // APP端微信(object)、支付宝(string)订单数据
							// #endif

							// #ifdef MP-WEIXIN
							timeStamp: res.data.orderInfo.timeStamp,
							nonceStr: res.data.orderInfo.nonceStr,
							package: res.data.orderInfo.package,
							signType: res.data.orderInfo.signType,
							paySign: res.data.orderInfo.paySign,
							// #endif

							// #ifdef MP-TOUTIAO
							service: 4,
							_debug: 1,
							// #endif

							success: function(res) {
								uni.showToast({
									title: '付款成功',
									duration: 1000,
									complete() {
										setTimeout(function() {
											uni.redirectTo({
												url: '/pages/my/order/list'
											})
										}, 1000)
									}
								})
							},
							fail: function(res) {
								console.log('robin uni fail', res)
								let content = '支付失败'
								if (res.errMsg.indexOf('requestPayment:fail') > -1) {
									content = '您取消了支付'
								}
								uni.showModal({
									title: '提示',
									content: content,
									showCancel: false
								})
							}
						})
					}
				}
			} else {
				uni.showModal({
					title: '提示',
					content: res.message,
					showCancel: false
				})
			}
		})
	}
}

/**
 * 获取微信公众号支付
 * 购物订单/充值订单都会跳转到该页面
 * @param {Object} that
 * @param {Object} params
 */
function wxpaybuild(that, params) {
	server.request('cashier/wxpay', params, function(res) {
		if (res.code == 0) {
			that.orderInfo = res.data.orderInfo
			that.jsApiParameters = res.data.jsApiParameters
		}
	})
}

/**
 * 发起微信公众号支付
 * 购物订单/充值订单都会回调到该页面处理
 * @param {Object} that
 */
function wxpay(that) {
	var wx = require('jweixin-module')
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: that.jsApiParameters.appId, // 必填，公众号的唯一标识
		timestamp: that.jsApiParameters.timeStamp, // 必填，生成签名的时间戳
		nonceStr: that.jsApiParameters.nonceStr, // 必填，生成签名的随机串
		signature: that.jsApiParameters.paySign, // 必填，签名
		jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
	});
	wx.ready(function() {
		wx.chooseWXPay({
			timestamp: that.jsApiParameters
				.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			nonceStr: that.jsApiParameters.nonceStr, // 支付签名随机串，不长于 32 位
			package: that.jsApiParameters.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
			signType: that.jsApiParameters.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
			paySign: that.jsApiParameters.paySign, // 支付签名
			success: function(res) {
				uni.showToast({
					title: that.orderInfo.bizIdentity == 'RECHARGE' ? '充值成功' : '付款成功',
					duration: 1000,
					complete() {
						setTimeout(function() {
							uni.redirectTo({
								url: that.orderInfo.bizIdentity ==
									'RECHARGE' ? '/pages/deposit/trade/trade' :
									'/pages/my/order/list'
							})
						}, 1000)
					}
				})
			}
		})
	})
}

/**
 * 微信公众号支付/h5支付的返回页面
 * @param {Object} payment_code
 */
function getCallback(payment_code) {
	// 微信公众号支付，回调到该页面发起支付请求
	if (payment_code == 'wxpay') {
		return util.H5WEBURL + '/pages/cashier/wxpay'
	}

	// h5支付（包含微信H5支付、支付宝H5支付），直接跳转到支付后的页面
	return util.H5WEBURL + '/pages/my/order/list'
}

module.exports = {
	cashier: cashier,
	submit: submit,
	wxpay: wxpay,
	wxpaybuild: wxpaybuild
}
