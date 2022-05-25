/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id location.js 2020.1.19 $
 * @author winder
 */

import server from '@/common/server.js'
import selector from '@/common/selector.js'

/**
 * 保存店铺地址
 * @param {Object} that
 */
function save(that) {
	server.request('store/update', that.address, function(res) {
		if (res.code == 0) {
			uni.showModal({
				content: '位置设置成功',
				showCancel: false,
				success() {
					uni.navigateBack()
				}
			})
		} else if (res.message) {
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
		}
	})
}

/**
 * 三级地区联动
 * @param {Object} that
 */
async function regions(that, current = null) {
	let result = await selector.build(that.multiIndex, current)
	that.address.region_id = result.id
	that.selected = result.label
	that.regions = result.multiList
}

/**
 * 获取店铺现在的地址数据
 * @param {Object} that
 */
function store(that) {
	let visitor = uni.getStorageSync('visitor') || {}
	server.request('store/read', {
		store_id: visitor.store_id
	}, function(res) {
		if (res.code == 0) {
			that.address = Object.assign(that.address, res.data ? {
				address: res.data.address,
				region_id: res.data.region_id
			} : {})

			let current = res.data ? [res.data.province, res.data.city, res.data.district] : null
			regions(that, current)
		}
	})
}

/**
 * 通过地图店铺地址（该方法兼容性有待优化，暂不启用）
 * @param {Object} that
 */
function unimap(that) {
	// 自动获取当前位置经纬度
	uni.getLocation({
		type: 'gcj02',
		//geocode: true,
		success: function(res) {
			// 不支持qq小程序，字节小程序
			uni.chooseLocation({
				latitude: res.latitude,
				longitude: res.longitude,
				success: function(res) {
					let address = res.address + res.name
					server.request('store/update', {
						latitude: res.latitude,
						longitude: res.longitude,
						address: address
					}, function(res) {
						if (res.code == 0) {
							uni.showToast({
								title: '设置成功',
								complete() {
									that.address.address = address
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
			})
		}
	})
}

module.exports = {
	store: store,
	regions: regions,
	unimap: unimap,
	save: save,
}
