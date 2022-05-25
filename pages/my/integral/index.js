/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.22 $
 * @author winder
 */

import server from '@/common/server.js'

function integral(that) {
	server.request('integral/read', null, function(res) {
		if(res.code == 0) {
			that.integral = res.data
		}
	})
}

/**
 * 领取积分
 * @param {Object} that
 */
function signIntegral(that) {
	server.request('integral/signin', null, function(res) {
		if (res.code == 0) {
			uni.showModal({
				title: '恭喜您',
				content: '获得' + res.data.value + '个积分，记得明天再来哦！',
				showCancel: false
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	})
}

module.exports = {
	integral: integral,
	signIntegral: signIntegral
}