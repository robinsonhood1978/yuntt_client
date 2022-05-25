/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2019.10.26 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 获取一级分类
 * @param {Object} that
 */
function gcategory(that) {
	let list = uni.getStorageSync('category-community')
	if (list.length > 0) {
		that.gcategory.list = list
	} else {
		server.request('category/list', {
			channel: 'community',
			store_id: 0,
			if_show: 1,
			page_size: 100
		}, function(res) {
			if (res.code == 0) {
				let list = res.data.list
				if (list.length > 0) {
					uni.setStorage({
						key: 'category-community',
						data: list
					})
				}
				that.gcategory.list = list
			}
		})
	}
}

function gallery(that, page) {
	that.loadMore.status = "loading"
	server.request('goods/list', {
		channel: 'community',
		cate_id: that.gallery.selected,
		page: page
	}, function(res) {
		let list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			// 合并数据
			that.gallery.list = page > 1 ? that.gallery.list.concat(list) : list
			that.gallery.page = res.data.pagination.page
		}
		that.loadMore.show = true
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		uni.stopPullDownRefresh()
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
			contentnomore: "—— 已经到底了 ——"
		}
	}
}

module.exports = {
	gcategory: gcategory,
	gallery: gallery,
	showLoadMore: showLoadMore
}
