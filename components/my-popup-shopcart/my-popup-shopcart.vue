<template>
	<view>
		<view class="bgf top-round-edge pt5 goods-specs bb">
			<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons>
			<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
			<scroll-view scroll-x="false" scroll-y="true" :style="style">
				<view v-if="goods.quantity > 0" class="uni-flex uni-row pb10 pt10 pd10 width-between bgf"
					v-for="(goods, index) in cart.list" :key="index">
					<navigator hover-class="none" :url="'/pages/community/goods/index?id='+goods.goods_id" class="mr10">
						<image class="image" :src="goods.image||goods.default_image" mode="scaleToFill"></image>
					</navigator>
					<view class="uni-flex uni-column width-surplus">
						<navigator hover-class="none" :url="'/pages/community/goods/index?id='+goods.goods_id"
							class="line-clamp-2 l-h20">{{goods.goods_name}}</navigator>
						<view v-if="goods.spec_qty > 0" class="f-gray f-13 l-h20 mt5">{{specification(goods)}}</view>
						<view class="uni-flex uni-row mt10">
							<view class="f-red width-surplus">
								<text v-if="goods.promotion">{{goods.promotion.price|currency}}</text>
								<text v-else>{{goods.price|currency}}</text>
							</view>
							<view class="uni-flex uni-row mr10 flex-middle" style="justify-content: flex-end;">
								<uni-icons v-on:click="changeQty(goods, 'minus')" type="minus" color="#d8d4c7">
								</uni-icons>
								<text class="quantity uni-center">{{goods.quantity}}</text>
								<uni-icons v-on:click="changeQty(goods, 'plus')" type="plus" color="#d8d4c7">
								</uni-icons>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="pd10">
				<view @click="confirm" class="uni-flex uni-row f-white flex-middle flex-center mybutton width-surplus">
					<text class="f-17 line-clamp-1 l-h20">{{cart.paymoney|currency}} 去支付</text>
					<uni-icons type="arrowright" color="#ffffff" size="30"></uni-icons>
				</view>
				<view class="bottom-placeholder"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '购物车商品'
			},
			data: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				cart: {},
				style: ''
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.cart = this.data
			this.style = "height:" + (uni.getSystemInfoSync().screenHeight + 100) + "rpx"
		},
		// 此处不要加仅限于微信小程序内
		watch: {
			data(val) {
				this.cart = val
				this.$forceUpdate()
			}
		},
		methods: {
			confirm() {
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.cart)
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
			specification(goods) {
				let string = ''
				if (goods.spec_name_1) {
					string += goods.spec_name_1 + ':' + goods.spec_1
				}
				if (goods.spec_name_2) {
					string += ' ' + goods.spec_name_2 + ':' + goods.spec_2
				}
				return string
			},
			changeQty(item, type) {
				// 如不使用反射函数，在小程序端父页面值没有更新
				this.$emit('change', item, type)

				if (this.cart.total <= 0 || (type == 'minus' && (this.cart.total <= 1))) {
					this.popup.close()
				}
			}
		}
	}
</script>
<style>
	.image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 10rpx;
	}

	.quantity {
		border: 0;
		width: 60rpx;
		background-color: #F2F2F2;
		margin: 5rpx 10rpx 0 10rpx;
		padding: 6rpx 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
	}
</style>
