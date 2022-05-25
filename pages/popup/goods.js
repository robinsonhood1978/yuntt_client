/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id goods.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 查询商品列表
 * @param {Object} that
 * @param {Object} page
 */
function gallery(that, page) {
	let visitor = uni.getStorageSync('visitor') || {}
	that.loadMore.status = "loading"
	server.request('goods/list', {
		store_id: visitor.userid,
		page: page
	}, function(res) {
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
	showLoadMore: showLoadMore
}
