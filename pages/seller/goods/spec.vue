<template>
	<view>
		<view class="round-edge pd10 ml10 mr10 mt10 category">
			<view class="uni-flex uni-row width-between">
				<text class="f-gray f-16">请给商品规格选择合适的属性</text>
				<text v-on:click="showPopup($event, 'category')" class="f-blue f-16">编辑</text>
			</view>
			<view class="uni-flex uni-row mt10 pb5">
				<view v-for="(item, index) in attributes.category" :key="index" class="uni-flex uni-row"
					style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
					<label v-if="item.name" class="uni-flex uni-row mr10 pr10 l-h20">
						<switch v-on:change="change($event, index)" type="checkbox" :checked="item.selected"></switch>
						<text>{{item.name}}</text>
					</label>
				</view>
			</view>
		</view>

		<view v-for="(item,index) in attributes.specs" :key="index">
			<view class="round-edge bgf pd10 ml10 mr10 mt10">
				<view class="uni-flex uni-row width-between">
					<text class="uni-bold f-16">规格{{index+1}}</text>
					<text v-on:click="del(index)" class="f-blue f-16">删除</text>
				</view>
				<view v-for="(category, key) in attributes.category" :key="key" class="uni-flex uni-column">
					<view v-if="category.selected && category.name"
						class="uni-flex uni-row f-16 flex-middle width-between mt10">
						<text>{{category.name}}</text>
						<input v-model="attributes.specs[index]['spec_'+(key+1)]" :placeholder="'输入'+category.name"
							maxlength="30" />
					</view>
				</view>
				<view class="uni-flex uni-row f-16 flex-middle width-between mt10">
					<text>价格</text>
					<view class="uni-flex uni-row  flex-middle flex-end f-16">
						<input v-model="attributes.specs[index].price" class="digit" type="digit" placeholder="输入价格"
							maxlength="7" />
						<text class="ml10">元</text>
					</view>
				</view>
				<view class="uni-flex uni-row f-16 flex-middle width-between mt10">
					<text>库存</text>
					<view class="uni-flex uni-row flex-middle flex-end f-16">
						<input v-model="attributes.specs[index].stock" class="digit" type="number" placeholder="输入库存"
							maxlength="5" />
						<text class="ml10">件</text>
					</view>
				</view>

			</view>
		</view>
		<view v-on:click="add" class="width-surplus ml10 mr10 mt10 bgf round-edge pd10 flex-middle mb10">
			<uni-icons type="plusempty" size="40"></uni-icons>
			<text class="f-16">规格</text>
		</view>

		<view class="buttons">
			<view class="uni-flex uni-row fixed-bottom top-round-edge bgp width-between">
				<text></text>
				<view class="mr10">
					<text v-on:click="cancel"
						class="mybutton uni-bold gray f-white f-16 mt10 mb10 ml10 mr10 inline-block">取消</text>
					<text v-on:click="save"
						class="mybutton uni-bold f-white f-16 mt10 mb10 ml10 mr10 inline-block">保存</text>
				</view>
			</view>
			<view class="bottom-placeholder"></view>
		</view>

		<uni-popup ref="category" type="bottom">
			<my-popup-attrs :data="attributes.category" @confirm="confirm"></my-popup-attrs>
		</uni-popup>

	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './spec.js'
	export default {
		data() {
			return {
				attributes: {
					category: [{
						name: '颜色',
						selected: true
					}, {
						name: '尺码',
						selected: true
					}],
					specs: [{
						spec_1: '',
						spec_2: '',
						price: '',
						stock: ''
					}]
				}
			}
		},
		methods: {
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			},
			confirm(done, category) {
				this.attributes.category = category
				this.$forceUpdate()
				done()
			},
			save() {
				if (model.save(this)) {
					uni.setStorageSync('__attributes__', this.attributes)
					uni.navigateBack()
				}
			},
			cancel() {
				uni.navigateBack()
			},
			change(e, index) {
				this.attributes.category[index].selected = e.detail.value
			},
			add() {
				this.attributes.specs.push({
					spec_1: '',
					spec_2: '',
					price: '',
					stock: ''
				})
			},
			del(index) {
				let list = []
				for (let key in this.attributes.specs) {
					if (key != index) {
						list.push(this.attributes.specs[key])
					}
				}
				this.attributes.specs = list
			}
		},
		onLoad(options) {
			let attributes = uni.getStorageSync('__attributes__')

			if (!util.isEmpty(attributes) && attributes.category.length > 0) {
				this.attributes.specs = attributes.specs

				if (attributes.category.length < 2) {
					this.attributes.category[1].selected = false
				}
				this.attributes.category = Object.assign(this.attributes.category, attributes.category)
			}
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>

<style scoped>
	input {
		text-align: right;
	}

	.category {
		background-image: linear-gradient(to right, #f2f8f9, #f2f8f9);
	}

	.bottom-placeholder {
		height: 150rpx;
	}

	.fixed-bottom .mybutton {
		padding: 12rpx 12rpx;
		border-radius: 10rpx;
	}

	.fixed-bottom .mybutton.gray {
		background: #F9F9F9;
		color: #fc2b34;
	}
</style>
