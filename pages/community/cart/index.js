/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.9 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 获取自提时间，固定为下单第二天16:00前
 * @param {Object} that
 */
function getPickupTime(that) {
	let day = new Date()
	day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
	that.pickuptime = (day.getMonth() + 1) + "月" + day.getDate() + '日16:00点前可自提'
}

module.exports = {
	getPickupTime: getPickupTime
}
