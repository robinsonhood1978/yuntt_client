/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id list.js 2020.2.5 $
 * @author mosir
 */

import server from '@/common/server.js'

/**
 * 获取附近门店列表
 * @param {Object} that
 * @param {Object} page
 */
function gallery(that, page) {
	uni.showLoading({
		title: '加载中...'
	})
	uni.getLocation({
		type: 'gcj02',
		success: function(res) {
			that.maps.latitude = res.latitude
			that.maps.longitude = res.longitude

			that.loadMore.status = "loading"
			server.request('guideshop/list', {
				latitude: that.maps.latitude,
				longitude: that.maps.longitude,
				page: page
			}, function(res) {
				if (res.code == 0) {
					let list = (res.code == 0) ? res.data.list : []
					that.gallery.list = that.gallery.list.concat(list)
					that.gallery.page = res.data.pagination.page

					if (that.gallery.list.length > 0) {
						let selected = null
						for (let index in that.gallery.list) {
							let item = that.gallery.list[index]
							if (item.id == that.gallery.selected) {
								selected = item
								break
							}
						}
						markers(that, selected ? selected : that.gallery.list[0])
					}

					that.loadMore.show = true
					that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
					uni.stopPullDownRefresh()
				}
				uni.hideLoading()
			})
		}
	})
}

/**
 * 位置标注
 * @param {Object} item
 * @param {Object} that
 */
function markers(that, item) {
	that.gallery.selected = item.id
	that.maps.latitude = item.latitude
	that.maps.longitude = item.longitude

	that.maps.markers = [{
		id: item.id,
		latitude: item.latitude,
		longitude: item.longitude,
		callout: { // label
			content: item.name,
			color: '#ff6600',
			textAlign: 'center',
			borderWidth: 1,
			borderColor: '#ff6600',
			borderRadius: 3,
			padding: 2,
			bgColor: '#ffffff',
			display: 'ALWAYS'
		},
		iconPath: '/static/images/location.png',
		width: 32,
		height: 44
	}]
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
	gallery: gallery,
	markers: markers,
	showLoadMore: showLoadMore
}
