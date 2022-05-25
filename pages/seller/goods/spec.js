/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id spec.js 2020.12.27 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

function save(that) {

	// 判断属性是否为全空
	let emptyall = true
	for (let index in that.attributes.category) {
		if (that.attributes.category[index].selected) {
			emptyall = false
		}
	}

	if (emptyall && that.attributes.specs.length > 0) {
		uni.showModal({
			content: '至少勾选一个属性',
			showCancel: false
		})
		return false
	}

	// 去掉没有选择的属性的值
	for (let index in that.attributes.specs) {
		let item = that.attributes.specs[index]
		for (let key in that.attributes.category) {
			if (!that.attributes.category[key].selected) {
				item['spec_' + (Number(key) + 1)] = ''
			} else if (util.isEmpty(item['spec_' + (Number(key) + 1)])) {
				uni.showModal({
					content: '属性值不能为空',
					showCancel: false
				})
				return false
			}
		}

		if (util.isEmpty(item.price) || Number(item.pirce) < 0) {
			uni.showModal({
				content: '价格不能为空或非法',
				showCancel: false
			})
			return false
		}
		if (util.isEmpty(item.stock) || Number(item.stock) < 0) {
			uni.showModal({
				content: '库存不能为空或非法',
				showCancel: false
			})
			return false
		}
	}
	return true
}

module.exports = {
	save: save
}
