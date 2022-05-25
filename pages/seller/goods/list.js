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
 * 商品列表
 * @param {Object} that
 */
function gallery(that, page) {
	let visitor = uni.getStorageSync('visitor') || {}
	that.loadMore.status = "loading"
	server.request('goods/list', Object.assign({
			store_id: visitor.userid,
			keyword: that.gallery.keyword,
			orderby: 'add_time|desc',
			page: page
		}, that.gallery.selected == '' ? {} : {
			if_show: that.gallery.selected == 'going' ? 1 : 0
		}),
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
 * 商品操作
 * @param {Object} that
 * @param {Object} item
 */
function operate(that, item) {
	uni.showActionSheet({
		itemList: ['修改', '删除'],
		success(res) {
			if (res.tapIndex == 0) {
				uni.navigateTo({
					url: '/pages/seller/goods/build?id=' + item.goods_id
				})
			} else {
				uni.showModal({
					title: '提示',
					content: '删除后不可回复，您确定要删除吗？',
					success(res) {
						if (res.confirm) {
							dodel(that, item.goods_id)
						}
					}
				})
			}
		}
	})
}

function dodel(that, id) {
	server.request('goods/delete', {
		goods_id: id
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '删除成功',
				success() {
					gallery(that, 1)
				}
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
		"": '全部',
		"going": "在售中",
		"pending": "待上架"
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
	operate: operate,
	showLoadMore: showLoadMore
}
