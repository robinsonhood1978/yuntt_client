/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id profile.js 2019.10.30 $
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
			let visitor = uni.getStorageSync('visitor') || {}
			that.visitor = Object.assign(visitor, res.data)
		}
	})
}

/**
 * 修改个人信息字段
 * @param {Object} that
 */
function profile(that) {
	let value = that.visitor[that.field]
	if (util.isEmpty(value)) {
		uni.showToast({
			title: '字段不能为空',
			icon: "none"
		})
	} else {
		server.request('user/update', {
			[that.field]: value
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
}

module.exports = {
	user: user,
	profile: profile
}
