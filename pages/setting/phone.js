/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id phone.js 2019.10.29 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 修改手机号
 * @param {Object} that
 */
function phone(that) {
	server.request('user/phone', {
		phone_mob: that.phone_mob,
		verifycode: that.verifycode
		// #ifdef MP || H5
		,verifycodekey: uni.getStorageSync('smsverifycodekey')
		// #endif
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '修改成功',
				duration: 2000,
				success() {
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
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
 * 发送短信
 * @param {Object} that
 */
function sendcode(that) {
	server.request('sms/send', {
		phone_mob: that.phone_mob,
		purpose: 'verifycode'
	}, function(res) {
		if (res.code == 0) {
			uni.setStorageSync('smsverifycodekey', res.data.codekey)
			uni.showToast({
				title: res.message,
				success() {
					that.seconds = 120
					countDown(that)
				}
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	}, false)
}

/**
 * 倒计时
 * @param {Object} that
 */
function countDown(that) {
	that.sendsms = true
	let timer = setInterval(() => {
		that.seconds--
		if (that.seconds < 0) {
			clearInterval(timer)
			that.sendsms = false
			return
		}
	}, 1000)
}

module.exports = {
	phone: phone,
	sendcode: sendcode
}
