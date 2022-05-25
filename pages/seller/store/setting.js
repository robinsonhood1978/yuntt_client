/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
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
 * 获取店铺信息
 * @param {Object} that
 */
function store(that) {
	let visitor = uni.getStorageSync('visitor') || {}
	server.request('store/read', {
		store_id: visitor.store_id
	}, function(res) {
		if (res.code == 0) {
			that.store = res.data
		}
	})
}

/**
 * 上传店铺LOGO
 * @param {Object} that
 */
function logo(that, field) {
	uni.chooseImage({
		count: 1,
		sizeType: [ /*'original', */ 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		success(res) {
			uni.showToast({
				title: '正在上传中...',
				icon: 'loading'
			})
			server.upload(res.tempFilePaths[0], {
				fileVal: field,
				belong: 30,
				filename: field,
				store_id: that.store.store_id
			}, function(res) {
				if (res.code == 0) {
					let store_logo = res.data.fileUrl
					that.store.store_logo = store_logo
					that.random = new Date().getTime()
					server.request('store/update', {
						store_logo: store_logo
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

/**
 * 退出登录
 * @param {Object} that
 */
function logout(that) {
	uni.showModal({
		title: "提示",
		content: "确定退出登录？",
		success(res) {
			if (res.confirm) {
				uni.removeStorageSync('visitor')
				uni.removeStorageSync('access_token')
				uni.navigateTo({
					url: "/pages/seller/login/login"
				})
			}
		}
	})
}

module.exports = {
	store: store,
	logo: logo,
	logout: logout
}
