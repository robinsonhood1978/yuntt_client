/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id drawal.js 2019.11.4 $
 * @author winder
 */

import server from '@/common/server.js'

/** 
 * 获取账户信息
 * @param {Object} that
 */
function deposit(that) {
	server.request('deposit/read', null, function(res) {
		if (res.code == 0) {
			that.deposit = res.data
		}
	})
}

/**
 * 获取提现银行卡列表
 * @param {Object} that
 */
function banks(that) {
	server.request('bank/list', null, function(res) {
		if (res.code == 0) {
			let list = res.data.list
			if (list.length > 0) {
				that.bank = list[0]
			}
			that.banks = list
		}
	})
}

/**
 * 提交提现申请
 * @param {Object} that
 * @param {Object} password
 */
function submit(that, password) {
	server.request('deposit/drawal', {
		money: that.money,
		bid: that.bank.bid,
		password: password
	}, function(res) {
		if (res.code == 0) {
			uni.showModal({
				title: '提现申请提交成功',
				content: '平台审核通过后，将在24小时内将提现金额打入到您指定的账户中，请耐心等待！',
				showCancel: false,
				success() {
					uni.navigateTo({
						url: '/pages/deposit/index/index'
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

module.exports = {
	deposit: deposit,
	banks: banks,
	submit: submit
}
