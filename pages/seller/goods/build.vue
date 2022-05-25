<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10 mb10">
			<view class="uni-flex uni-row pt10 pb10 pl5 pr5">
				<textarea v-model="goods.goods_name" class="f-16 uni-bold width-surplus" :auto-height="true"
					placeholder="输入商品标题"></textarea>
			</view>
			<view class="uni-flex uni-row mt10 pb10 goods-images" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-if="item" v-for="(item, index) in goods.goods_images" :key="index" class="relative">
					<image v-on:click="upload('goods_images', index)" :src="item" mode="scaleToFill"
						class="image round-edge mr10 mb10"></image>
					<uni-icons v-on:click="del('goods_images', index)" type="clear" class="absolute"></uni-icons>
				</view>
				<view v-on:click="upload('goods_images', goods.goods_images.length)"
					class="bgp round-edge mb10 image plusempty">
					<uni-icons type="plusempty" size="60" color="gray"></uni-icons>
				</view>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">类目</text>
				<uni-data-picker @change="picker($event, 'category')" :localdata="gcategory.list"
					v-model="gcategory.selected" :border="false" popup-title="请选择分类" class="width-surplus">
				</uni-data-picker>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">品牌</text>
				<picker @change="picker($event, 'brand')" class="width-surplus" mode="selector"
					range-key="brand_name" :range="brands.list" :value="brands.selected">
					<view class="uni-flex uni-row width-between">
						<text class="f-16 line-clamp-1">{{brands.list[brands.selected].brand_name}}</text>
						<uni-icons type="arrowright" color="gray"></uni-icons>
					</view>
				</picker>
			</view>
		</view>

		<view v-if="goods.spec_qty == 0"
			class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10 mb10 specs">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 width-between flex-middle">
				<text class="mr10 width-surplus">价格</text>
				<view class="uni-flex uni-row f-16 flex-middle flex-end">
					<input v-model="goods.price" type="digit" maxlength="6" class="input mr5 uni-center"
						placeholder="请输入价格" />
					<text>元</text>
				</view>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 width-between">
				<text class="mr10">库存</text>
				<view class="uni-flex uni-row f-16 flex-middle flex-end">
					<input v-model="goods.stock" type="number" maxlength="6" class="input mr5 uni-center"
						placeholder="请输入库存" />
					<text>件</text>
				</view>
			</view>
		</view>

		<view v-else v-on:click="col('spec')" class="round-edge bgf ml10 mr10 pt5 pb5 pl10 pr10 mb10 specsqty">
			<view v-for="(item, index) in attributes.specs" :key="index" :class="['pt10 pb10', index > 0 ? 'bt' :'']">
				<view class="uni-flex uni-row width-between">
					<text class="f-16">规格</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
				<view class="uni-flex uni-row width-between mt10">
					<view class="f-16">
						<view class="f-16">
							<text v-if="item.spec_1" class="mr10">{{item.spec_1}}</text>
							<text v-if="item.spec_2" class="mr10">{{item.spec_2}}</text>
						</view>
						<text class="f-gray">{{item.stock||0}}件</text>
					</view>
					<text class="f-16">{{item.price|currency}}</text>
				</view>
			</view>
		</view>

		<view v-if="cols.detail" class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 mb10 pd10">
			<text class="f-16">商品详情</text>
			<view class="uni-flex uni-row pt10 pb10">
				<textarea v-model="goods.content" class="width-surplus f-gray" :auto-height="true"
					placeholder="手机详情介绍，限2000字符，中文算2字符"></textarea>
			</view>
			<view class="uni-flex uni-column pb5 mt10 desc-images" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-if="item" v-for="(item, index) in goods.desc_images" :key="index" class="relative">
					<image v-on:click="upload('desc_images', index)" :src="item" mode="widthFix" class="image"></image>
					<uni-icons v-on:click="del('desc_images', index)" type="clear" class="absolute"></uni-icons>
				</view>
				<view v-on:click="upload('desc_images', goods.desc_images.length)"
					class="uni-flex uni-column flex-center flex-middle mt10 l-h20 button">
					<uni-icons type="camera-filled" color="#dddddd"></uni-icons>
					<text class="uni-text-gray">添加商品详情图</text>
				</view>
			</view>
		</view>

		<view v-show="cols.other" class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 mb10 pr10 pl10">
			<view class="pt10 pb10">
				<view class="uni-flex uni-row  flex-middle width-between f-16">
					<text>物流模板</text>
					<view class="uni-flex uni-row f-16">
						<picker @change="picker($event, 'delivery')" :range="deliverys.list" :value="deliverys.selected"
							range-key="name"><text class="f-blue">切换</text></picker>
					</view>
				</view>
				<view class="round-edge pd10 mt10" style="background-color: #F9F9F9;">
					<view class="uni-bold pt5 pb5 f-16">{{deliverys.list[deliverys.selected].name||'默认运费'}}</view>
					<view class="uni-flex uni-row">
						<text class="f-gray mr10">发货时间</text>
						<text class="ml10 width-surplus">48小时内发货</text>
					</view>
					<view class="uni-flex uni-row">
						<text class="f-gray mr10">运费设置</text>
						<text
							class="ml10 width-surplus">{{deliverys.default.start_standards||1}}件内{{deliverys.default.start_fees||10}}元，每增加{{deliverys.default.add_standards||1}}件加{{deliverys.default.add_fees||8}}元</text>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle width-between f-16">
				<text class="mr10">上架</text>
				<switch v-on:change="change($event, 'if_show')" :checked="goods.if_show == 1" color="#F0AD4E"></switch>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle width-between f-16">
				<text class="mr10">推荐</text>
				<switch v-on:change="change($event, 'recommended')" :checked="goods.recommended == 1" color="#F0AD4E">
				</switch>
			</view>
		</view>
		<view class="buttons">
			<view class="fixed-bottom bgp">
				<view class="pl10 pt10 pr10 operate">
					<text v-on:click="col('spec')"
						:class="['mybutton pl10 pr10 inline-block mr10 ml10 mb10', goods.spec_qty > 0 ? 'selected' : '']">添加规格</text>
					<text v-on:click="col('detail')"
						:class="['mybutton pl10 pr10 inline-block mr10 ml10 mb10', cols.detail ? 'selected' : '']">添加详情</text>
					<text v-on:click="col('other')"
						:class="['mybutton pl10 pr10 inline-block ml10 mb10', cols.other ? 'selected' : '']">其他设置</text>
				</view>
				<view class="bt">
					<view v-on:click="submit" class="mybutton f-white f-16 mt10 mb10 ml10 mr10">保存提交</view>
				</view>
			</view>
			<view class="bottom-placeholder"></view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				id: 0,
				goods: {
					spec_qty: 0,
					cate_id: 0,
					goods_images: [],
					desc_images: [],
					specs: [],
					if_show: 1
				},
				attributes: {},
				gcategory: {
					selected: [],
					list: []
				},
				brands: {
					selected: 0,
					list: [{
						brand_name: ''
					}]
				},
				deliverys: {
					list: [{}],
					selected: 0,
					default: {
						start_standards: 1,
						start_fees: 0,
						add_standards: 1,
						add_fees: 0,
					}
				},
				cols: {
					detail: true,
					other: false
				}
			}
		},
		methods: {
			submit() {
				model.submit(this)
			},
			upload(filed, index) {
				model.upload(this, filed, index)
			},
			change(e, field) {
				this.goods[field] = e.detail.value ? 1 : 0
			},
			picker(e, field) {
				if (field == 'category') {
					this.goods.cate_id = e.detail.value[e.detail.value.length - 1].value
				} else if (field == 'delivery') {
					this.deliverys.selected = e.detail.value
					if (!util.isEmpty(this.deliverys.list[e.detail.value].area_fee)) {
						this.deliverys.default = this.deliverys.list[e.detail.value].area_fee.express.default_fee
						this.goods.dt_id = this.deliverys.list[e.detail.value].template_id
					}
				} else {
					this.brands.selected = e.target.value
					this.goods[field] = this.brands.list[e.detail.value].brand_name
				}
			},
			del(field, index) {
				model.delfile(this, this.goods[field][index])
				this.goods[field][index] = ''
				this.$forceUpdate()
			},
			col(field) {
				if (field == 'spec') {
					// 临时保存，避免数据丢失
					uni.setStorageSync('__publish__', this.goods)
					uni.setStorageSync('__attributes__', this.attributes)
					uni.navigateTo({
						url: '/pages/seller/goods/spec'
					})
				} else {
					this.cols[field] = this.cols[field] ? false : true
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				model.goods(this)
			} else {
				model.brands(this)
				model.gcategory(this)
				model.deliverys(this)
			}
			uni.removeStorageSync('__publish__')
			uni.removeStorageSync('__attributes__')
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', util.getUrl())
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}

			let goods = uni.getStorageSync('__publish__')
			if (!util.isEmpty(goods)) {
				this.goods = goods
			}

			this.attributes = uni.getStorageSync('__attributes__') || {
				category: [],
				specs: []
			}

			this.goods.spec_qty = 0
			if (this.attributes.specs.length > 0) {
				for (let index in this.attributes.category) {
					if (this.attributes.category[index].selected) {
						this.goods.spec_qty = Number(this.goods.spec_qty) + 1
					}
				}
			}
		}
	}
