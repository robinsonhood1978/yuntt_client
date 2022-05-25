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

/**
 * 查询分销商信息
 * @param {Object} that
 */
function merchant(that) {
	server.request('distribute/merchant', null, function(res) {
		if (res.code == 0) {
			if (res.data) {
				that.merchant = res.data
				uni.setNavigationBarTitle({
					title: '分销规则'
				})
			}
		}
	})
}

/**
 * 保存分销商信息
 * @param {Object} that
 */
function submit(that) {
	// 邀请分销商
	let invite = uni.getStorageSync('distributeInviteRegisterCode') || ''
	
	server.request('distribute/apply', Object.assign(that.merchant, {
		invite: invite
	}), function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: '申请成功',
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
 * 发展分销商
 * 小程序/APP/海报分享中使用的数据
 * @param {Object} that
 */
function shareBody(that) {
	let summary = '加入我的分销团队，一起轻松赚钱'
	return {
		title: that.merchant.name,
		imageUrl: that.merchant.logo, // APP、小程序分享显示的图片
		summary: summary, //  针对APP
		desc: summary, // 针对小程序
		path: '/pages/distribute/apply/apply?invite=' + that.merchant.inviteCode,
		poster: { // 针对海报
			route: 'distribute/qrcode' // 生成海报的后端
		}
	}
}

module.exports = {
	merchant: merchant,
	submit: submit,
	shareBody: shareBody
}
