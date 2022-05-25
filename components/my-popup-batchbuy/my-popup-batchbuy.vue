<template>
	<view>
		<view class="bgf top-round-edge pt5 goods-specs">
			<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons>
			<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
			<view class="uni-flex uni-row width-between info">
				<view class="uni-flex uni-row pd10">
					<view class="image">
						<image :src="goods.image||goods.default_image" mode="widthFix"></image>
					</view>
					<view class="uni-flex uni-column ml10">
						<text class="l-h20 f-15 line-clamp-2 uni-bold">{{goods.goods_name}}</text>
						<text class="f-gray">库存：{{goods.stock||0}}件</text>
						<text v-if="goods.promotion" class="f-red f-17">{{goods.promotion.price|currency}}</text>
						<text v-else class="f-red f-17">{{goods.price|currency}}</text>
					</view>
				</view>
			</view>

			<view v-if="goods.spec_qty > 0" class="pd10">
				<view v-if="specs[fields.field.name]" class="uni-flex uni-column">
					<text class="mr10 uni-bold f-15 f-c55">{{specs[fields.field.name]}}</text>
					<scroll-view scroll-x="true" scroll-y="false">
						<view class="uni-flex uni-row">
							<view v-on:click="changeSpec(item, fields.field.value, fields.thefield.value)"
								:class="['bgf l-h20 mr10 mt10 item flex-middle flex-center', specs.disabled[item[fields.field.value]] ? 'disabled' : '', specs.selected[fields.field.value] == item[fields.field.value] ? 'selected': '']"
								v-for="(item, index) in specs[fields.field.value]" :key="index">
								<text
									:class="[specs.destroy[item[fields.field.value]] ? 'destroy' : '']">{{item[fields.field.value]}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="specs[fields.thefield.name]" class="uni-flex uni-column mt10 pt10 specline">
					<text class="mr10 uni-bold f-15 f-c55">{{specs[fields.thefield.name]}}</text>
					<scroll-view scroll-x="false" scroll-y="true" style="max-height: 300rpx; min-height: 100rpx;">
						<view v-for="(item, key, index) in specs[fields.thefield.value]" :key="key"
							:class="['uni-flex uni-row width-between pb5  flex-middle', index > 0 ? 'bt':'']">
							<view
								:class="['mr10 mt10 width-surplus l-h20 item', specs.disabled[item[fields.thefield.value]] ? 'disabled' : '', specs.selected[fields.thefield.value] == item[fields.thefield.value] ? 'selected': '']">
								<text
									:class="[specs.destroy[item[fields.thefield.value]] ? 'destroy' : '']">{{item[fields.thefield.value]}}</text>
							</view>
							<view v-if="specs.disabled[item[fields.thefield.value]]">
								<text v-if="specs.destroy[item[fields.thefield.value]]"
									class="mr10 pr10 uni-text-gray">缺货中</text>
								<text v-else class="mr10 pr5 f-gray">库存不足</text>
							</view>
							<view v-else class="uni-flex uni-row popup-quantity flex-middle">
								<uni-icons v-on:click="changeQty($event, item, 'minus')" type="minus-filled" size="50"
									color="#eeeeee"></uni-icons>
								<input maxlength="3" type="number" class="uni-center f-13"
									@blur="changeQty($event, item)" v-model="quantity.list[item.spec_id]" />
								<uni-icons v-on:click="changeQty($event, item, 'plus')" type="plus-filled" size="50"
									color="#fc2b34"></uni-icons>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view v-else class="uni-flex uni-row flex-middle pd10">
				<view><text class="mr10 uni-bold f-15 f-c55">默认规格</text></view>
				<view class="uni-flex uni-row popup-quantity flex-middle">
					<uni-icons v-on:click="changeQty($event, item, 'minus')" type="minus-filled" size="50"
						color="#eeeeee"></uni-icons>
					<input maxlength="3" type="number" class="uni-center f-13" @blur="changeQty($event, item)"
						v-model="quantity.list[item.spec_id]" />
					<uni-icons v-on:click="changeQty($event, item, 'plus')" type="plus-filled" size="50"
						color="#fc2b34"></uni-icons>
				</view>
			</view>
			<view class="uni-flex uni-row flex-middle width-between pd10 paymoney">
				<view><text v-if="batchbuy.price >= 0"
						class="f-14 f-c60">≥{{batchbuy.quantity}}件,{{batchbuy.price|currency}}元/件</text></view>
				<text class="f-14 f-red">共{{quantity.total}}件, {{quantity.money|currency}}元</text>
			</view>
			<view class="pd10">
				<view class="uni-center f-white uni-bold f-15 mybutton" @click="confirm">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import server from '@/common/server.js'
	import util from '@/common/util.js'
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '批发进货'
			},
			item: {
				type: Object,
				default: function() {
					return {}
				}
			},
			mode: {
				type: String,
				default: 'cart'
			}
		},
		data() {
			return {
				goods: {},
				quantity: {
					list: {},
					total: 0,
					money: 0
				},
				batchbuy: {},
				selected: {},
				specs: {
					list: {},
					spec_name_1: '',
					spec_name_2: '',
					spec_1: {},
					spec_2: {},
					selected: {},
					disabled: {},
					destroy: {}
				},
				fields: {
					field: {
						name: 'spec_name_1',
						value: 'spec_1'
					},
					thefield: {
						name: 'spec_name_2',
						value: 'spec_2'
					}
				}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.goods = this.item
			this.getSpecs(this)
		},
		// #ifdef MP
		// 当页面有多个弹窗组件时，需要同过此进行数据绑定的初始化，避免数据污染
		watch: {
			item(val) {
				this.item = val
				this.specs = {
					list: {},
					spec_name_1: '',
					spec_name_2: '',
					spec_1: {},
					spec_2: {},
					selected: {},
					disabled: {},
					destroy: {}
				}
				this.batchbuy = {}
				this.fields = {
					field: {
						name: 'spec_name_1',
						value: 'spec_1'
					},
					thefield: {
						name: 'spec_name_2',
						value: 'spec_2'
					}
				}
				this.getSpecs(this)
			}
		},
		// #endif
		methods: {
			confirm() {
				if (this.quantity.total <= 0) {
					uni.showToast({
						title: '请选择数量',
						icon: 'none'
					})
					return false
				}
				this.addCart(this)
				this.popup.close()

				// this.$emit('confirm', () => {
				// 	this.popup.close()
				// }, this.quantity)
			},
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			},
			changeQty(e, item, type) {

				this.selected = item
				Object.assign(this.goods, this.selected)

				let value = 0
				let quantity = Number(this.quantity.list[item.spec_id]) || 0
				if (type == 'plus') {
					value = quantity + 1
				} else if (type == 'minus') {
					if (quantity > 0) {
						value = quantity - 1
					}
				} else {
					value = Number(e.detail.value)
					if (value < 0) value = 0
				}
				if (this.selected.stock < value) {
					uni.showToast({
						title: '库存不足',
						icon: 'none'
					})
					value = Number(this.selected.stock) || 0
				}
				if (value >= 0) {
					this.quantity.list[item.spec_id] = value
				}
				this.buildMoney(this)
			},
			getSpecs(that) {
				server.request('goods/specs', {
					goods_id: that.item.goods_id
				}, function(res) {
					if (res.code == 0) {

						// 变化字段
						that.changeFields(that, res.data.list)

						// 获取不重复的规格数组
						that.specs[that.fields.field.value] = that.uniqueSpecs(res.data.list, that.fields.field
							.value)

						// 全量规格数组
						that.specs.list = {}
						res.data.list.forEach(function(item, index) {
							if (index == 0) {
								that.specs[that.fields.field.name] = item[that.fields.field.name]
								that.specs[that.fields.thefield.name] = item[that.fields.thefield.name]

								Object.assign(that.goods, item)
							}
							that.specs.list[item.spec_id] = item

							// 初始化购买数量
							that.$set(that.quantity.list, item.spec_id, 0)
						})
						for (let index in that.specs.list) {
							let item = that.specs.list[index]
							if (item.stock > 0) {
								that.changeSpec(item, that.fields.field.value, that.fields.thefield.value)
								break
							}
						}
					}
				})
			},

			/**
			 * 切换规格后
			 * @param {Object} current
			 * @param {Object} field
			 * @param {Object} thefield
			 */
			changeSpec(current, field, thefield) {
				let that = this

				if (that.specs.disabled[current[field]]) {
					return false
				}

				// 将当前点击的规格设置为选中
				that.specs.selected[field] = current[field]

				// 选中后，加载第二列的数据
				that.secondColumn(that, field, thefield)

				// 不可用的规格暂存数组
				that.specs.disabled = {}
				that.specs.destroy = {}

				// 如果只有一个规格
				if (!current[thefield]) {
					for (let index in that.specs[field]) {
						let item = that.specs[field][index]
						if (item.stock == 0) {
							that.specs.disabled[item[field]] = true
						}
					}
					this.selected = current
				}
				//  如果有二个规格
				else {

					// 根据一个规格，筛选另外一个规格的属性列表
					let object = {}
					for (let index in that.specs.list) {
						let item = that.specs.list[index]
						if (item[field] == current[field]) {
							object[item[thefield]] = item
						}
					}

					// 把不可用的第二规格做处理
					for (let index in that.specs[thefield]) {
						let item = that.specs[thefield][index]
						if (!object[item[thefield]] || object[item[thefield]].stock < 1) {
							that.specs.disabled[item[thefield]] = true
							that.specs.destroy[item[thefield]] = !object[item[thefield]] ? true : false

							// 如果上次选中的规格属于不可用的，则删除已选中
							if (item[thefield] == that.specs.selected[thefield]) {
								delete(that.specs.selected[thefield])
							}
						}
					}

					for (let index in that.specs.list) {
						let item = that.specs.list[index]
						if (that.specs.selected[field] == item[field] && that.specs.selected[thefield] == item[
								thefield]) {
							that.selected = item
							break
						}
					}
				}
				Object.assign(that.goods, that.selected)
			},

			/**
			 * 获取不重复的规格数组
			 * @param {Object} list
			 * @param {Object} field
			 */
			uniqueSpecs(list, field) {
				let object = {}
				for (let index in list) {
					let item = list[index]
					if (util.isEmpty(object[item[field]])) {
						object[item[field]] = item
					}
				}
				return object
			},
			/**
			 * 点击其中一列，获取另一列的数据
			 * @param {Object} that
			 * @param {Object} field
			 * @param {Object} thefield
			 */
			secondColumn(that, field, thefield) {
				let list = []
				for (let index in that.specs.list) {
					let item = that.specs.list[index]
					if (item[field] == that.specs.selected[field]) {
						list[item[thefield]] = item
					}
				}
				Object.assign(that.specs[thefield], list)
			},
			/**
			 * 通过变化字段，以实现不管是一种规格还是两种规格，都能输出填写数量区域，而不用调整DOM结构
			 * @param {Object} that
			 * @param {Object} list
			 */
			changeFields(that, list) {
				let spec_qty = list.length > 0 ? list[0].spec_qty : 0
				if (spec_qty < 2) {
					let field = that.fields.field
					that.fields = Object.assign({
						field: that.fields.thefield,
						thefield: field
					})
				}
			},
			buildMoney(that) {
				that.getQuantity(that)
				server.request('wholesale/price', {
					goods_id: that.goods.goods_id,
					quantity: that.quantity.total
				}, function(res) {
					that.batchbuy = res.data
					that.quantity.money = 0
					for (let index in that.quantity.list) {
						let quantity = that.quantity.list[index]
						if (quantity > 0) {
							let item = that.specs.list[index]
							if (res.code == 0 && res.data && res.data.price >= 0) {
								item.price = res.data.price
							} else if (item.promotion) {
								item.price = item.promotion.price
							}
							that.quantity.money += parseFloat(item.price * quantity)
						}
					}
				})
			},
			getQuantity(that) {
				let total = 0
				for (let index in that.quantity.list) {
					if (that.quantity.list[index] > 0) {
						total += that.quantity.list[index]
					}
				}
				that.quantity.total = total
			},
			// 批量加入购物车
			addCart(that) {
				server.request('cart/many', {
					specs: that.quantity.list,
					selected: that.mode == 'cart' ? 0 : 1
				}, function(res) {
					if (res.code == 0) {
						if (that.mode == 'cart') {
							uni.showToast({
								title: "已加入购物车"
							})
						} else {
							uni.navigateTo({
								url: '/pages/order/normal'
							})
						}
					} else if (res.code == 4004) {
						uni.navigateTo({
							url: "/pages/login/login?redirect=yes",
							animationType: 'slide-in-bottom',
							animationDuration: 300
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		}
	}
</script>
<style scoped>
	.goods-specs .info {
		padding-left: 180rpx;
	}

	.goods-specs .info image {
		width: 160rpx;
		height: 160rpx;
		display: block;
		background-color: #FFFFFF;
		margin-left: -180rpx;
		border-radius: 4rpx;
		padding: 4rpx;
	}

	.goods-specs .item {
		padding: 10rpx 20rpx;
		border: #F1F1F1 2rpx solid;
		background-color: #F1F1F1;
		border-radius: 8rpx;
		text-align: center;
		min-width: 100rpx;
	}

	.goods-specs .item.selected {
		border-color: #fc2b34;
		background-color: #fff8f8;
		color: #fc2b34
	}

	.goods-specs .item.disabled {
		border-color: #F1F1F1;
		background-color: #FFFFFF;
		color: gray;
	}

	.goods-specs .item .destroy {
		text-decoration: line-through;
		color: #ccc;
	}

	.goods-specs .popup-quantity {
		justify-content: flex-end;
	}

	.goods-specs .popup-quantity input {
		padding: 0rpx 10rpx;
		max-width: 50rpx;
	}

	.goods-specs .specline .item {
		padding: 6rpx 0rpx;
		border: 0;
		background-color: #FFFFFF;
		border-radius: 0rpx;
		text-align: left;
	}

	.paymoney {
		background-color: #fdf4f2;
		text-align: right;
	}
</style>
