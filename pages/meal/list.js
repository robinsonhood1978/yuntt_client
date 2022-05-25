/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2020.12.27 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 搭配购商品
 * @param {Object} that
 * @param {Object} page
 */
function gallery(that, page) {
	that.loadMore.status = "loading"
	server.request('meal/list', {
			goods_id: that.goods_id,
			orderby: that.gallery.selected,
			keyword: that.gallery.keyword,
			page: page
		},
		function(res) {
			let list = (res.code == 0) ? res.data.list : []
			if (list.length > 0) {
				that.gallery.page = res.data.pagination.page

				// 初始化选中规格
				for (let index in list) {
					let items = list[index].items
					for (let key in items) {
						if (util.isEmpty(that.form.selected[items[key].meal_id])) {
							that.form.selected[items[key].meal_id] = {}
						}
						Object.assign(that.form.selected[items[key].meal_id], {
							[items[key].goods_id]: items[key].spec_id
						})
					}
				}
			}

			that.gallery.list = page > 1 ? that.gallery.list.concat(list) : list
			that.loadMore.show = (list.length > 0 || page > 1) ? true : false
			that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
		}
	)
}

/**
 * 提交订单
 * @param {Object} that
 * @param {Object} id
 */
function submit(that, id) {
	if (util.isEmpty(that.form.selected[id])) {
		uni.showModal({
			content: '请选择规格',
			showCancel: false
		})
		return false
	}
	let specs = []
	for (let index in that.form.selected[id]) {
		specs.push({
			spec_id: that.form.selected[id][index],
			quantity: 1 // 购买数量固定为1
		})
	}

	uni.navigateTo({
		url: '/pages/order/normal?otype=meal&meal_id=' + id + '&specs=' + JSON.stringify(specs)
	})
}

/**
 * 选择规格
 * @param {Object} that
 * @param {Object} selected
 */
function changeSpec(that, selected) {
	let list = that.gallery.list
	for (let index in list) {
		for (let key in list[index].items) {
			let item = list[index].items[key]
			if ((item.meal_id == that.form.meal_id) && (item.goods_id == selected.goods_id)) {
				// 先计算原总价
				list[index].price += (selected.price - item.price)
				// 再付给新的价格
				item.price = selected.price
				item.spec_id = selected.spec_id
				item.specification = (item.spec_name_1 ? item.spec_name_1 + ':' + selected.spec_1 : '') + ' ' + (
					item.spec_name_2 ? item.spec_name_2 + ':' + selected.spec_2 : '')

				if (util.isEmpty(that.form.selected[that.form.meal_id])) {
					that.form.selected[that.form.meal_id] = {}
				}
				Object.assign(that.form.selected[that.form.meal_id], {
					[selected.goods_id]: selected.spec_id
				})
			}
		}
	}
}

/**
 * 商品切换卡片
 * @param {Object} that
 */
function tabbars(that) {
	let array = {
		"": "综合",
		"price|asc": "价格",
		"created|desc": "最新"
	}
	that.tabbars = array
}

/**
 * 加载更多
 */
function showLoadMore(that) {
	that.loadMore = {
		status: "more",
		show: false,
		contentText: {
			contentdown: "查看更多",
			contentrefresh: "加载中...",
			contentnomore: "—— 没有数据了 ——"
		}
	}
}

module.exports = {
	tabbars: tabbars,
	gallery: gallery,
	changeSpec: changeSpec,
	submit: submit,
	showLoadMore: showLoadMore
}
