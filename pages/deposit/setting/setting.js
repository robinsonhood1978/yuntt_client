/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id setting.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 读取用户信息
 * @param {Object} that
 */
function user(that) {
	server.request('user/read', null, function(res) {
		if (res.code == 0) {
			that.user = res.data

			// 此页面目前主要是修改支付密码的页面，需要验证短信，如果没有绑定手机，先绑定手机
			if (util.isEmpty(that.user.phone_mob)) {
				uni.showModal({
					title: '提示',
					content: '请先绑定手机',
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/setting/phone'
							})
						} else {
							uni.navigateBack()
						}
					}
				})
			}
		}
	})
}

/**
 * 读取资金账户信息
 * @param {Object} that
 */
function deposit(that) {
	server.request('deposit/read', null, function(res) {
		if(res.code == 0) {
			that.deposit = res.data
		}
	})
}

/**
 * 提交修改
 * @param {Object} that
 */
function submit(that) {
	server.request('deposit/update', {
		password: that.password,
		confirmPassword: that.confirmPassword,
		verifycode: that.verifycode,
		pay_status: that.balancepay ? 1 : 0
		// #ifdef MP || H5
		,verifycodekey: uni.getStorageSync('smsverifycodekey')
		// #endif
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '修改成功',
				success() {
					setTimeout(function() {
						uni.navigateBack()
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
		phone_mob: that.user.phone_mob,
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
	user: user,
	deposit:deposit,
	submit: submit,
	sendcode: sendcode,
	countDown: countDown
}
