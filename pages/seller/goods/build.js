/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id build.js 2020.2.1 $
 * @author mosir
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 获取商品信息（编辑模式下）
 * @param {Object} that
 */
function goods(that) {

	server.request('goods/read', {
		goods_id: that.id,
		querydesc: true
	}, function(res) {
		if (res.code == 0 && res.data) {
			that.goods = res.data

			goodsimages(that)
			descimages(that)
			goodsspecs(that)
			gcategory(that)
			brands(that)
			attrs(that)
			deliverys(that)
		}
	})
}

/**
 * 获取商品主图（编辑模式下）
 * @param {Object} that
 */
function goodsimages(that) {
	server.request('goods/images', {
		goods_id: that.id
	}, function(res) {
		if (res.code == 0 && res.data.list) {
			that.goods.goods_images = []
			for (let index in res.data.list) {
				let item = res.data.list[index]
				that.goods.goods_images.push(item.thumbnail)
			}
			that.$forceUpdate()
		}
	})
}

/**
 *  商品描述图
 * @param {Object} that
 */
function descimages(that) {
	server.request('goods/descimages', {
		goods_id: that.id
	}, function(res) {
		if (res.code == 0 && res.data.list) {
			that.goods.desc_images = res.data.list
			that.$forceUpdate()
		}
	})
}

/**
 * 获取商品规格（编辑模式下）
 * @param {Object} that
 */
function goodsspecs(that) {
	server.request('goods/specs', {
		goods_id: that.id
	}, function(res) {
		if (res.code == 0 && res.data.list) {
			that.attributes.specs = res.data.list
			that.$forceUpdate()
		}
	})
}

/**
 * 获取商品发布类目
 * @param {Object} that
 */
function gcategory(that) {
	server.request('category/list', {
		if_show: 1,
		page_size: 10000
	}, function(res) {
		if (res.code == 0 && res.data.list) {
			let list = []
			for (let index in res.data.list) {
				let item = res.data.list[index]
				list.push({
					value: item.cate_id,
					text: item.cate_name,
					parent_id: item.parent_id
				})
			}
			// 转化为树形结构
			that.gcategory.list = util.translateDataToTree(list)

			// 编辑模式下
			if (!util.isEmpty(that.goods.category)) {
				for (let index in that.goods.category) {
					let item = that.goods.category[index]
					that.gcategory.selected.push(item.cate_id)
				}
			}
		}
	})
}

/**
 * 读取品牌列表
 * @param {Object} that
 */
function brands(that) {
	server.request('brand/list', {
		if_show: 1
	}, function(res) {
		if (res.code == 0 && res.data.list) {
			that.brands.list = res.data.list

			// 编辑模式
			if (that.goods.brand) {
				for (let index in that.brands.list) {
					if (that.brands.list[index].brand_name == that.goods.brand) {
						that.brands.selected = index
					}
				}
			}
		}
	})
}

/**
 * 获取运费模板
 * @param {Object} that
 */
function deliverys(that) {
	let visitor = uni.getStorageSync('visitor') || {}
	server.request('delivery/template', {
		store_id: visitor.userid
	}, function(res) {
		if (res.code == 0 && res.data.list) {
			that.deliverys.list = res.data.list

			if (that.goods.dt_id > 0) {
				for (let index in res.data.list) {
					if (res.data.list[index].template_id == that.goods.dt_id) {
						that.deliverys.selected = index
					}
				}
				//  没找到
				if (that.deliverys.selected == 0) {
					that.goods.dt_id = 0
				}
			}
			that.deliverys.default = that.deliverys.list[that.deliverys.selected].area_fee.express.default_fee
		}
	})
}

/**
 * 保存商品信息
 * @param {Object} that
 */
