/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id build.js 2019.10.29 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

function submit(that) {
	let value = that.store[that.field]
	if (util.isEmpty(value)) {
		uni.showToast({
			title: '字段不能为空',
			icon: "none"
		})
	} else {
		server.request('store/update', {
			[that.field]: value
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
}

module.exports = {
	submit: submit
}
