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
	server.request('seller/order/list', {
		page: page,
		type: that.orders.selected,
		queryitem: true
	}, function(res) {
		var list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			that.orders.page = res.data.pagination.page
		}
		that.orders.list = page > 1 ? that.orders.list.concat(list) : list
		that.loadMore.show = (list.length > 0 || page > 1) ? true : false
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		uni.stopPullDownRefresh()
	}, page > 1 ? true : false)
}

/**
 * 订单发货
 * @param {Object} that
 * @param {Object} order
 * @param {Object} express_comkey
 * @param {Object} express_no
 */
function shipped(that, order, express_comkey, express_no) {
	server.request('order/update', {
		order_id: order.order_id,
		status: 30,
		express_comkey: express_comkey,
		express_no: express_no
	}, function(res) {
		if (res.code == 0) {
			order.status = 30
			order.express_no = express_no
			that.$forceUpdate()
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	}, false)
}

/**
 * 获取切换卡
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"all": "全部",
		"pending": "待付款",
		"accepted": "待发货",
		"shipped": "待收货",
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
	shipped: shipped
}
