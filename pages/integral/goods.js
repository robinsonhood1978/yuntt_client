/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id goods.js 2020.12.27 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 积分商品
 * @param {Object} that
 */
function gallery(that, page) {
	that.loadMore.status = "loading"
	server.request('integral/goods', {
			orderby: that.gallery.selected,
			keyword: that.gallery.keyword,
			page: page
		},
		function(res) {
			var list = (res.code == 0) ? res.data.list : []
			if (list.length > 0) {
				that.gallery.page = res.data.pagination.page
			}
			that.gallery.list = page > 1 ? that.gallery.list.concat(list) : list
			that.loadMore.show = (list.length > 0 || page > 1) ? true : false
			that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		}
	)
}

/**
 * 商品切换卡片
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"": "综合",
		"add_time|desc": "最新",
		"sales|desc": "销量",
		"price|asc": "价格"
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
	gallery: gallery,
	showLoadMore: showLoadMore
}
