/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.6 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 图片轮播
 * @param {Object} that
 */
function swiper(that) {
	that.swiper = {
		"current": 0,
		"list": []
	}
	// 从服务器读取商品图片
	server.request('goods/images', {
		goods_id: that.id
	}, function(res) {
		let list = res.data.list || []
		let imgUrls = []
		for (let key in list) {
			imgUrls.push({
				url: list[key].image_url
			})
		}
		that.swiper.list = imgUrls
	})
}

/**
 * 获取商品信息
 * @param {Object} that
 */
function detail(that) {
	server.request('goods/read', {
		goods_id: that.id,
		querydesc: true
	}, function(res) {
		if (res.code == 0) {
			if (res.data) {
				that.goods = res.data
				that.cart.spec_id = that.goods.default_spec
				if (that.goods.spec_qty == 0) {
					that.cart.selected = that.cart.spec_id
				}

				// 获取商品价格信息（含促销信息）
				queryprice(that, that.cart, false)

				// 获取店铺优惠券
				coupons(that, that.goods.store_id)

				// 获取店铺满减活动
				fullprefer(that, that.goods.store_id)

			} else {
				uni.showModal({
					title: '提示',
					content: '商品不存在或已下架',
					showCancel: false,
					complete() {
						uni.switchTab({
							url: '/pages/community/index/index'
						})
					}
				})
			}
		}
	})
}

/**
 * 读取商品规格
 * @param {Object} that
 */
function specs(that) {
	server.request('goods/specs', {
		goods_id: that.id
	}, function(res) {
		if (res.code == 0) {

			// 获取不重复的规格数组
			that.specs.spec_1 = uniqueSpecs(res.data.list, 'spec_1')
			
			// 初始化
			for(let index in that.specs.spec_1) {
				let item = that.specs.spec_1[index]
				if(item.stock > 0) {
					that.specs.selected.spec_1 = index
					break
				}
			}
		}
	})
}

/**
 * 获取不重复的规格数组
 * @param {Object} list
 * @param {Object} field
 */
function uniqueSpecs(list, field) {
	let object = {}
	for (let index in list) {
		let item = list[index]
		if (util.isEmpty(object[item[field]])) {
			object[item[field]] = item
		}
	}
	return object
}

/**
 * 读取价格信息（含促销价格）
 * @param {Object} that
 * @param {Object} item
 * @param {Object} selected 表示已经选好了规格
 */
function queryprice(that, item, selected) {
	server.request('goods/price', {
		spec_id: item.spec_id
	}, function(res) {
		if (res.code == 0) {
			that.promotion = res.data.promotion
			if (that.promotion) {
				that.promotion.rfprice = res.data.price // 原价
				item.rfprice = res.data.price
				item.price = that.promotion.price
			}
		}
		if (selected) {
			item.selected = item.spec_id
		}
		that.cart = Object.assign(that.cart, item)
	})
}

/**
 * 读取商品属性
 * @param {Object} that
 */
function attributes(that) {
	server.request('goods/attributes', {
		goods_id: that.id
	}, function(res) {
		if (res.code == 0) {
			that.attributes = res.data.list || []
		}
	})
}

/**
 * 读取优惠券列表
 * @param {Object} that
 * @param {Object} store_id
 */
function coupons(that, store_id) {
	server.request('coupon/list', {
		store_id: store_id
	}, function(res) {
		if (res.code == 0) {
			that.coupons = res.data.list || []
		}
	})
}

/**
 * 满优惠
 * @param {Object} that
 * @param {Object} store_id
 */
function fullprefer(that, store_id) {
	server.request('store/fullprefer', {
		store_id: store_id
	}, function(res) {
		if (res.code == 0) {
			that.fullprefer = res.data || {}
		}
	})
}

/**
 * 关注店铺
 * @param {Object} that
 */
function favorite(that) {
	server.request('store/collect', {
		store_id: that.store.store_id
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: "关注成功"
			})
		} else {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

/**
 * 推荐商品
 * @param {Object} that
 */
function recommend(that) {
	server.request('goods/list', {
		channel: 'community',
		page_size: 30
	}, function(res) {
		if (res.code == 0) {
			that.recommend = res.data.list || []
		}
	})
}

/**
 * 保存浏览历史商品
 * @param {Object} id
 */
function historys(id) {
	// uni.removeStorageSync('historys')
	let historys = uni.getStorageSync('historys') || []
	if (!util.isEmpty(id)) {
		historys.unshift(id)
		historys = util.unique(historys)
		if (historys.length > 50) {
			historys = historys.slice(0, 50)
		}
		uni.setStorageSync('historys', historys)
	}
}

/**
 * 标题渐变效果
 * @param {Object} that
 * @param {Object} value  距离顶部距离（单位px）
 */
function transparent(that, value) {
	if (value < 0.01) {
		that.transparent = {
			iconColor: "white",
			titleShow: false,
			background: "background-color: rgba(241,241,241, 0)",
			btnBackground: "background-color: rgba(0,0,0, 0.6);"
		}
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle('dark')
		// #endif
	} else if (value < 1) {
		that.transparent = {
			iconColor: "#e8e8e8",
			background: "background-color: rgba(252, 43, 52," + value + ")",
			btnBackground: "background-color: rgba(0,0,0," + value / 10 + ")"
		}
	} else {
		that.transparent = {
			iconColor: "white",
			titleShow: true,
			background: "background-color: rgba(252, 43, 52, 1)",
			btnBackground: "background-color: rgba(0,0,0,0)"
		}
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle('light')
		// #endif
	}
}

/**
 * 推广/分享商品
 * 小程序/APP/海报分享中使用的数据
 * @param {Object} that
 */
function shareBody(that) {
	let guideshopid = uni.getStorageSync('guideshopid') || 0
	return {
		title: that.goods.goods_name,
		imageUrl: that.goods.default_image, // APP、小程序分享显示的图片
		summary: that.goods.goods_name, //  针对APP
		desc: that.goods.goods_name, // 针对小程序
		path: '/pages/community/goods/index?id=' + that.goods.goods_id,
		poster: { // 针对海报
			route: 'goods/qrcode', // 生成海报的后端
			params: {
				goods_id: that.goods.goods_id,
				shopid: guideshopid
			}
		}
	}
}

module.exports = {
	swiper: swiper,
	detail: detail,
	specs: specs,
	transparent: transparent,
	favorite: favorite,
	attributes: attributes,
	recommend: recommend,
	historys: historys,
	shareBody: shareBody
}
