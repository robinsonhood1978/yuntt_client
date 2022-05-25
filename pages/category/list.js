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
	let list = uni.getStorageSync('gcategory-list')
	if (list.length > 0) {
		that.gcategory.list = list
		that.selected = list[0].cate_id

		// 读取下级
		children(that, that.selected)
	} else {
		server.request('category/list', {
			parent_id: 0,
			store_id: 0,
			if_show: 1,
			page_size: 100
		}, function(res) {
			if (res.code == 0) {
				let list = res.data.list
				if (list.length > 0) {
					uni.setStorage({
						key: 'gcategory-list',
						data: list
					})
					that.selected = list[0].cate_id
				}
				that.gcategory.list = list

				// 读取下级
				children(that, that.selected)
			}
			that.showend = true
		})
	}
}
/**
 * 获取下级分类
 * @param {Object} that
 * @param {Object} parent_id
 */
function children(that, parent_id) {
	let list = uni.getStorageSync('gcategory-list-' + parent_id)
	if (list.length > 0) {
		that.gcategory.children = list
	} else {
		server.request('category/list', {
			parent_id: parent_id,
			store_id: 0,
			if_show: 1,
			querychild: true,
			page_size: 100
		}, function(res) {
			let list = res.data.list
			if (list.length > 0) {
				that.gcategory.children = list
				uni.setStorage({
					key: 'gcategory-list-' + parent_id,
					data: list
				})
			}
		}, true)
	}
}

module.exports = {
	gcategory: gcategory,
	children: children
}
