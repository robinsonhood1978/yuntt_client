/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id apply.js 2020.2.1 $
 * @author mosir
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 读取拼团信息
 * @param {Object} that
 */
function teambuy(that) {
	server.request('teambuy/read', {
		id: that.id
	}, function(res) {
		if (res.code == 0) {
			that.teambuy = res.data || {}

			// 先加载拼团后再读商品
			goods(that)
		}
	})
}

/**
 * 获取商品信息
 * @param {Object} that
 */
function goods(that) {
	let gallery = []
	server.request('goods/read', {
		goods_id: that.goods_id
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.goods = res.data
			server.request('goods/specs', {
				goods_id: that.goods_id
			}, function(res) {
				if (res.code == 0) {
					for (let index in res.data.list) {
						let item = res.data.list[index]
						gallery[index] = {
							specification: item.spec_1 + ' ' + item.spec_2,
							price: item.price,
							stock: item.stock,
							image: item.image,
							spec_id: item.spec_id
						}

						//  编辑状态下，数据初始化
						let rules = that.teambuy.specs
						if (!util.isEmpty(rules) && !util.isEmpty(rules[item.spec_id])) {
							gallery[index] = Object.assign(gallery[index], rules[item.spec_id])
						}
					}
					that.gallery.list = gallery
				}
			})
		}
	})
}

/**
 * 保存拼团设置
 * @param {Object} that
 */
function submit(that) {
	if (that.gallery.list.length < 1) {
		uni.showModal({
			content: '请选择商品',
			showCancel: false
		})
		return false
	}

	let rules = {}
	for (let index in that.gallery.list) {
		let item = that.gallery.list[index]
		rules[item.spec_id] = {}
		if (item.discount && Number(item.discount) > 0 && Number(item.discount) < 10) {
			rules[item.spec_id].discount = Number(item.discount)
		} else {
			uni.showModal({
				title: '提示',
				content: '拼团折扣设置不合理，请检查！',
				showCancel: false
			})
			return false
		}
	}
	
	server.request(that.id ? 'teambuy/update' : 'teambuy/add', Object.assign(that.teambuy, {
		specs: rules,
		goods_id: that.goods_id
	}), function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: that.id ? '修改成功' : '创建成功',
				duration: 2000,
				success() {
					setTimeout(function() {
						uni.navigateBack()
					}, 2000)
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

module.exports = {
	teambuy: teambuy,
	goods: goods,
	submit: submit
}
