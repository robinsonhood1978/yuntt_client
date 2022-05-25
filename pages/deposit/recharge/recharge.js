/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id recharge.js 2019.11.4 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 提交充值请求
 * @param {Object} that
 */
async function submit(that) {

	// 微信小程序支付才需要
	let wxcode = await util.getWxCode()

	server.request('deposit/recharge', {
		// #ifdef H5
		callback: getCallback(that.payment.code),
		// #endif
		money: that.money,
		payment_code: that.payment.code,
		wxcode: wxcode
	}, function(res) {
		if (res.code == 0) {
			// 微信公众号支付/H5支付(跳转)
			if (util.inArray(that.payment.code, ['wxpay', 'wxh5pay', 'alipay_wap'])) {
				// #ifdef H5
				location.href = res.data.redirect
				// #endif
			} else {
				uni.requestPayment({
					provider: util.uniProvider(that.payment.code),
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

					success: function(res) {
						uni.showToast({
							title: '充值成功',
							duration: 1000,
							complete() {
								setTimeout(function() {
									uni.redirectTo({
										url: '/pages/deposit/trade/trade'
									})
								}, 1000)
							}
						})
					},
					fail: function(res) {
						let content = '充值失败'
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
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
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
	return util.H5WEBURL + '/pages/deposit/trade/trade'
}

/**
 * 获取可用的充值方式
 * @param {Object} that
 */
function getPayments(that) {

	// #ifdef H5
	that.payments = [{
		code: util.isWechat() ? 'wxpay' : 'wxh5pay',
		name: '微信支付'
	}]
	if (!util.isWechat()) {
		that.payments.push({
			code: 'alipay_wap',
			name: '支付宝'
		})
	}
	// #endif

	// #ifdef APP-PLUS
	that.payments = [{
			code: 'wxapppay',
			name: '微信支付'
		},
		{
			code: 'alipay_app',
			name: '支付宝'
		}
	]
	// #endif
	// #ifdef MP-WEIXIN
	that.payments = [{
		code: 'wxmppay',
		name: '微信支付'
	}]
	// #endif

	that.payment = that.payments[0]
}

module.exports = {
	submit: submit,
	getPayments: getPayments
}
