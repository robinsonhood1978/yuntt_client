/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id logistic.js 2019.10.26 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 查询订单物流信息
 * @param {Object} that
 * @param {Object} order_id
 */
function logistic(that, order_id) {
	server.request('order/logistic', {
		order_id: order_id
	}, function(res) {
		if (res.code == 0) {
			that.logistic = res.data || {}
			if (that.logistic.details && that.logistic.details.length > 0) {
				uni.setNavigationBarColor({
					backgroundColor: '#F1F1F1'
				})
			}
		}
	})
}

module.exports = {
	logistic: logistic
}
