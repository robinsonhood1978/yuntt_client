/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id setting.js 2019.10.29 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 读取门店信息
 * @param {Object} that
 */
function guideshop(that) {
	server.request('guideshop/read', null, function(res) {
		if (res.code == 0) {
			if (res.data) {
				that.guideshop = res.data
			} else {
				uni.redirectTo({
					url: '/pages/guider/shop/apply'
				})
			}
		}
	})
}

function submit(that, param) {
	server.request('guideshop/update', param, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '修改成功'
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
 * 上传门店招牌
 * @param {Object} that
 */
function upload(that, field) {
	uni.chooseImage({
		count: 1,
		sizeType: [ /*'original', */ 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		success(res) {
			server.upload(res.tempFilePaths[0], {
				fileVal: field,
				belong: 61,
				filename: field
			}, function(res) {
				if (res.code == 0) {
					that.guideshop[field] = res.data.fileUrl
					that.random = new Date().getTime()
					server.request('guideshop/update', {
						[field]: res.data.fileUrl
					}, function(res) {
						if (res.code == 0) {
							uni.showToast({
								title: '上传成功'
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: "none"
							})
						}
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			})
		}
	})
}

module.exports = {
	guideshop: guideshop,
	submit: submit,
	upload: upload
}
