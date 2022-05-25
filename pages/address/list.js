/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2019.10.23 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 查询收货地址列表
 * @param {Object} that
 * @param {Object} page
 */
function address(that, page) {
	that.loadMore.status = "loading"
	server.request('address/list', {
		page: page
	}, function(res) {
		var list = (res.code == 0) ? res.data.list : []
		if (list.length > 0) {
			that.addresses.page =  res.data.pagination.page
		}
		that.addresses.list = page > 1 ? that.addresses.list.concat(list) : list
		that.loadMore.show = (list.length > 0 || page > 1) ? true : false
		that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
	})
}

/**
 * @param {Object} that
 * @param {Object} address
 */
function operate(that, address) {
	uni.showActionSheet({
		itemList: ['修改', '删除'],
		success(res) {
			if (res.tapIndex == 0) {
				uni.navigateTo({
					url: '/pages/address/build?id=' + address.addr_id
				})
			} else {
				drop(that, address)
			}
		}
	})
}

/**
 * 删除收货地址
 * @param {Object} that
 * @param {Object} item
 */
function drop(that, item) {
	server.request('address/delete', {
		addr_id: item.addr_id
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: "删除成功",
				success() {
					address(that, 1)
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
	address: address,
	operate: operate,
	drop: drop,
	showLoadMore: showLoadMore
}
