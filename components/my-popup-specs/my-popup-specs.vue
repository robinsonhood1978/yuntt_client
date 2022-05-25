<template>
	<view>
		<view class="bgf top-round-edge pt5 goods-specs">
			<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons>
			<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
			<view class="uni-flex uni-row width-between info">
				<view class="uni-flex uni-row pd10">
					<view class="image">
						<image :src="goods.image||goods.default_image" mode="scaleToFill"></image>
					</view>
					<view class="uni-flex uni-column ml10">
						<view class="uni-flex uni-row">
							<text class="f-red f-17">{{goods.price|currency}}</text>
							<text v-if="goods.promotion"
								class="f-white pl10 pr10 ml10 promote">优惠价{{goods.promotion.price|currency}}</text>
						</view>
						<text class="f-gray f-13">销量：{{goods.sales||0}}件</text>
						<view class="mt5 f-13 l-h20">
							<text>您已选择：</text>
							<text v-if="goods.spec_qty > 0">{{specs.selected[fields.field.value]||''}}</text>
							<text v-if="goods.spec_qty > 0" class="ml5">{{specs.selected[fields.thefield.value]||''}}</text>
							<text v-if="goods.spec_qty == 0">默认规格</text>
						</view>
					</view>
				</view>
			</view>
			<scroll-view scroll-x="false" scroll-y="true" style="max-height: 650rpx; min-height: 500rpx;">
				<view class="pd10">
					<view v-if="specs[fields.field.name]" class="uni-flex uni-column">
						<text class="mr10 uni-bold f-15 f-c55">{{specs[fields.field.name]}}</text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<view v-on:click="changeSpec(item, fields.field.value, fields.thefield.value)"
								:class="['bgf mr10 mt10 item', specs.disabled[item[fields.field.value]] ? 'disabled' : '', specs.selected[fields.field.value] == item[fields.field.value] ? 'selected': '']"
								v-for="(item, index) in specs[fields.field.value]" :key="index">
								<text
									:class="['pl10 pr10', specs.destroy[item[fields.field.value]] ? 'destroy' : '']">{{item[fields.field.value]}}</text>
							</view>
						</view>
					</view>
					<view v-if="specs[fields.thefield.name]" class="uni-flex uni-column mt10 pt10">
						<text class="mr10 uni-bold f-15 f-c55">{{specs[fields.thefield.name]}}</text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<view v-on:click="changeSpec(item, fields.thefield.value, fields.field.value)"
								:class="['bgf mr10 mt10 item', specs.disabled[item[fields.thefield.value]] ? 'disabled' : '', specs.selected[fields.thefield.value] == item[fields.thefield.value] ? 'selected': '']"
								v-for="(item, index) in specs[fields.thefield.value]" :key="index">
								<text
									:class="['pl10 pr10', specs.destroy[item[fields.thefield.value]] ? 'destroy' : '']">{{item[fields.thefield.value]}}</text>
							</view>
						</view>
					</view>
					<view v-show="showQuantity" class="uni-flex uni-row width-between mt10 mb10 pt10 mr10 pr10"
						style="margin-top: 40rpx;">
						<view class="mt5 uni-flex uni-row"><text class="uni-bold f-15 f-c55">购买数量</text><text
								v-if="selected.spec_id" class="f-gray ml10">库存{{selected.stock||0}}件</text></view>
						<view class="uni-flex uni-row popup-quantity">
							<text v-on:click="changeQty($event, 'minus')" class="minus uni-center flex-middle">-</text>
							<input maxlength="3" type="number" class="uni-center f-13 flex-middle" @blur="changeQty"
								v-model="quantity" />
							<text v-on:click="changeQty($event, 'plus')" class="plus uni-center flex-middle">+</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="pd10">
				<view class="uni-center f-white uni-bold f-15 mybutton" @click="confirm">确定</view>
			</view>
		</view>
		<view class="bottom-placeholder"></view>
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
				default: '选择规格'
			},
			successText: {
				type: String,
				default:  '已加入购物车'
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
			},
			showQuantity: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				goods: {},
				quantity: 1,
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
				if (!this.selected.spec_id) {
					uni.showToast({
						title: '请选择规格',
						icon: 'none'
					})
					return false
				}
				if (this.selected.stock < this.quantity) {
					uni.showToast({
						title: '库存不足',
						icon: 'none'
					})
					return false
				}
				this.selected.quantity = this.quantity
				this.$emit('confirm', () => {
					uni.showToast({
						title: this.successText
					})
					this.popup.close()
				}, this.selected)
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
			changeQty(e, type) {

				let value = 0
				let quantity = Number(this.quantity) || 1

				if (type == 'plus') {
					value = quantity + 1
				} else if (type == 'minus') {
					if (quantity > 1) {
						value = quantity - 1
					}
				} else {
					value = Number(e.detail.value)
					if (value < 1) value = 1
				}

				if (!util.isEmpty(this.selected.spec_id) && this.selected.stock < value) {
					uni.showToast({
						title: '库存不足',
						icon: 'none'
					})
					value = this.selected.stock > 0 ? this.selected.stock : 1
				}

				if (value > 0) {
					this.quantity = value
				}
			},
			getSpecs(that) {
				server.request('goods/specs', {
					goods_id: that.item.goods_id
				}, function(res) {
					if (res.code == 0) {

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

					that.selected = {}
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
			}
		}
	}
</script>
<style scoped>
	.goods-specs .info {
		padding-left: 170rpx;
	}

	.goods-specs .info .promote {
		height: 50rpx;
		border-radius: 30rpx;
		background-color: #F50C04;
	}

	.goods-specs .info image {
		width: 160rpx;
		height: 160rpx;
		display: block;
		background-color: #FFFFFF;
		margin-left: -164rpx;
		border-radius: 10rpx;
	}
	

	.goods-specs .item {
		padding: 6rpx 20rpx;
		border: #F1F1F1 2rpx solid;
		background-color: #F1F1F1;
		border-radius: 8rpx;
		text-align: center;
		color: #333333;
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
		color: #DDDDDD;
	}

	.goods-specs .item .destroy {
		text-decoration: line-through;
	}

	.goods-specs .popup-quantity .plus {
		border-radius: 0rpx 8rpx 8rpx 0;
		font-size: 30rpx;
	}

	.goods-specs .popup-quantity .minus {
		border-radius: 8rpx 0rpx 0rpx 8rpx;
		font-size: 30rpx;
	}

	.goods-specs .popup-quantity text,
	.goods-specs .popup-quantity input {
		display: block;
		background-color: #F1F1F1;
		overflow: hidden;
		height: 66rpx;
		line-height: 66rpx;
	}

	.goods-specs .popup-quantity input {
		padding: 0rpx 22rpx;
		width: 120rpx;
		background-color: #EEEEEE;
		margin: 0 2rpx;
	}
</style>
