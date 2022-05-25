/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes.
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 *
 * @Id evaluation.js 2019.10.28 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 读取订单商品信息
 * @param {Object} that
 */
function order(that) {
	server.request('order/read', {
		order_id: that.order.order_id
	}, function(res) {
		if (res.code == 0) {
			that.order.evaluation_status = res.data.evaluation_status
			if (that.order.evaluation_status == 0) {
				server.request('order/goods', {
					order_id: that.order.order_id
				}, function(res) {
					if (res.code == 0) {
						that.order.items = res.data.list
						that.order.items.forEach(function(item, index) {
							that.evaluations.goods[item.spec_id] = {
								value: 5,
								comment: ''
							}
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		}
	})
}

/**
 * 提交评价
 * @param {Object} that
 */
function submit(that) {
	server.request('my/order/evaluate', {
		order_id: that.order.order_id,
		evaluations: that.evaluations
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '评价成功！',
				duration: 2000,
				success() {
					setTimeout(function() {
						uni.navigateBack()
					}, 2000)
				}
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	})
}

module.exports = {
	order: order,
	submit: submit
}
