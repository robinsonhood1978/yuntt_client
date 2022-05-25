/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.7 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * @param {Object} that
 */
function siteinfo(that) {
	server.request('default/siteinfo', null, function(res) {
		if (res.code == 0) {
			that.site = res.data
		}
	})
}

/**
 * 各路订单状态数量统计
 * @param {Object} that
 */
function orders(that) {
	server.request('my/order/remind', null, function(res) {
		if (res.code == 0) {
			that.orders = res.data
		}
	})
}

/**
 * 领取积分
 * @param {Object} that
 */
function signIntegral(that) {
	server.request('integral/signin', null, function(res) {
		if (res.code == 0) {
			uni.showModal({
				title: '恭喜您',
				content: '获得' + res.data.value + '个积分，记得明天再来哦！',
				showCancel: false
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	})
}

/**
 * 查询是否团长身份
 * @param {Object} that
 */
function guider(that) {
	server.request('guideshop/read', null, function(res) {
		if (res.code == 0) {
			that.guider = res.data ? true : false
		}
	})
}

/**
 * 推荐商品
 * @param {Object} that
 */
function recommend(that) {
	server.request('goods/list', {
		page_size: 24
	}, function(res) {
		if (res.code == 0) {
			that.recommend = res.data.list
		}
	})
}

/**
 * 获取收藏数量
 * @param {Object} that
 */
function favorite(that) {
	server.request('favorite/quantity', {
		type: 'goods'
	}, function(res) {
		if (res.code == 0) {
			that.favorite.goods = res.data.quantity
		}
	})
	server.request('favorite/quantity', {
		type: 'store'
	}, function(res) {
		if (res.code == 0) {
			that.favorite.store = res.data.quantity
		}
	})
}

module.exports = {
	siteinfo: siteinfo,
	orders: orders,
	guider: guider,
	favorite: favorite,
	recommend: recommend,
	signIntegral: signIntegral
}
