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
		querydesc: true,
		if_show: 1
	}, function(res) {
		if (res.code == 0) {
			if (res.data) {
				that.goods = res.data
				that.cart.spec_id = that.goods.default_spec
				if (that.goods.spec_qty == 0) {
					that.cart.selected = that.cart.spec_id
				}

				// 社区团购 (跳转)
				guidebuy(that)

				// 拼团信息
				teambuy(that)

				// 搭配购信息
				mealbuy(that)

				// 批量下单
				batchbuy(that)

				// 获取商品价格信息（含促销信息）
				queryprice(that, that.cart, false)

				// 获取店铺信息
				store(that, that.goods.store_id)

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
							url: '/pages/index/index'
						})
					}
				})
			}
		}
	})
}

/**
 * 读取店铺数据
 * @param {Object} that
 * @param {Object} store_id
 */
function store(that, store_id) {
	server.request('store/read', {
		store_id: store_id
	}, function(res) {
		if (res.code == 0) {
			if (res.data) {
				that.store = res.data

				//  读取店铺动态评分
				server.request('store/dynamiceval', {
					store_id: store_id
				}, function(res) {
					if (res.code == 0) {
						that.store.dynamiceval = res.data
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
			that.specs.spec_2 = uniqueSpecs(res.data.list, 'spec_2')

			// 全量规格数组
			that.specs.list = {}
			res.data.list.forEach(function(item) {
				that.specs.list[item.spec_id] = item
			})

			for (let index in that.specs.list) {
				let item = that.specs.list[index]
				if (item.stock > 0) {
					that.cart.stock = item.stock
					changeSpec(that, item, 'spec_1', 'spec_2')
					break
				}
			}
		}
	})
}

/**
 * 切换规格后
 * @param {Object} that
 * @param {Object} current
 * @param {Object} field
 * @param {Object} thefield
 */
function changeSpec(that, current, field, thefield) {

	// 将当前点击的规格设置为选中
	that.specs.selected[field] = current[field]

	// 不可用的规格暂存数组
	that.specs.disabled = {}
	that.specs.destroy = {}

	// 如果只有一个规格
	if (!current[thefield]) {
		for (let index in that.specs[field]) {
			let item = that.specs[field][index]
			if (item.stock == 0) {
				that.specs.disabled[item[field]] = true
			}
		}
		queryprice(that, current, true)
	}
	//  如果有二个规格
	else {

		// 根据一个规格，筛选另外一个规格的属性列表
		let object = {}
		for (let index in that.specs.list) {
			let item = that.specs.list[index]
			if (item[field] == current[field]) {
				object[item[thefield]] = item
			}
		}

		// 把不可用的第二规格做处理
		for (let index in that.specs[thefield]) {
			let item = that.specs[thefield][index]
			if (!object[item[thefield]] || object[item[thefield]].stock < 1) {
				that.specs.disabled[item[thefield]] = true
				that.specs.destroy[item[thefield]] = !object[item[thefield]] ? true : false

				// 如果上次选中的规格属于不可用的，则删除已选中
				if (item[thefield] == that.specs.selected[thefield]) {
					delete(that.specs.selected[thefield])
					that.cart.selected = 0
				}
			}
		}

		for (let index in that.specs.list) {
			let item = that.specs.list[index]
			if (that.specs.selected[field] == item[field] && that.specs.selected[thefield] == item[thefield]) {
				queryprice(that, item, true)
				break
			}
		}
	}
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
			if (!util.isEmpty(that.teambuy.specs) && !util.isEmpty(that.teambuy.specs[item.spec_id])) {
				that.teambuy = Object.assign(that.teambuy, {
					spec_id: item.spec_id,
					price: that.teambuy.specs[item.spec_id].price
				})
			}
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
 * 获取默认地址运费
 * @param {Object} that
 */
function delivery(that) {
	server.request('address/list', {
		page_size: 50
	}, function(res) {
		if (res.code == 0) {
			// 所有收货地址
			that.delivery.addresses = res.data.list || []

			// 第一个收货地址一般为默认地址
			that.delivery.shipping = res.data.list.length > 0 ? res.data.list[0] : {}
		}

		// 读取运费
		logistics(that, that.delivery.shipping)
	})
}

/**
 * 读取指定地址运费
 * @param {Object} that
 * @param {Object} address
 */
function logistics(that, address) {
	server.request('goods/logistics', {
		goods_id: that.id,
		city_id: util.isEmpty(address) ? 0 : address.region_id
	}, function(res) {
		if (res.code == 0) {
			let item = res.data.list[0]
			that.delivery.name = item.name
			that.delivery.freight = item.start_fees
			that.delivery.shipping = address || {}
		}
	})
}

/**
 * 修改购买数量
 * @param {Object} that
 * @param {Object} value
 * @param {Object} type
 */
function changeQty(that, value, type) {
	let quantity = that.cart.quantity
	if (type == 'plus') {
		that.cart.quantity++
	} else if (type == 'minus') {
		if (that.cart.quantity > 1) {
			that.cart.quantity--
		} else that.cart.quantity = 1
	} else {
		let value = Number(value)
		if (value > 0) {
			that.cart.quantity = value
		} else {
			that.cart.quantity = 1
		}
	}
	if (that.cart.stock < that.cart.quantity) {
		if (type != 'minus') { // 只允许减库存操作
			that.cart.quantity = quantity
		}
	}
}

/**
 * 加入购物车
 * @param {Object} that
 * @param {Object} selected
 */
function addCart(that, selected) {
	server.request('cart/add', {
		spec_id: that.cart.selected,
		quantity: that.cart.quantity ? that.cart.quantity : 1,
		selected: selected ? 1 : 0
	}, function(res) {
		if (res.code == 0) {
			// 关闭弹窗
			that.$refs['specs'].close()
			if (selected) {
				uni.navigateTo({
					url: '/pages/order/normal'
				})
			} else {
				uni.showToast({
					title: "已加入购物车"
				})
			}
		} else if (res.code == 4004) {
			uni.navigateTo({
				url: "/pages/login/login?redirect=yes",
				animationType: 'slide-in-bottom',
				animationDuration: 300
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
 * 收藏/移除商品
 * @param {Object} that
 * @param {Object} remove
 */
function collect(that, remove) {
	server.request('goods/collect', {
		goods_id: that.id,
		remove: remove
	}, function(res) {
		if (res.code == 0) {
			that.goods.becollected = remove ? 0 : 1
			uni.showToast({
				title: remove ? "已取消收藏" : "收藏成功"
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
	let path = '/pages/goods/index?id=' + that.goods.goods_id
	if (that.buytype == 'team') {
		path = path.replace('index', 'team'); // 分享到拼团页
	}

	return {
		title: that.goods.goods_name,
		imageUrl: that.goods.default_image, // APP、小程序分享显示的图片
		summary: that.goods.goods_name, //  针对APP
		desc: that.goods.goods_name, // 针对小程序
		path: path,
		poster: { // 针对海报
			route: 'goods/qrcode', // 生成海报的后端
			params: {
				goods_id: that.goods.goods_id
			}
		}
	}
}

//==================================以下为该商品相关营销策略控制===============================//

/**
 * 查询该商品是否参与拼团活动
 * @param {Object} that
 */
function teambuy(that) {
	server.request('teambuy/read', {
		spec_id: that.goods.default_spec,
		status: 1
	}, function(res) {
		if (res.code == 0) {
			that.teambuy = Object.assign(that.teambuy, res.data);
		} else {
			// 如果商品没有参与拼团活动，则跳转到商品页
			if (that.buytype == 'team') {
				uni.redirectTo({
					url: '/pages/goods/index?id=' + that.id
				})
			}
		}
	})
}

/**
 * 获取该商品的未成团的拼单记录
 * @param {Object} that
 */
function teambuylogs(that) {
	server.request('teambuy/logs', {
		goods_id: that.id,
		ispayed: 1,
		status: 0 // 未成团
	}, function(res) {
		if (res.code == 0) {
			that.teambuylogs.list = res.data.list
			that.teambuylogs.total = res.data.pagination.total
		}
	})
}

/**
 * 购买拼团商品
 * @param {Object} that
 */
function addTeambuy(that) {
	if (!that.cart.selected) {
		uni.showToast({
			title: '请选择规格',
			icon: "none"
		})
	} else {
		// 关闭弹窗
		that.$refs['specs'].close()
		uni.navigateTo({
			url: '/pages/order/normal?otype=teambuy&spec_id=' + that.cart.selected + '&quantity=' + that.cart
				.quantity + '&teamid=' + that.teambuy.teamid
		})
	}
}

/**
 * 查询该商品是否参与搭配购活动
 * @param {Object} that
 */
function mealbuy(that) {
	server.request('meal/list', {
		goods_id: that.id,
		queryitem: false
	}, function(res) {
		if (res.code == 0) {
			let list = res.data.list
			for (let index in list) {
				if (list[index].status) {
					that.mealbuy = list[index]
					break
				}
			}
		}
	})
}

/**
 * 查询商品是否支持批发下单（阶梯价）
 * @param {Object} that
 */
function batchbuy(that) {
	server.request('wholesale/price', {
		goods_id: that.id
	}, function(res) {
		if (res.code == 0) {
			if (res.data && res.data.list && res.data.list.length > 0) {
				that.batchbuy.list = res.data.list
			}
		}
	})
}

/**
 * 查询该商品是否社区团购商品，如是重定向到社区团购购买页
 * @param {Object} that
 */
function guidebuy(that) {
	server.request('guideshop/category', null, function(res) {
		let gcategory = res.data.list || []
		if (util.inArray(that.goods.cate_id, gcategory)) {
			uni.redirectTo({
				url: '/pages/community/goods/index?id=' + that.goods.goods_id
			})
		}
	})
}

module.exports = {
	swiper: swiper,
	detail: detail,
	specs: specs,
	changeSpec: changeSpec,
	changeQty: changeQty,
	addCart: addCart,
	transparent: transparent,
	collect: collect,
	favorite: favorite,
	attributes: attributes,
	delivery: delivery,
	logistics: logistics,
	recommend: recommend,
	historys: historys,
	shareBody: shareBody,
	teambuy: teambuy,
	teambuylogs: teambuylogs,
	addTeambuy: addTeambuy
}
