/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2020.2.2 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 获取楼层拖拽式模块
 * @param {Object} that
 */
function floors(that) {
	server.request('template/block', {
		page: 'community'
	}, function(res) {
		if (res.code == 0) {
			that.floors = res.data
		}
	})
}

/**
 * 图片轮播
 * @param {Object} that
 */
function swiper(that) {
	server.request('template/block', {
		page: 'community',
		block: 'df_slide'
	}, function(res) {
		if (res.code == 0) {
			let list = []
			for (let index in res.data.options) {
				list[index] = {
					path: res.data.options[index].ad_image_url,
					url: util.formatUrl(res.data.options[index].ad_link_url)
				}
			}
			that.swiper = {
				"current": 0,
				"mode": "default",
				"list": list
			}
		}
	})
}

/**
 * 获取商品分类导航
 * @param {Object} that
 */
function gcategory(that) {
	let gcategory = uni.getStorageSync('category-community') || []
	if (gcategory.length > 0) {
		that.gcategory = gcategory
	} else {
		server.request('category/list', {
			channel: 'community',
			store_id: 0,
			if_show: 1,
			page_size: 100
		}, function(res) {
			if (res.code == 0) {
				if (res.data.list.length > 0) {
					that.gcategory = res.data.list
					uni.setStorage({
						key: 'category-community',
						data: res.data.list
					})
				}
			}
		})
	}
}

/**
 * 商品列表
 * @param {Object} that
 */
function gallery(that, page) {
	that.loadMore.status = "loading"
	server.request('goods/list', {
			channel: 'community',
			cate_id: that.gallery.cid,
			page: page
		},
		function(res) {
			let list = (res.code == 0) ? res.data.list : []
			if (list.length > 0) {
				// 合并数据
				that.gallery.list = page > 1 ? that.gallery.list.concat(list) : list
				that.gallery.page = res.data.pagination.page
			}
			that.loadMore.show = true
			that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
			uni.stopPullDownRefresh()
		}, that.gallery.cid > 1 ? true : false)
}

/**
 * 限时打折商品
 * @param {Object} that
 */
function limitbuys(that) {
	that.loadMore.status = "loading"
	server.request('limitbuy/list', {
			channel: 'community',
			page_size: 9
		},
		function(res) {
			if (res.code == 0) {
				that.limitbuys = res.data.list
			}
		}
	)
}

/**
 * 选择/切换自提点
 * @param {Object} that
 */
function guideshop(that, redirect = true) {
	let guideshopid = uni.getStorageSync('guideshopid') || 0
	server.request('guideshop/read', {
		id: guideshopid,
		status: 1
	}, function(res) {
		if (res.code == 0) {
			if (res.data) {
				that.guideshop = res.data
				uni.setStorageSync('guideshopid', res.data.id)
			} else if(redirect) {
				uni.redirectTo({
					url: '/pages/guider/shop/list'
				})
			}
		} else if (res.code == 4004 && !guideshopid) {
			uni.showModal({
				content: '请先设置自提点',
				confirmText: '去设置',
				success(res) {
					if (res.confirm) {
						uni.redirectTo({
							url: '/pages/guider/shop/list'
						})
					}
				}
			})
		}
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
	gcategory: gcategory,
	swiper: swiper,
	floors: floors,
	gallery: gallery,
	limitbuys: limitbuys,
	showLoadMore: showLoadMore,
	shareBody: shareBody
}
