/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.2 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 首页橱窗商品
 * @param {Object} that
 */
function gallery(that, page, params) {
	that.loadMore.status = "loading"
	server.request('goods/list', Object.assign({
			page: page,
			orderby: that.gallery.selected
		}, params),
		function(res) {
			var list = (res.code == 0) ? res.data.list : []
			if (list.length > 0) {
				that.gallery.page = res.data.pagination.page
			}
			that.gallery.list = page > 1 ? that.gallery.list.concat(list) : list
			that.loadMore.show = (list.length > 0 || page > 1) ? true : false
			that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		})
}

/**
 * 商品切换卡片
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"": "综合",
		"sales|desc": "销量",
		"add_time|desc": "新品",
		"price|desc": "价格",
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
	gallery: gallery,
	tabbars: tabbars,
	showLoadMore: showLoadMore
}
