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

/**
 * 读取分销信息
 * @param {Object} that
 */
function distribute(that) {
	server.request('distribute/read', {
		goods_id: that.goods_id
	}, function(res) {
		if (res.code == 0) {
			that.distribute = res.data || {}
		}
	})
}

/**
 * 保存分销设置
 * @param {Object} that
 */
function submit(that) {
	server.request('distribute/update', Object.assign(that.distribute, {
		goods_id: that.goods_id
	}), function(res) {
		if (res.code == 0) {
			uni.showToast({
				title:  '保存成功',
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
	distribute: distribute,
	submit: submit
}
