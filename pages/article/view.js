/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id view.js 2019.11.20 $
 * @author winder
 */

import server from '@/common/server.js'

function article(that) {
	server.request('article/read', {
		id: that.id
	}, function(res) {
		if (res.code == 0) {
			that.article = res.data
			uni.setNavigationBarTitle({
				title: that.article.title
			})
		}
	})
}

module.exports = {
	article: article
}
