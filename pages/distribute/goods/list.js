/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2020.12.27 $
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
 * 分销商品
 * @param {Object} that
 */
function gallery(that, page) {
	that.loadMore.status = "loading"
	server.request('distribute/list', {
			type: that.gallery.selected,
			keyword: that.gallery.keyword,
			page: page
		},
		function(res) {
			let list = (res.code == 0) ? res.data.list : []
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
 * 设置为我的分销商品
 * @param {Object} that
 * @param {Object} item
 */
function distribute(that, item) {
	server.request('distribute/choice', {
		goods_id: item.goods_id
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '已加入分销'
			})
		} else if (res.message) {
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
		}
	})
}

/**
 * 商品切换卡片
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"going": "分销中",
		"pending": "可分销"
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

/**
 * 推广/分享商品
 * 小程序/APP/海报分享中使用的数据
 * @param {Object} that
 */
function shareBody(that, goods) {
	return {
		title: goods.goods_name,
		imageUrl: goods.default_image, // APP、小程序分享显示的图片
		summary: goods.goods_name, //  针对APP
		desc: goods.goods_name, // 针对小程序
		path: '/pages/goods/index?id=' + goods.goods_id + '&invite=' + goods.inviteCode,
		poster: { // 针对海报
			route: 'goods/qrcode', // 生成海报的后端
			params: {
				goods_id: goods.goods_id
			}
		}
	}
}

module.exports = {
	merchant: merchant,
	tabbars: tabbars,
	gallery: gallery,
	distribute: distribute,
	showLoadMore: showLoadMore,
	shareBody: shareBody
}
