<template>
	<view>
		<view v-if="cart.total > 0" class="uni-flex uni-column ml10 mr10 mt10 bgf round-edge">
			<view class="uni-flex uni-row width-between pd10">
				<view class="uni-flex uni-row f-16">{{pickuptime}}</view>
			</view>
			<view v-if="goods.quantity > 0" class="uni-flex uni-row width-between pt10 pb10 ml10 mr10 bt"
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
		</view>
		<view v-else class="cart-empty">
			<view class="uni-center title pb10">
				<view class="iconfont icongouwuche3 f-gray flex-center empty-icons" style="padding-top: 60rpx;"></view>
				<view class="uni-text-gray mb10 pb10">购物车竟然是空的！</view>
				<navigator class="enter f-white pd5" hover-class="none" url="/pages/community/index/index">去逛逛</navigator>
			</view>
		</view>
		<view class="uni-flex">
			<view class="fixed-bottom bgf box-shadow-top">
				<view class="uni-flex uni-row width-between pd10 paybill">
					<view v-on:click="showPopup($event, 'cart')" class="uni-flex uni-row flex-middle relative">
						<uni-icons type="cart" size="50"></uni-icons>
						<text class="badge f-13 absolute uni-center uni-bold">{{cart.total}}</text>
					</view>
					<view v-on:click="submit"
						class="uni-flex uni-row f-white flex-middle flex-center mybutton width-surplus"><text
							class="f-17 line-clamp-1 l-h20">{{cart.paymoney|currency}} 去支付</text>
						<uni-icons type="arrowright" color="#ffffff" size="30"></uni-icons>
					</view>
				</view>
			</view>
			<view class="bottom-placeholder"></view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import shopcart from '@/common/guideshopcart.js'
	import model from './index.js'
	export default {
		data() {
			return {
				cart: {
					list: {},
					quantity: {},
					total: 0,
					paymoney: 0
				},
				pickuptime: ''
			}
		},
		methods: {
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
			submit() {
				shopcart.submit(this)
			},
			changeQty(item, type) {
				if (item.default_spec) {
					item.spec_id = item.default_spec // 字段兼容处理
				}
				shopcart.changeQty(this, item, type)
			}
		},
		onLoad() {
			model.getPickupTime(this)
		},
		onShow() {
			shopcart.buildQty(this)
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
