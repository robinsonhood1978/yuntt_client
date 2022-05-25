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
 * 获取我的订单列表
 * @param {Object} that
 * @param {Object} page
 * @param {Object} orderby
 */
function orders(that, page) {
	that.loadMore.status = 'loading'
	server.request('my/order/list', {
		page: page,
		type: that.orders.selected,
		queryitem: true,
		evaluation_status: that.orders.selected == 'finished' ? 0 : ''
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
 * 取消订单
 * @param {Object} that
 * @param {Object} order
 */
function canceled(that, order) {
	uni.showModal({
		title: "提示",
		content: "您确定要取消该订单吗？",
		success: function(res) {
			if (res.confirm) {
				server.request('order/update', {
					order_id: order.order_id,
					status: 0
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: "订单已关闭",
							success() {
								order.status = 0
								that.$forceUpdate()
							}
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		}
	})
}

/**
 * 确认收货
 * @param {Object} that
 * @param {Object} order_id
 */
function finished(that, order_id) {
	uni.showModal({
		title: "确认收货",
		content: "确认后交易即完成，货款将打给卖家，您要继续吗？",
		success: function(res) {
			if (res.confirm) {
				server.request('order/update', {
					order_id: order_id,
					status: 40
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: "交易成功",
							success() {
								uni.redirectTo({
									url: '/pages/my/order/evaluation?order_id='+order_id
								})
							}
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		}
	})
}

/**
 * 订单切换卡片
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"all": "全部",
		"pending": "待付款",
		"accepted": "待发货",
		"shipped": "待收货",
		"finished": "待评价"
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
	orders: orders,
	showLoadMore: showLoadMore,
	canceled: canceled,
	finished: finished
}
