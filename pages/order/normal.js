/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id normal.js 2019.10.16 $
 * @author winder
 */

import server from '@/common/server.js'
import currency from '@/common/currency.js'
import util from '@/common/util.js'

/**
 * 获取订单数据
 * 此处完美考虑了 门店自提 和 物流发货 两种模式切换或两种模式共存的 数据兼容处理，但还是建议您：
 * 针对普通订单：只考虑物流发货
 * 针对社区团购订单：只考虑门店自提 免运费
 * @param {Object} that
 */
function order(that) {
	server.request('order/build', that.form, function(res) {
		if (res.code == 0) {
			that.orders = res.data.list
			that.shippings = res.data.shipping_methods
			that.addresses.list = res.data.my_address
			that.guideshop = res.data.my_guideshop

			// 绑定默认收货地址
			defaddress(that)

			// 绑定默认门店自提
			if (that.form.otype == 'guidebuy') {
				defguideshop(that)
			}

			// 绑定默认优惠券
			defcoupon(that)

			// 绑定积分抵扣
			defintegral(that)

			// 计算支付金额
			buildMoney(that)
		} else {
			if (res.code != 4004) { // 4004=未登录，此时页面已经进入登录页
				uni.showModal({
					content: res.message,
					showCancel: false,
					success() {
						uni.redirectTo({
							url: '/pages/my/order/list'
						})
					}
				})
			}
		}
	})
}

/**
 * 绑定默认收货地址
 * 要考虑第一次加载和切换收货地址后加载的情况
 * @param {Object} that
 */
function defaddress(that) {
	if (util.isEmpty(that.addresses.list)) {
		return false
	}

	let address = null
	if (that.form.addr_id) {
		address = that.addresses.list[that.form.addr_id]
	}

	// 如果没有选择收货地址，先取默认收货地址（目前接口返回的地址数据，第一条地址也即默认收货地址）
	if (util.isEmpty(address)) {
		address = Object.values(that.addresses.list)[0]
	}

	Object.assign(that.form, util.isEmpty(address) ? {} : {
		addr_id: address.addr_id,
		region_id: address.region_id
	})

	// 绑定默认配送方式
	defshippings(that, that.form.region_id)
}

/**
 * 绑定默认配送方式
 * @param {Object} that
 * @param {Object} deftoid
 */
function defshippings(that, deftoid) {
	for (let store_id in that.shippings) {
		// eg: https://cn.vuejs.org/v2/guide/reactivity.html#%E5%AF%B9%E4%BA%8E%E6%95%B0%E7%BB%84
		that.$set(that.form.delivery_type, store_id, Object.values(that.shippings[store_id][deftoid])[0].type)
	}
}

/**
 * 切换配送方式
 * @param {Object} that
 * @param {Object} store_id
 */
function delivery(that, store_id) {
	let options = []
	let list = that.shippings[store_id][that.form.region_id]
	for (let index in list) {
		options.push(list[index].name + ' ' + currency(list[index].logistic_fees))
	}

	uni.showActionSheet({
		itemList: options,
		success: function(res) {
			let type = Object.values(list)[res.tapIndex].type
			that.form.delivery_type[store_id] = type
			buildMoney(that)
		}
	})
}

/**
 * 绑定默认优惠券
 * @param {Object} that
 */
function defcoupon(that) {
	that.orders.storeIds.forEach(function(store_id) {
		let list = that.orders.orderList[store_id].coupon_list
		if (!util.isEmpty(list)) {
			that.$set(that.form.coupon_sn, store_id, that.orders.orderList[store_id].coupon_list[0].coupon_sn)
		}
	})

}

/**
 * 切换优惠券
 * @param {Object} that
 * @param {Object} store_id
 */
function coupon(that, store_id) {
	let options = []
	let list = that.orders.orderList[store_id].coupon_list
	for (let index in list) {
		if (index < 5) { // 该组件最多允许6个
			options.push(list[index].coupon_name + ' -' + currency(list[index].coupon_value))
		}
	}
	options.push("不使用优惠券")
	uni.showActionSheet({
		itemList: options,
		success: function(res) {
			that.form.coupon_sn[store_id] = (res.tapIndex == list.length || (res.tapIndex == 5)) ? 0 : list[
				res.tapIndex].coupon_sn
			buildMoney(that)
		}
	})
}

/**
 * 通过优惠券编号获取优惠券金额
 * @param {Object} list
 * @param {Object} coupon_sn
 */
function couponValue(list, coupon_sn) {
	let value = 0
	list.forEach(function(item) {
		if (item.coupon_sn == coupon_sn) {
			value = item.coupon_value
		}
	})
	return value
}

/**
 * 绑定积分抵扣
 * @param {Object} that
 */
function defintegral(that) {
	if (that.orders.allow_integral == 1) {
		let integralExchange = that.orders.integralExchange
		let points = integralExchange.maxPoints > integralExchange.userIntegral ? integralExchange.userIntegral :
			integralExchange.maxPoints
		that.integralExchange.points = points
		that.integralExchange.money = integralExchange.rate * points
		that.form.exchange_integral = points
	}
}
/**
 * 切换积分抵扣
 * @param {Object} that
 */
