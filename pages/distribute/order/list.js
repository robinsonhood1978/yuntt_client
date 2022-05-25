/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes.
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 *
 * @Id list.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 查询分销商信息
 * @param {Object} that
 */
function merchant(that) {
	server.request('distribute/merchant', null, function(res) {
		if (res.code != 0 || !res.data) {
			uni.redirectTo({
				url: '/pages/distribute/apply/apply'
			})
		}
	})
}

/**
 * 获取分销订单列表
 * @param {Object} that
 * @param {Object} page
 */

function orders(that, page) {
	that.loadMore.status = 'loading'
	server.request('distribute/order', {
		page: page,
		queryitem: true
	}, function(res) {
		var list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			that.orders.page = res.data.pagination.page
		}
		that.orders.list = page > 1 ? that.orders.list.concat(list) : list
		that.loadMore.show = (list.length > 0 || page > 1) ? true : false
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		uni.stopPullDownRefresh()
	}, true)
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
	merchant: merchant,
	orders: orders,
	showLoadMore: showLoadMore
}
