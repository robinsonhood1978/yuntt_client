/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'
import moment from '@/common/moment.js'

/**
 * 获取门店资料
 * @param {Object} that
 */
function guideshop(that) {
	server.request('guideshop/read', null, function(res) {
		if (res.code == 0) {
			that.guideshop = res.data || {}
		}
	})
}

/**
 * 获取订单数据
 * @param {Object} that
 */
function orders(that) {
	server.request('guider/order/list', {
		page_size: 1
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.orders = res.data.pagination.total
		}
	})
}

/**
 * 获取收益统计
 * @param {Object} that
 */
function profits(that) {
	server.request('deposit/recordlist', {
		page_size: 100000,
		bizIdentity: 'GUIDE' // 团长分成
	}, function(res) {
		if (res.code == 0 && res.data) {
			for (let index in res.data.list) {
				let item = res.data.list[index]
				that.profits.amount += parseFloat(item.amount)

				// 昨日
				if (moment.getYesterday().starttime <= item.add_time && moment.getYesterday().endtime >= item
					.add_time) {
					that.profits.yesterday += parseFloat(item.amount)
				}
				// 上周
				if (moment.getLastWeekDays().starttime <= item.add_time && moment.getLastWeekDays().endtime >=
					item.add_time) {
					that.profits.lastWeek += parseFloat(item.amount)
				}
				// 本月
				if (moment.getCurrMonthDays().starttime <= item.add_time && moment.getCurrMonthDays().endtime >=
					item.add_time) {
					that.profits.currMonth += parseFloat(item.amount)
				}
			}
			that.profits.total = res.data.pagination.total
		}
	})
}

/**
 * 推广门店
 * 小程序/APP/海报分享中使用的数据
 * @param {Object} that
 */
function shareBody(that) {
	return {
		title: that.guideshop.name,
		imageUrl: that.guideshop.banner, // APP、小程序分享显示的图片
		summary: that.guideshop.address + that.guideshop.name, //  针对APP
		desc: that.guideshop.address + that.guideshop.name, // 针对小程序
		path: '/pages/community/index/index?shopid=' + that.guideshop.id,
		poster: { // 针对海报
			route: 'guideshop/qrcode', // 生成海报的后端
			params: {
				id: that.guideshop.id
			}
		}
	}
}

module.exports = {
	guideshop: guideshop,
	orders: orders,
	profits: profits,
	shareBody: shareBody
}
