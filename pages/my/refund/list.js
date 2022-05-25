/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2019.12.8 $
 * @author winder
 */

import server from '@/common/server.js'

function refunds(that, page) {
	that.loadMore.status = 'loading'
	server.request('my/refund/list', {
		status: that.refunds.selected,
		page: page,
		queryitem: true
	}, function(res) {
		var list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			that.refunds.page = res.data.pagination.page
		}
		that.refunds.list = page > 1 ? that.refunds.list.concat(list) : list
		that.loadMore.show = (list.length > 0 || page > 1) ? true : false
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		uni.stopPullDownRefresh()
	}, true)
}

/**
 * 订单切换卡片
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"": "全部",
		"GOING": "退款中",
		"SUCCESS": "退款成功",
		"CLOSED": "退款关闭"
	}
	that.tabbars = array
}

/**
 * 加载更多
 */
function showLoadMore(that) {
	that.loadMore = {
		status: "more",
		show: false,
		contentText: {
			contentdown: "查看更多",
			contentrefresh: "加载中...",
			contentnomore: "—— 没有数据了 ——"
		}
	}
}

module.exports = {
	tabbars: tabbars,
	refunds: refunds,
	showLoadMore: showLoadMore
}
