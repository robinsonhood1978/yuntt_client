/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2019.10.12 $
 * @author winder
 */

import server from '@/common/server.js'

function banks(that, page) {
	that.loadMore.status = "loading"
	server.request('bank/list', {
		page: page
	}, function(res) {
		var list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			that.banks.page = res.data.pagination.page
		}
		that.banks.list = page > 1 ? that.banks.list.concat(list) : list
		that.loadMore.show = (list.length > 0 || page > 1) ? true : false
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
	})
}

/**
 * @param {Object} that
 * @param {Object} bank
 */
function operate(that, bank) {
	uni.showActionSheet({
		itemList: ['删除'],
		success(res) {
			uni.showModal({
				title: '提示',
				content: '您确定要删除银行卡吗？',
				success(res) {
					if (res.confirm) {
						drop(that, bank)
					}
				}
			})
		}
	})
}

/**
 * 删除银行卡
 * @param {Object} that
 * @param {Object} item
 */
function drop(that, item) {
	server.request('bank/delete', {
		bid: item.bid
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: "删除成功",
				success() {
					banks(that, 1)
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
	banks: banks,
	operate: operate,
	drop: drop,
	showLoadMore: showLoadMore
}
