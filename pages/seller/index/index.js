/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.7 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'
import moment from '@/common/moment.js'

/**
 * 读取店铺信息
 * @param {Object} that
 */
function store(that) {
	let visitor = uni.getStorageSync('visitor') || {}
	server.request('store/read', {
		store_id: visitor.userid
	}, function(res) {
		if (res.code == 0) {
			that.store = res.data
		}
	})
}

/**
 * 获取本期和上期数据
 * @param {Object} that
 */
function sells(that) {

	// 本期数据（这里用月来算，订单量多的，可以用天）
	getsells(that, 'curr', moment.getCurrMonthDays().starttime, moment.getCurrMonthDays().endtime)

	// 上期数据
	getsells(that, 'last', moment.getLastMonthDays().starttime, moment.getLastMonthDays().endtime)

	// 更新时间
	that.sells.time = moment.getMoment().format('MM/DD HH:mm')
}

/**
 * 获取销售数据
 * @param {Object} that
 * @param {Object} field
 * @param {Object} begin
 * @param {Object} end
 */
function getsells(that, field, begin, end) {
	server.request('seller/order/list', {
		begin: begin,
		end: end,
		page_size: 10000
	}, function(res) {
		if (res.code == 0) {
			let list = res.data.list || []
			if (list.length > 0) {
				let money = 0
				let refunds = 0
				for (let index in list) {
					money += Number(list[index].order_amount)

					if (!util.isEmpty(list[index].refund_id)) {
						refunds++
					}
				}
				that.sells[field] = {
					money: money,
					quantity: res.data.pagination.total,
					refunds: refunds
				}
				that.$forceUpdate()
			}
		}
	})
}

/**
 * 获取商品状态数量
 * @param {Object} that
 */
function goodses(that) {
	let visitor = uni.getStorageSync('visitor') || {}

	// 在售中
	server.request('goods/list', {
		store_id: visitor.userid,
		if_show: 1,
		page_size: 1
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.goodses.onsale = res.data.pagination.total
		}
	})

	// 待上架
	server.request('goods/list', {
		store_id: visitor.userid,
		if_show: 0,
		page_size: 1
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.goodses.offshelf = res.data.pagination.total
		}
	})
}

/**
 * 各路订单状态数量统计
 * @param {Object} that
 */
function orders(that) {
	server.request('seller/order/remind', null, function(res) {
		if (res.code == 0) {
			that.orders = res.data
		}
	})
}

module.exports = {
	store: store,
	orders: orders,
	goodses: goodses,
	sells: sells
}
