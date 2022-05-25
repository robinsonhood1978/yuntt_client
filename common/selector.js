/**
 * @link https://www.shopwind.net/
 * @copyright Copyright (c) 2018 ShopWind Inc. All Rights Reserved.
 *
 * This is not free software. Do not use it for commercial purposes. 
 * If you need commercial operation, please contact us to purchase a license.
 * @license https://www.shopwind.net/license/
 * ==========================================================================
 * 
 * @Id selector.js 2019.10.19 $
 * @author winder
 */

import server from '@/common/server.js'
import util from '@/common/util.js'

/**
 * 三级联动组件（理论上兼容任意模型）
 * 返回选中项的ID及名称
 */
async function build(multiIndex, current = null, path = 'region/list', idField = 'region_id', nameField =
	'region_name', parentField = 'parent_id') {

	let firsts = await server.promise(path, {
		[parentField]: 0,
		if_show: 1,
		page_size: 100
	}, null, false)
	if (!util.isEmpty(current)) {
		buildMultiIndex(firsts.list, multiIndex, current[0], nameField, 0)
	}

	let seconds = await server.promise(path, {
		[parentField]: firsts.list[multiIndex[0]][idField],
		if_show: 1,
		page_size: 1000
	}, null, false)
	if (!util.isEmpty(current)) {
		buildMultiIndex(seconds.list, multiIndex, current[1], nameField, 1)
	}

	let thirds = await server.promise(path, {
		[parentField]: seconds.list[multiIndex[1]][idField],
		if_show: 1,
		page_size: 1000
	}, null, false)
	if (!util.isEmpty(current)) {
		buildMultiIndex(thirds.list, multiIndex, current[2], nameField, 2)
	}

	// 三级数组
	let multiList = [firsts.list, seconds.list, thirds.list]

	// 返回数据
	let result = getResult(multiList, multiIndex, idField, nameField)
	return Object.assign(result, {
		multiList: multiList
	})
}

/**
 * 使下拉选项保持选中的值
 * @param {Object} multiList
 * @param {Object} multiIndex
 * @param {Object} search
 * @param {Object} nameField
 * @param {Object} index
 */
function buildMultiIndex(multiList, multiIndex, search, nameField, index) {
	if (!util.isEmpty(search)) {
		for (let key in multiList) {
			if (multiList[key][nameField] == search) {
				multiIndex[index] = key
			}
		}
	}
}

/**
 * 返回选中的数据
 * @param {Object} multiList
 * @param {Object} multiIndex
 * @param {Object} idField
 * @param {Object} nameField
 */
function getResult(multiList, multiIndex, idField, nameField) {
	let array = [multiList[0][multiIndex[0]][nameField], multiList[1][multiIndex[1]][nameField]]
	if (multiList[2][multiIndex[2]]) {
		array.push(multiList[2][multiIndex[2]][nameField])
	}

	return {
		label: array.join('，'), // 当前选择的文本
		id: multiList[array.length - 1][multiIndex[array.length - 1]][idField] // 末级ID
	}
}

module.exports = {
	build: build
}