function integral(that) {
	uni.showActionSheet({
		itemList: ['使用积分抵扣' + currency(that.integralExchange.money) + '元', '不使用积分'],
		success(res) {
			that.form.exchange_integral = res.tapIndex == 0 ? that.integralExchange.points : 0
			buildMoney(that)
		}
	})
}

/**
 * 是否匿名购买
 * @param {Object} that
 * @param {Object} value
 */
function anonymous(that, value) {
	that.orders.storeIds.forEach(function(store_id) {
		that.$set(that.form.anonymous, store_id, value ? 1 : 0)
	})
}

/**
 * 计算支付金额
 * 将所有涉及支付金额变化的放在这里计算并赋值
 * @param {Object} that
 */
function buildMoney(that) {

	let total = 0
	that.orders.storeIds.forEach(function(store_id) {
		// 当前选择的快递方式
		let delivery_type = that.form.delivery_type[store_id] || 'express'

		// 当前收货地址的运费
		let logistic_fees = (util.isEmpty(that.shippings[store_id]) || !that.form.region_id) ? 0 : parseFloat(
			that.shippings[store_id][that.form.region_id][delivery_type].logistic_fees)

		// 当前满减满折优惠
		let fullprefer = util.isEmpty(that.orders.orderList[store_id].fullprefer) ? 0 : parseFloat(that.orders
			.orderList[store_id].fullprefer.price)

		// 当前优惠券优惠
		let coupon_value = util.isEmpty(that.orders.orderList[store_id].coupon_list) ? 0 : parseFloat(
			couponValue(that.orders.orderList[store_id].coupon_list, that.form.coupon_sn[store_id]))

		// 单个店铺实际需要支付的金额
		that.orders.orderList[store_id].paymoney = parseFloat(that.orders.orderList[store_id].amount) +
			logistic_fees -
			fullprefer -
			coupon_value

		// 所有店铺实际需要支付的金额
		total += that.orders.orderList[store_id].paymoney
	})

	// 积分抵扣
	if (that.form.exchange_integral > 0) {
		total -= that.integralExchange.money
	}

	that.orders.paymoney = total
}

/**
 * 提交订单
 * @param {Object} that
 */
function submit(that) {
	if (that.allowsubmit == false) {
		uni.showToast({
			title: "请不要多次提交",
			icon: "none"
		})
		return false
	}
	that.allowsubmit = false

	// 三级分销携带信息
	let invite = uni.getStorageSync('distributeInviteGoodsCode') || ''
	server.request('order/create', Object.assign(that.form, {
		invite: invite
	}), function(res) {
		if (res.code == 0) {

			// 清空社区团购订单购物车商品
			if (that.form.otype == 'guidebuy') {
				uni.removeStorageSync('guideshopcart')
			}
			uni.redirectTo({
				url: '/pages/cashier/pay?bizOrderId=' + res.data.bizOrderId + '&bizIdentity=' + res.data
					.bizIdentity
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
		that.allowsubmit = true
	}, false)
}

/**
 * 初始化门店自提地址
 * @param {Object} that
 */
function defguideshop(that) {

	// 将门店自提地址作为收货地址插入
	if (!util.isEmpty(that.guideshop) && !util.isEmpty(that.guideshop.region_id)) {
		Object.assign(that.form, {
			region_id: that.guideshop.region_id,
			address: that.guideshop.address
		})

		// 绑定提货人信息
		defshipper(that)

		// 绑定默认配送方式
		defshippings(that, that.form.region_id)
	}
}

/**
 * 初始化提货人信息
 * @param {Object} that
 */
function defshipper(that) {
	let shipper = uni.getStorageSync('guideshopshipper') || null
	if (shipper) {
		Object.assign(that.form, shipper)
	} else {
		// 从最近的订单中取出收货人作为提货人
		server.request('my/order/list', {
			page_size: 1
		}, function(res) {
			if (res.code == 0 && res.data) {
				let order_id = res.data.list[0].order_id
				server.request('order/extm', {
					order_id: order_id
				}, function(res) {
					if (res.code == 0 && res.data) {
						let shipper = {
							consignee: res.data.consignee,
							phone_mob: res.data.phone_mob
						}
						// 存到缓存，可避免每次都加载
						uni.setStorageSync('guideshopshipper', shipper)
						Object.assign(that.form, shipper)
					}
				})
			}
		})
	}
}

/**
 * 获取自提时间，固定为下单第二天16:00前
 * @param {Object} that
 */
function getPickupTime(that) {
	let day = new Date()
	day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
	that.pickuptime = (day.getMonth() + 1) + "月" + day.getDate() + '日16:00点前可自提'
}

module.exports = {
	order: order,
	delivery: delivery,
	coupon: coupon,
	integral: integral,
	anonymous: anonymous,
	submit: submit,
	getPickupTime: getPickupTime
}
