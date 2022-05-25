/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.27 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 读取店铺信息
 * @param {Object} that
 */
function store(that) {
	server.request('store/read', {store_id: that.id}, function(res) {
		if(res.code == 0) {
			that.store = res.data
			uni.setNavigationBarTitle({
				title: that.store.store_name
			})
		}
	})
}

/**
 * 首页橱窗商品
 * @param {Object} that
 */
function gallery(that, page) {
	that.loadMore.status = "loading"
	server.request('goods/list', {
			store_id: that.id,
			page: page,
			orderby: that.gallery.selected
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
		"": "默认",
		"add_time|desc": "新品",
		"sales|desc": "销量",
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
	tabbars: tabbars,
	store: store,
	gallery: gallery,
	showLoadMore: showLoadMore
}
