/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id view.js 2020.12.9 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 读取退款信息
 * @param {Object} that
 */
function refund(that) {
	server.request('refund/read', {
		refund_id: that.refund_id
	}, function(res) {
		if (res.code == 0) {
			that.refund = res.data
			that.refund.shipped = shipped(that.refund.shipped)
		}
	})
}

/**
 * 取消退款
 * @param {Object} that
 */
function cancel(that) {
	uni.showModal({
		content: '您确定要取消退款吗？',
		success(res) {
			if (res.confirm) {
				server.request('refund/cancel', {
					refund_id: that.refund.refund_id
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: '退款已取消',
							icon: 'none',
							duration: 2000,
							complete() {
								setTimeout(function() {
									uni.redirectTo({
										url: '/pages/my/order/list'
									})
								}, 2000)
							}
						})
					}
				})
			}
		}
	})
}

/**
 * 买家申请平台客户介入处理退款争议
 * @param {Object} that
 */
function intervene(that) {
	server.request('refund/intervene', {
		refund_id: that.refund_id
	}, function(res) {
		console.log(res)
		if (res.code == 0) {
			uni.showModal({
				content: '平台客服已介入处理',
				showCancel: false,
				success() {
					that.refund.intervene = 1
				}
			})
		} else if (res.message) {
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
		}
	})
}

/**
 * 获取收货情况文本
 * @param {Object} value
 */
function shipped(value) {
	let itemList = ['未收到货，需要退款', '已收到货，不退货只退款', '已收到货，需退货退款']
	return itemList[value]
}

module.exports = {
	refund: refund,
	shipped: shipped,
	cancel: cancel,
	intervene: intervene
}
