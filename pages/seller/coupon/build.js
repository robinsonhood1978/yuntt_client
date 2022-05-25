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

/**
 * 获取优惠券信息
 * @param {Object} that
 */
function coupon(that) {
	server.request('coupon/read', {
		coupon_id: that.id
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.coupon = res.data
		}
	})
}

/**
 * 保存优惠券
 * @param {Object} that
 */
function submit(that) {
	server.request(that.id ? 'coupon/update' : 'coupon/add', that.coupon, function(res) {
		console.log(res)
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
	coupon: coupon,
	submit: submit
}
