/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id guideshopcart.js 2019.10.19 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 添加到购物车
 * @param {Object} that
 * @param {Object} item
 */
function addCart(that, item) {
	let quantity = Number(item.quantity)
	buildQty(that, item, quantity)
}

/**
 * 修改数量
 * @param {Object} that
 * @param {Object} item
 * @param {Object} type
 */
function changeQty(that, item, type) {
	if (type == 'plus') {
		buildQty(that, item, 1)
	} else if (type == 'minus') {
		if (!util.isEmpty(that.cart.list[item.spec_id].quantity) && that.cart.list[item.spec_id].quantity >= 1) {
			buildQty(that, item, -1)
		}
	}
}

/**
 * 绑定数量
 * @param {Object} that
 * @param {Object} item
 * @param {Object} quantity
 */
function buildQty(that, item, quantity) {
	//uni.removeStorageSync('guideshopcart')
	let cart = uni.getStorageSync('guideshopcart') || {
		list: {},
		quantity: {},
		total: 0,
		paymoney: 0
	}

	if (!util.isEmpty(item) && !util.isEmpty(item.spec_id) && !util.isEmpty(item.goods_id)) {
		server.request('goods/read', {
			goods_id: item.goods_id
		}, function(res) {
			if (res.code == 0 && res.data) {

				// 单规格购买数量
				if (util.isEmpty(cart.list[item.spec_id])) {
					that.$set(cart.list, item.spec_id, {
						quantity: 0
					})
				}
				cart.list[item.spec_id].quantity += quantity

				// 以下字段在购物车商品明细用到
				Object.assign(cart.list[item.spec_id], item, {
					quantity: cart.list[item.spec_id].quantity
				})

				// 规格库存判断
				if (cart.list[item.spec_id].quantity > item.stock) {
					uni.showToast({
						title: '库存不足',
						icon: 'none'
					})
					if (quantity > 0) return false // 只允许减库存继续操作
				}

				// 单商品购买数量
				if (util.isEmpty(cart.quantity[item.goods_id])) {
					that.$set(cart.quantity, item.goods_id, 0)
				}
				cart.quantity[item.goods_id] += quantity

				// 购物车中数量
				cart.total += quantity

				// 计算付款金额
				buildMoney(cart)

				// 保存到缓存
				uni.setStorageSync('guideshopcart', cart)
			}
		})
	}
	// 传值给视图
	that.cart = cart
}

/**
 * 计算付款金额
 * @param {Object} cart
 */
function buildMoney(cart) {
	let paymoney = 0
	for (let index in cart.list) {
		let item = cart.list[index]
		if (item.quantity > 0) {
			let price = util.isEmpty(item.promotion) ? item.price : item.promotion.price
			paymoney += parseFloat(price * item.quantity)
		} else {
			// 该操作微信小程序不影响，APP中会导致删除购物车列表中后面的商品后无法删除前面的商品
			// #ifdef MP
			delete(cart.list[index]) 
			// #endif
		}
	}
	cart.paymoney = (paymoney <= 0) ? 0 : paymoney
}

/**
 * 提交订单
 * @param {Object} that
 */
function submit(that) {
	if (that.cart.total <= 0) {
		uni.showToast({
			title: '您还没有选择商品哦',
			icon: 'none'
		})
		return false
	}

	let specs = []
	for (let index in that.cart.list) {
		let item = that.cart.list[index]
		if (item.quantity > 0) {
			specs.push({
				spec_id: index,
				quantity: item.quantity
			})
		}
	}

	let guideshopid = uni.getStorageSync('guideshopid') || 0
	uni.navigateTo({
		url: '/pages/order/normal?otype=guidebuy&specs=' + JSON.stringify(specs) + '&shopid=' + guideshopid
	})
}

module.exports = {
	addCart: addCart,
	changeQty: changeQty,
	buildQty: buildQty,
	buildMoney: buildMoney,
	submit: submit
}
