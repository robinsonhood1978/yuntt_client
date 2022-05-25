/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id coupon.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 获取优惠券列表
 * @param {Object} that
 */
function coupons(that) {
	server.request('coupon/list', {
		store_id: that.store_id
	}, function(res) {
		if (res.code == 0) {
			that.coupons = res.data.list
		}
	})
}

/**
 * 点击领取优惠券
 * @param {Object} that
 * @param {Object} coupon
 */
function receive(that, coupon) {
	server.request('coupon/receive', {
		coupon_id: coupon.coupon_id
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: "领取成功"
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	}, false)
}

module.exports = {
	coupons: coupons,
	receive: receive
}
