/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id goods.js 2019.12.30 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 获取浏览历史商品数据
 * @param {Object} that
 */
function gallery(that) {
	server.request('goods/query', {
			goods_id: (uni.getStorageSync('historys') || []).join(',')
		},
		function(res) {
			if (res.code == 0) {
				let list = res.data ? res.data.list : []
				that.gallery.list = list
			}
		})
}

module.exports = {
	gallery: gallery
}
