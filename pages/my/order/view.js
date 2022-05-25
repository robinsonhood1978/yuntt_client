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

			// 获取店铺信息
			store(that)

			// 社区团购订单，读取自提门店信息
			if (that.order.otype == 'guidebuy') {
				guideshop(that)
			}

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

function store(that) {
	server.request('store/read', {
		store_id: that.order.seller_id
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.store = res.data
		}
	})
}

/**
 * 获取自提门店信息
 * @param {Object} that
 */
function guideshop(that) {
	server.request('guideshop/read', {
		ownerid: that.order.guider_id
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.guideshop = res.data
		}
	})
}

function shipping(that) {
	server.request('order/extm', {
		order_id: that.order_id
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.shipping = res.data
		}
	})
}

module.exports = {
	order: order,
	shipping: shipping
}