function submit(that) {

	// 多规格处理
	if (that.goods.spec_qty > 0) {
		buildAttrs(that)
		if (!uniqueAttrs(that)) {
			return false
		}
	}

	// 图片处理空值
	removeEmpty(that)

	server.request(that.goods.goods_id ? 'goods/update' : 'goods/add', that.goods, function(res) {
		if (res.code == 0) {
			uni.showToast({
				title: that.goods.goods_id ? '商品保存成功' : '商品发布成功',
				duration: 3000,
				success() {
					setTimeout(function() {
						uni.redirectTo({
							url: '/pages/seller/goods/list'
						})
					}, 3000)
				}
			})
		} else if (res.message) {
			uni.showModal({
				content: res.message,
				showCancel: false
			})
		}
	})
}

/**
 * 商品规格属性（编辑模式下）
 * @param {Object} that
 */
function attrs(that) {
	if (that.goods.spec_qty > 0) {
		that.attributes.category = [{
			name: that.goods.spec_name_1,
			selected: true
		}];
		if (that.goods.spec_qty > 1) {
			that.attributes.category.push({
				name: that.goods.spec_name_2,
				selected: true
			})
		}
	}
}


/**
 * 处理属性字段问题
 * @param {Object} that
 */
function buildAttrs(that) {
	for (let index in that.attributes.category) {
		let item = that.attributes.category[index]
		that.goods['spec_name_' + (Number(index) + 1)] = item.selected ? item.name : ''
	}

	// 只有一个属性的情况下，填了第二个属性，把第二个换到第一个来
	if (that.goods.spec_name_1 == '' && that.attributes.specs.length < 2) {
		that.goods.spec_name_1 = that.good.spec_name_2
		that.goods.spec_name_2 = ''

		for (let index in that.attributes.specs) {
			let item = that.attributes.specs[index]
			item.spec_1 = item.spec_2
			item.spec_2 = ''
		}
	}
	// 直接提交字段
	that.goods.specs = that.attributes.specs
}

/**
 * 去除重复规格
 * @param {Object} that
 */
function uniqueAttrs(that) {
	let values = []

	// 检测规格是否有重复
	for (let index in that.attributes.specs) {
		let item = that.attributes.specs[index]
		let value = item.spec_1 + item.spec_2
		if (util.inArray(value, values)) {
			uni.showModal({
				content: '规格有重复',
				showCancel: false
			})
			return false
		}
		values.push(value)
	}

	return true
}

/**
 * 空值处理
 * @param {Object} that
 */
function removeEmpty(that) {
	['goods_images', 'desc_images'].forEach(function(field, index) {
		let list = []
		for (let index in that.goods[field]) {
			let item = that.goods[field][index]
			if (item) {
				list.push(item)
			}
		}
		that.goods[field] = list
	})
}

/**
 * 上传商品图(主图或描述图)
 * @param {Object} that
 * @param {Object} field
 * @param {Object} index
 */
function upload(that, field, index) {
	uni.chooseImage({
		count: 1,
		sizeType: [ /*'original', */ 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		success(res) {
			server.upload(res.tempFilePaths[0], {
				fileVal: field,
				belong: 2,
				item_id: that.goods.goods_id,
				mode: 'add',
				thumbnail: field == 'goods_images' ? true : false
			}, function(res) {
				if (res.code == 0) {
					that.goods[field][index] = (field == 'goods_images') ? res.data
						.thumbnail : res.data
						.fileUrl
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

/**
 * 删除图片
 * @param {Object} that
 * @param {Object} file
 */
function delfile(that, file) {
	uni.showModal({
		content: '该图片就永久删除，无法恢复，确定要继续吗？',
		success(res) {
			if (res.confirm) {
				server.request('upload/delete', {
					file: file
				}, function(res) {
					if (res.code == 0) {
						// TODO
					} else if (res.message) {
						uni.showModal({
							content: res.message,
							showCancel: false
						})
					}
				})
			}
		}
	})
}

module.exports = {
	goods: goods,
	goodsimages: goodsimages,
	goodsspecs: goodsspecs,
	gcategory: gcategory,
	deliverys: deliverys,
	brands: brands,
	upload: upload,
	delfile: delfile,
	submit: submit
}
