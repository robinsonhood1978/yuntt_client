/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes.
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 *
 * @Id view.js 2019.10.23 $
 * @author winder
 */

import server from '@/common/server.js'

function order(that) {
	server.request('order/read', {
		order_id: that.order_id
	}, function(res) {
		if (res.code == 0) {
			that.order = res.data
			
			// 获取订单商品
			getItems(that)
		}
	})
}

function getItems(that) {
	server.request('order/goods', {
		order_id: that.order_id
	}, function(res) {
		if (res.code == 0) {
			that.items = res.data.list
		}
	})
}

function shipping(that) {
	server.request('order/extm', {
		order_id: that.order_id
	}, function(res) {
		if (res.code == 0) {
			that.shipping = res.data
		}
	})
}

module.exports = {
	order: order,
	shipping: shipping
}
