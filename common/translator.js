/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id translator.js 2019.10.21 $
 * @author winder
 */

import util from './util.js'

/**
 * 格式化订单/交易状态
 * @param {Object} value
 * @param {Object} type
 * 
 */
function translator(value, type = 'order') {
	let array = {}
	if (type == 'trade') {
		array = {
			'PENDING': '等待买家付款',
			'ACCEPTED': '等待卖家发货',
			'SUBMITTED': '等待卖家发货', // 针对付到付款
			'SHIPPED': '卖家已发货',
			'CLOSED': '交易关闭',
			'SUCCESS': '交易完成',
			'WAIT_ADMIN_VERIFY': '等待系统审核'
		}
	} else if (type == 'refund') {
		array = {
			'CLOSED': '退款关闭',
			'SUCCESS': '退款成功',
			'SELLER_REFUSE_BUYER': '卖家拒绝退款，等待买家修改中',
			'WAIT_SELLER_AGREE': '买家申请退款，等待卖家同意',
			'WAIT_SELLER_CONFIRM': '退款申请等待卖家确认中'
		}
	} else {
		array = {
			 0: "交易关闭",
			11: "等待买家付款",
			19: "待成团",
			20: "等待卖家发货",
			30: "卖家已发货",
			35: "待配送",
			36: "待取货",
			40: "交易完成"
		}
	}
	if (array[value]) {
		return array[value]
	}
	return value
}

function url(value) {
	return util.formatUrl(value)
}

module.exports = {
	translator: translator,
	url: url
}
