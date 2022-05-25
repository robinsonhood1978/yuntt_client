<template>
	<view>
		<view v-if="cart.list" class="uni-flex uni-column ml10 mr10 mt10 bgf round-edge"
			v-for="(store, store_id) in cart.list" :key="store_id">
			<view v-if="Object.values(store.items).length > 0" class="uni-flex uni-row width-between pd10">
				<view class="uni-flex uni-row">
					<navigator :url="'/pages/store/index?id='+store.store_id" hover-class="none" class="f-16">
						{{store.store_name}}
					</navigator>
					<uni-icons type="arrowright"></uni-icons>
				</view>
				<navigator hover-class="none" :url="'/pages/popup/coupon?store_id='+store.store_id"
					v-if="store.couponReceive == 1" class="mr5 f-red">领券</navigator>
			</view>

			<view class="uni-flex uni-row pt10  ml10 mr10 mb10 bt" v-for="(goods,productid) in store.items"
				:key="productid">
				<scroll-view :scroll-x="true" :scroll-y="false">
					<view class="uni-flex uni-row">
						<view class="flex-item uni-center mr10 mb10 pb10">
							<radio v-on:click="choseitem(store_id, productid, goods.selected == 0)"
								:checked="goods.selected == 1" class="radio mt10 pt10" color="#fc2b34"></radio>
						</view>
						<navigator hover-class="none" :url="'/pages/goods/index?id='+goods.goods_id"
							class="flex-item mr10">
							<image class="image" :src="goods.goods_image" mode="widthFix"></image>
						</navigator>
						<view class="flex-item uni-flex uni-column">
							<navigator hover-class="none" :url="'/pages/goods/index?id='+goods.goods_id"
								class="flex-item mb10 line-clamp-2 l-h20">{{goods.goods_name}}</navigator>
							<view v-if="goods.specification" class="flex-item specs f-gray mb10 f-13">
								{{goods.specification}}
							</view>
							<view class="flex-item uni-flex uni-row">
								<view class="flex-item f-red width-surplus">{{goods.price|currency}}</view>
								<view class="flex-item uni-flex uni-row">
									<view class="flex-item">
										<uni-icons v-on:click="minus(goods)" type="minus" color="#d8d4c7"></uni-icons>
									</view>
									<view class="flex-item"><input v-model.number="goods.quantity"
											@blur="change($event, goods)" type="number" maxlength="5"
											class="quantity uni-center" placeholder="1" /></view>
									<view class="flex-item">
										<uni-icons v-on:click="plus(goods)" type="plus" color="#d8d4c7"></uni-icons>
									</view>
								</view>
							</view>
						</view>
						<view v-on:click="remove(goods)" class="pd10 f-white flex-middle flex-center absolute remove">
							移<br>除</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-if="!cart.list" class="cart-empty">
			<view class="uni-center title pb10">
				<view class="iconfont icongouwuche3 f-gray flex-center empty-icons" style="padding-top: 60rpx;"></view>
				<view class="uni-text-gray mb10 pb10">购物车竟然是空的！</view>
				<navigator class="enter f-white pd5" hover-class="none" url="/pages/index/index" open-type="switchTab">
					去逛逛</navigator>
			</view>
			<view class="gallery mg5 pb10">
				<view class="uni-center mb10 uni-text-gray pt5">—— <text
						class="f-16 uni-bold ml10 mr10 f-gray">猜你喜欢</text> ——</view>
				<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
					<view v-for="(item, index) in recommend" :key="index" class="item">
						<navigator :url="'/pages/goods/index?id='+item.goods_id" open-type="redirect"
							class="round-edge bgf mg5">
							<image :src="item.default_image" mode="widthFix"></image>
							<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
							<view class="uni-flex uni-row uni-common-pb mt10 width-between">
								<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
								<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>

		<!--领取优惠券组件-->
		<uni-popup ref="coupons" type="bottom" style="z-index: 999;">
			<my-popup-coupons :store_id="popup.store_id"></my-popup-coupons>
		</uni-popup>

		<view v-if="cart.list">
			<view class="fixed-bottom">
				<view class="paybill">
					<view class="uni-flex uni-row pd10">
						<view class="flex-item checkall" v-on:click="checkall">
							<radio :checked="cart.checkall" id="checkall" class="radio mr10 ml10" color="#fc2b34">
							</radio>
							<text for="checkall">全选</text>
						</view>
						<view class="flex-item"><text class="mr10">合计</text><text
								class="f-red f-14">{{cart.amount|currency}}</text></view>
						<view class="flex-item buyedge">
							<navigator url="/pages/order/normal" class="buy">买</navigator>
						</view>
					</view>
				</view>
			</view>
			<view class="fixed-space"></view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './index.js'
	export default {
		data() {
			return {
				recommend: [],
				cart: {
					amount: 0,
					checkall: false,
					list: [],
				},
				popup: {
					store_id: 0
				}
			}
		},
		methods: {
			minus(item) {
				model.change(this, item, 'minus')
			},
			plus(item) {
				model.change(this, item, 'plus')
			},
			change(e, item) {
				model.change(this, item, 'change', e.detail.value)
			},
			remove(item) {
				model.remove(this, item)
			},
			choseitem(store_id, productid, selected) {
				model.choseitem(this, store_id, [productid], selected)
			},
			checkall() {
				model.checkall(this)
			},
			showPopup(e, popup, value) {
				if (value) {
					this.popup.store_id = Number(value)
				}
				return this.$refs[popup].open()
			},
		},
		onShow() {
			if (util.verifyLogin(true, false, true)) {
				model.cart(this)
			}
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
