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
 * 获取团长订单管理列表
 * @param {Object} that
 * @param {Object} page
 */

function orders(that, page) {
	that.loadMore.status = 'loading'
	server.request('guider/order/list', {
		page: page,
		type: that.orders.selected,
		queryitem: true
	}, function(res) {
		let list = (res.code == 0) ? res.data.list : []
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
 * 团长通知取货
 * @param {Object} that
 * @param {Object} order
 */
function delivered(that, order) {
	uni.showModal({
		title: '提示',
		content: '该操作将通知买家前来取货，如已备好货请点击继续',
		confirmText: '继续',
		success(res) {
			if (res.confirm) {
				server.request('guider/order/update', {
					order_id: order.order_id,
					status: 36
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: '已通知取货',
							success() {
								order.status = 36
								that.$forceUpdate()
							}
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				}, false)
			}
		}
	})
}

/**
 * 获取切换卡
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"all": "全部",
		"pending": "待付款",
		"picking": "待配送",
		"delivered": "待取货",
		"canceled": "已取消"
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
	delivered: delivered
}
