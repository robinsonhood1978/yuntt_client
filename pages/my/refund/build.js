/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2019.12.7 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 订单详情
 * @param {Object} that
 */
function order(that) {
	server.request('order/read', {
		order_id: that.order_id
	}, function(res) {
		if (res.code == 0) {
			that.order = res.data
			if (that.order.status >= 20 && that.order.status != 40) {
				// 初始化退款信息
				that.refund.total_fee = that.order.order_amount
				that.refund.refund_total_fee = that.order.order_amount

			} else {
				uni.showModal({
					title: '提示',
					content: '该订单不支持退款',
					showCancel: false,
					complete() {
						uni.navigateBack()
					}
				})
			}
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

/**
 * 退款详情
 * @param {Object} that
 */
function refund(that) {
	server.request('refund/read', {
		refund_id: that.refund.refund_id
	}, function(res) {
		if (res.code == 0) {
			that.refund = res.data
			that.refund.shipped_label = shippedItems(that.refund.shipped)
			server.request('order/read', {
				order_sn: that.refund.order_sn
			}, function(res) {
				if (res.code == 0) {
					that.order = res.data
				}
			})
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

/**
 * 提交退款申请
 * @param {Object} that
 */
function submit(that) {
	server.request(that.order_id ? 'refund/create' : 'refund/update', Object.assign(that.refund, {
		order_id: that.order.order_id
	}), function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: that.order_id ? '退款申请已提交' : '等待卖家处理',
				duration: 2000,
				complete() {
					setTimeout(function() {
						uni.redirectTo({
							url: '/pages/my/refund/view?id=' + res.data.refund_id
						})
					}, 2000)
				}
			})
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

/**
 * 收货情况
 * @param {Object} that
 */
function shippedOptions(that) {
	let itemList = shippedItems()
	uni.showActionSheet({
		itemList: itemList,
		success(res) {
			that.refund.shipped = res.tapIndex
			that.refund.shipped_label = itemList[res.tapIndex]
			that.$forceUpdate()
		}
	})
}

/**
 * 收货情况选项
 * @param {Object} index
 */
function shippedItems(index) {
	// 最多支持6项
	let itemList = ['未收到货，需要退款', '已收到货，不退货只退款', '已收到货，需退货退款']
	if (index >= 0 && index <= 6) {
		return itemList[index]
	}
	return itemList
}

/**
 * 退款原因
 * @param {Object} that
 */
function reasonOptions(that) {
	// 最多支持6项
	let itemList = ['缺货', '未按约定时间发货', '商品有质量问题', '商品错发/漏发', '收到的商品描述不符', '其他']
	uni.showActionSheet({
		itemList: itemList,
		success(res) {
			that.refund.refund_reason = itemList[res.tapIndex]
		}
	})
}

module.exports = {
	order: order,
	refund: refund,
	submit: submit,
	shippedOptions: shippedOptions,
	reasonOptions: reasonOptions
}
