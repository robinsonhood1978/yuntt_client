/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id build.js 2019.10.19 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'
import selector from '@/common/selector.js'

/**
 * 保存收货地址
 * @param {Object} that
 */
function save(that) {
	server.request(that.addr_id ? 'address/update' : 'address/add', that.address, function(res) {
		if (res.code == 0) {
			let redirect = util.isEmpty(uni.getStorageSync('redirect')) ? '/pages/address/list' : util
				.spliceUrl(uni.getStorageSync('redirect'), {
					addr_id: res.data.addr_id
				})
			uni.showToast({
				title: "地址保存成功",
				success: function() {
					setTimeout(function() {
						uni.redirectTo({
							url: redirect
						})
					}, 2000)
				}
			})
		} else {
			uni.showToast({
				title: res.message,
				icon: "none"
			})
		}
	}, false)
}

/**
 * 三级地区联动
 * @param {Object} that
 * @param {Object} addr_id 编辑地址的ID
 */
async function regions(that, addr_id = 0) {

	let current = null
	let address_type = uni.getStorageSync('address_type') || false
	console.log('addr_id:', addr_id)
	if (addr_id > 0) {
		that.address = await server.promise('address/read', {
			addr_id: addr_id
		})
		if (that.address) {
			current = [that.address.province, that.address.city, that.address.district]
		}
	}
	if(address_type == 0){
		let result = await selector.build(that.multiIndex, current)
		that.address.region_id = result.id
		that.selected = result.label
		that.regions = result.multiList
	}
	else{
		that.address.region_id = 0
	}
}

module.exports = {
	regions: regions,
	save: save
}
