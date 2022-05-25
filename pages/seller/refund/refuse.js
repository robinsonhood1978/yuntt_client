/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id refuse.js 2019.12.12 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 提交拒绝理由
 * @param {Object} that
 */
function submit(that) {
	server.request('refund/refuse', {
		refund_id: that.refund_id,
		content: that.content
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '提交成功',
				duration: 2000,
				success() {
					setTimeout(function() {
						uni.redirectTo({
							url: '/pages/seller/refund/view?id=' + that.refund_id
						})
					}, 2000)
				}
			})
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

module.exports = {
	submit: submit
}
