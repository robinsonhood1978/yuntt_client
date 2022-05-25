/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.2 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 获取楼层拖拽式模块
 * @param {Object} that
 */
function floors(that) {
	server.request('template/block', {
		page: 'index'
	}, function(res) {
		if (res.code == 0) {
			//console.log(res)
			that.floors = res.data
		}
	})
}

/**
 * 首页分享
 * 小程序/APP/海报分享中使用的数据（目前只考虑小程序中原生调用）
 * @param {Object} that
 */
async function shareBody(that) {
	let siteinfo = await server.promise('default/siteinfo')
	return {
		title: siteinfo.site_name,
		imageUrl: siteinfo.logo, // APP、小程序分享显示的图片
		//summary: siteinfo.site_desc, //  针对APP
		desc: siteinfo.site_desc, // 针对小程序
		path: '/pages/index/index'
	}
}

module.exports = {
	floors: floors,
	shareBody: shareBody
}
