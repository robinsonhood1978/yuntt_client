/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.9 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 获取购物车商品数据（包括多店铺的）
 * @param {Object} that
 */
function cart(that) {
	server.request('cart/list', null, function(res) {
		if (res.code == 0) {
			that.cart.list = res.data.list
			buildMoney(that)

			// 读取可能喜欢的商品
			if (!res.data.list) {
				recommend(that)
			}
		} else if (res.code == 4004) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	})
}

/**
 * 修改数量（增加/减少/更新）
 * @param {Object} that
 * @param {Object} store_id
 * @param {Object} productid
 * @param {Object} spec_id
 * @param {Object} type
 * @param {Object} value
 */
function change(that, item, type, value) {
	// 保存原来的值
	let quantity = item.quantity

	if (type == 'minus') {
		if (item.quantity <= 1) {
			return false
		}
		item.quantity--
	} else if (type == 'plus') {
		item.quantity++
	} else {
		item.quantity = value >= 1 ? value : 1
	}

	server.request('cart/update', {
		spec_id: item.spec_id,
		quantity: item.quantity
	}, function(res) {
		if (res.code == 0) {

			// 因购买量变化执行阶梯价格
			reBuildByQuantity(that, res.data, item.store_id)
			buildMoney(that)

			uni.showToast({
				title: "数量已修改",
				duration: 1000,
				complete() {
					setTimeout(function() {
						uni.hideToast()
					}, 1000)
				}
			})
		} else {
			if (res.code == 3002) {
				item.quantity = quantity
			}
			uni.showToast({
				title: res.message,
				icon: "none",
				duration: 2000,
				complete() {
					setTimeout(function() {
						uni.hideToast()
					}, 2000)
				}
			})
		}
	}, false)
}

/**
 * 移除某个商品
 * @param {Object} item
 * @param {Object} that
 */
function remove(that, item) {
	server.request('cart/remove', {
		product_id: item.product_id
	}, function(res) {
		if (res.code == 0) {
			delete(that.cart.list[item.store_id].items[item.product_id])

			// 因购买量变化执行阶梯价格
			reBuildByQuantity(that, res.data, item.store_id)
			buildMoney(that)
		}
	})
}

/**
 * 只计算选中的商品金额
 * @param {Object} that
 */
function buildMoney(that) {
	let amount = 0
	let list = that.cart.list
	that.cart.checkall = true // 先设置为选中，后面再调整
	for (let store_id in list) {
		for (let productid in list[store_id].items) {
			if (list[store_id].items[productid].selected == 1) {
				amount += parseFloat(list[store_id].items[productid].subtotal)
			} else {
				// 如果有没选中的，重置全选为未选中
				that.cart.checkall = false
			}
		}
	}
	that.cart.amount = amount
}

/**
 * 设置购物车商品为选中/取消
 * @param {Object} that
 * @param {Object} store_id
 * @param {Object} product_ids
 * @param {Object} selected
 */
function choseitem(that, store_id, product_ids, selected) {
	let items = that.cart.list[store_id].items
	server.request('cart/chose', {
		product_ids: product_ids,
		selected: selected ? 1 : 0
	}, function(res) {

		if (res.code == 0) {
			for (let index in product_ids) {
				items[product_ids[index]].selected = selected ? 1 : 0
			}
			// 因购买量变化执行阶梯价格
			reBuildByQuantity(that, res.data, store_id)
			buildMoney(that)
		}
	})
}

/**
 * 全选/取消购物车商品
 * @param {Object} that
 */
function checkall(that) {
	let product_ids = []
	let list = that.cart.list
	let selected = that.cart.checkall ? 0 : 1

	// 先找出所有购物车商品productid
	for (let store_id in list) {
		for (let product_id in list[store_id].items) {
			product_ids.push(product_id)
		}
	}

	server.request('cart/chose', {
		product_ids: product_ids,
		selected: selected
	}, function(res) {
		if (res.code == 0) {
			for (let store_id in list) {
				for (let productid in list[store_id].items) {
					list[store_id].items[productid].selected = Number(selected)
				}
			}
			// 因购买量变化执行阶梯价格
			reBuildByQuantity(that, res.data)
			buildMoney(that)
		}
	})
}

/**
 * 购物车页推荐商品
 * @param {Object} that
 */
function recommend(that) {
	server.request('goods/list', {
		page_size: 30
	}, function(res) {
		if (res.code == 0) {
			that.recommend = res.data.list
		}
	})
}

/**
 * 阶梯价格，重新赋值由于不同的购买量导致的结算价格变化
 * @param {Object} that
 * @param {Object} list
 * @param {Object} store_id
 */
function reBuildByQuantity(that, list, store_id) {
	if (util.isEmpty(list) || util.isEmpty(list.items)) {
		return false
	}

	for (let index in list.items) {
		if (store_id && list.items[index].store_id != store_id) {
			continue; // 如果传店铺，则不考虑其他店铺，不传说明是全选操作
		}
		Object.assign(that.cart.list[list.items[index].store_id].items[index], list.items[index])
	}
}

module.exports = {
	cart: cart,
	change: change,
	remove: remove,
	choseitem: choseitem,
	checkall: checkall,
	buildMoney: buildMoney
}
