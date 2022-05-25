/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id apply.js 2020.2.1 $
 * @author mosir
 */

import server from '@/common/server.js'
import util from '@/common/util.js'
import selector from '@/common/selector.js'

/**
 * 保存门店/团长信息
 * @param {Object} that
 */
function submit(that) {
	server.request('guideshop/add', that.guideshop, function(res) {
		if (res.code == 0) {
			util.redirectMessage('success', '申请已提交', res.data.remark)
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
	that.guideshop.region_id = result.id
	that.selected = result.label
	that.regions = result.multiList
}

/**
 * 检测申请状态
 * @param {Object} that
 */
function verifyApply(that) {
	server.request('guideshop/read', null, function(res) {
		if (res.code == 0) {
			that.guideshop = Object.assign(that.guideshop, res.data ? res.data : {})
			if (that.guideshop.status == 0) {
				util.redirectMessage('success', '申请已提交', that.guideshop.remark)
			} else if (that.guideshop.status == 1) {
				// 正常营业中
				uni.redirectTo({
					url: '/pages/guider/index/index'
				})
			} else if (that.guideshop.status == 2) {
				util.redirectMessage('warn', '门店已关闭', that.guideshop.remark)
			}
			// 平台审核不通过，需要修改
			else if (that.guideshop.status == 3) {
				if (that.action != 'modify') {
					util.redirectMessage('warn', '门店审核中', that.guideshop.remark, [{
						title: '修改资料',
						url: '/pages/guider/shop/apply?action=modify'
					}])
				}
			}
			let current = res.data ? [res.data.province, res.data.city, res.data.district] : null
			regions(that, current)
		}
	})
}

/**
 * 上传图片
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
					that.$forceUpdate()
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

function location(that) {
	uni.chooseLocation({
		success(res) {
			uni.showToast({
				title: '已获取位置',
				success() {
					that.guideshop.latitude = res.latitude
					that.guideshop.longitude = res.longitude
					that.$forceUpdate()
				}
			})
		}
	})
}

module.exports = {
	verifyApply: verifyApply,
	regions: regions,
	submit: submit,
	upload: upload,
	location: location
}
