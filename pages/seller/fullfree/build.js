/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id build.js 2020.2.1 $
 * @author mosir
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 读取满优惠信息
 * @param {Object} that
 */
function fullfree(that) {
	server.request('fullfree/read', null, function(res) {
		if (res.code == 0) {
			that.fullfree = res.data || {}
		}
	})
}

/**
 * 保存满优惠设置
 * @param {Object} that
 */
function submit(that) {
	server.request('fullfree/update', {
		amount: that.fullfree.amount,
		quantity: that.fullfree.quantity,
		status: that.fullfree.status
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '设置成功',
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
	fullfree: fullfree,
	submit: submit
}
