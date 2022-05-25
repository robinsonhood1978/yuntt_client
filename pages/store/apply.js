/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id apply.js 2019.10.29 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 提交开店信息
 * @param {Object} that
 */
function submit(that) {
	server.request('store/add', that.store, function(res) {
		if (res.code == 0) {
			let store = res.data
			if (store.state == 1) {
				let visitor = uni.getStorageSync('visitor') || {}
				uni.setStorageSync('visitor', Object.assign(visitor, {
					store_id: store.store_id
				}))
				util.redirectMessage('success', '店铺已开通', '恭喜！您的店铺已开通，您可以到店铺设置继续完善店铺资料', [{
					title: '店铺设置',
					url: '/pages/seller/store/setting'
				}])
			} else {
				util.redirectMessage('success', '店铺申请已提交', store.apply_remark)
			}
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

/**
 * 获取店铺等级列表
 * @param {Object} that
 */
function grades(that) {
	server.request('store/grades', {
		page_size: 6
	}, function(res) {
		if (res.code == 0) {
			that.grades = res.data ? res.data.list : []
			if (that.grades.length > 0) {
				that.store.sgrade = that.grades[0].grade_id
				that.store.grade_name = that.grades[0].grade_name
			}
		}
	})
}

/**
 * 检测是否允许申请开店
 * @param {Object} that
 */
async function verifyJoin(that) {
	let site = await server.promise('default/siteinfo')
	if (!site || !site.store_allow) {
		return util.redirectMessage('warn', '商家入驻', '暂不开放商家入驻')
	}
}

/**
 * 检测店铺状态
 * @param {Object} that
 */
function verifyApply(that) {
	let visitor = uni.getStorageSync('visitor') || {}
	server.request('store/read', {
		store_id: visitor.userid
	}, function(res) {
		if (res.code == 0) {
			let store = res.data

			// 没有在审核的店铺
			if (!store) {
				verifyJoin(that)
			} else {

				// 已经提交开店申请，待审核中
				if (store.state == 0) {
					util.redirectMessage('success', '店铺审核中', store.apply_remark)
				} else if (store.state == 1) {
					let visitor = uni.getStorageSync('visitor') || {}
					uni.setStorageSync('visitor', Object.assign(visitor, {
						store_id: store.store_id
					}))
					util.redirectMessage('success', '店铺已开通', '恭喜！您的店铺已开通，您可以到店铺设置继续完善店铺资料', [{
						title: '店铺设置',
						url: '/pages/seller/store/setting'
					}])
				}
				// 店铺被关闭
				else if (store.state == 2) {
					util.redirectMessage('fail', '店铺状态', store.close_reason)
				}
				// 平台审核不通过，需要修改
				else if (store.state == 3) {
					if (that.mode != 'modify') {
						util.redirectMessage('warn', '店铺审核中', store.apply_remark, [{
							title: '修改资料',
							url: '/pages/store/apply?mode=modify'
						}])
					}
					that.step = 2

					// store字段太多，不要取完
					for (let index in that.store) {
						that.store[index] = store[index]
					}

					// 获取店铺主体信息（隐私数据单独获取）
					privacy(that)

					// 显示选中的店铺等级
					bindGrade(that)
				}
			}
		}
	})
}

function privacy(that) {
	server.request('store/privacy', null, function(res) {
		if (res.code == 0 && res.data) {
			let fields = ['owner_name', 'identity_card', 'identity_front', 'identity_back', 'business_license']
			for (let index in fields) {
				that.store[fields[index]] = res.data[fields[index]]
			}
		}
	})
}

function bindGrade(that) {
	server.request('store/grade', {
		grade_id: that.store.sgrade
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.store.grade_name = res.data.grade_name
			that.$forceUpdate()
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
				belong: 51,
				filename: field
			}, function(res) {
				if (res.code == 0) {
					that.store[field] = res.data.fileUrl
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

module.exports = {
	upload: upload,
	submit: submit,
	verifyApply: verifyApply,
	verifyJoin: verifyJoin,
	grades: grades
}
