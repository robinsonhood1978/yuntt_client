/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id index.js 2019.10.29 $
 * @author winder
 */

import server from '@/common/server.js'

/**
 * 读取用户信息
 * @param {Object} that
 */
function user(that) {
	server.request('user/read', null, function(res) {
		if (res.code == 0) {
			that.visitor = res.data
			uni.setStorageSync('visitor', that.visitor)
		}
	})
}

/**
 * 修改个人信息
 * @param {Object} that
 * @param {Object} field
 * @param {Object} value
 */
function profile(that, field, value) {
	server.request('user/update', {
		[field]: value
	}, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '修改成功',
				complete() {
					that.visitor[field] = value
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

/**
 * 上传用户头像
 * @param {Object} that
 */
function upload(that, field) {
	uni.chooseImage({
		count: 1,
		sizeType: [ /*'original', */ 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		success(res) {
			server.upload(res.tempFilePaths[0], {
				fileVal: field,
				belong: 50,
				filename: field
			}, function(res) {
				if (res.code == 0) {
					that.visitor[field] = res.data.fileUrl
					that.random = new Date().getTime()
					server.request('user/update', {
						[field]: res.data.fileUrl
					}, function(res) {
						if (res.code == 0) {
							uni.setStorageSync('visitor', that.visitor)
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
 * 清除缓存
 * @desc 如需要删除保存到本地的图片，则参考：https://uniapp.dcloud.io/api/file/file?id=savefile
 * @param {Object} that
 */
function cache(that) {
	uni.getStorageInfo({
		success(res) {
			for (let key in res.keys) {
				if (key != 'visitor' && key != 'access_token') {
					uni.removeStorageSync(key)
				}
			}
			uni.showToast({
				title: '缓存已清除'
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
					url: "/pages/login/login"
				})
			}
		}
	})
}

module.exports = {
	user: user,
	logout: logout,
	profile: profile,
	upload: upload,
	cache: cache
}
