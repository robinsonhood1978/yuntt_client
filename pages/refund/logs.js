/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id logs.js 2019.12.8 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 读取当前退款详情
 * @param {Object} that
 */
function refund(that) {
	server.request('refund/read', {refund_id: that.refund_id}, function(res) {
		if(res.code == 0) {
			that.refund = res.data
		}
	})
}

/**
 * 获取退款协商（留言）记录
 * @param {Object} that
 * @param {Object} page
 */
function gallery(that, page) {
	that.loadMore.status = 'loading'
	server.request('refund/logs', {
		refund_id: that.refund_id,
		page: page
	}, function(res) {
		var list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			that.gallery.page = res.data.pagination.page
		}
		that.gallery.list = page > 1 ? that.gallery.list.concat(list) : list
		that.loadMore.show = (list.length > 0 || page > 1) ? true : false
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		uni.stopPullDownRefresh()
	})
}

/**
 * 提交退款协商（留言）
 * @param {Object} that
 */
function submit(that) {
	server.request('refund/message', {
		refund_id: that.refund_id,
		content: that.content
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '提交成功',
				duration: 2000,
				success() {
					setTimeout(function() {
						gallery(that, 1)
					}, 2000)
				}
			})
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
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

module.exports = {
	refund: refund,
	gallery: gallery,
	submit: submit,
	showLoadMore: showLoadMore
}
