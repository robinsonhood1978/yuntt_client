/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id build.js 2019.10.12 $
 * @author winder
 */

import server from '@/common/server.js'

function submit(that, password) {
	server.request('bank/add', Object.assign(that.bank, {
		password: password
	}), function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '添加成功',
				success() {
					uni.navigateBack()
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

module.exports = {
	submit: submit
}