</script>

<style scoped>
	.specs .input {
		width: 180rpx;
		text-align: right;
	}

	.specsqty:active {
		background-color: #F9F9F9;
	}

	.goods-images .image {
		width: 200rpx;
		height: 200rpx;
		line-height: 200rpx;
		margin-top: 30rpx;
	}

	.goods-images .plusempty {
		width: 130rpx;
		padding-left: 70rpx;
	}

	.goods-images .absolute {
		right: 10rpx;
		top: -20rpx;
	}

	.desc-images .image,
	.desc-images .button {
		width: 100%;
	}

	.desc-images .image {
		display: block;
	}

	.desc-images .button {
		height: 300rpx;
		background-color: #F9F9F9;
	}

	.desc-images .absolute {
		right: -26rpx;
		top: -20rpx;
	}

	.operate .mybutton {
		background: #FFFFFF;
		padding-top: 14rpx;
		padding-bottom: 14rpx;
	}

	.operate .mybutton.selected {
		color: #fc2b34;
		background-color: #fef3f9;
	}

	.bottom-placeholder {
		height: 280rpx;
	}

	/deep/ .arrow-area {
		display: none;
	}

	/deep/ .selected-area {
		line-height: auto;
	}

	/deep/ .selected-area,
	/deep/ .dialog-title,
	/deep/ .selected-item {
		font-size: 32rpx;
	}

	/deep/ .selected-list {
		padding: 0;
	}

	/deep/ .input-value {
		padding: 0;
	}
</style>
