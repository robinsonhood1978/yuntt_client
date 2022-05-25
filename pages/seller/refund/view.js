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
 * 卖家同意退款
 * @param {Object} that
 */
function agree(that) {
	uni.showModal({
		content: '点击【同意退款】，相关货款将退还给买家，是否继续？',
		success(res) {
			if (res.confirm) {
				server.request('refund/agree', {
					refund_id: that.refund.refund_id
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: '退款已达成',
							icon: 'none',
							duration: 2000,
							success() {
								refund(that)
							}
						})
					}
				})
			}
		}
	})
}

/**
 * 卖家拒绝退款
 * @param {Object} that
 */
function refuse(that) {
	uni.showModal({
		content: '您确定要拒绝买家退款吗？',
		success(res) {
			if (res.confirm) {
				server.request('refund/refuse', {
					refund_id: that.refund.refund_id
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: '退款已拒绝',
							icon: 'none'
						})
					}
				})
			}
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
	agree: agree,
	refuse: refuse
}
