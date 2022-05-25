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

function deposit(that) {
	server.request('deposit/read', null, function(res) {
		if(res.code == 0) {
			that.deposit = res.data
		}
	})
}

module.exports = {
	deposit: deposit
}