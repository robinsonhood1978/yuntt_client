<template>
	<view>
		<view @click="close" @touchmove.stop.prevent="" class="mask">
			<view v-if="coupons.length > 0" @click.stop="" class="bgf top-round-edge pt5 pb10 wraper" :style="style">
				<uni-icons type="closeempty" size="44" class="ml10 absolute pt5" v-on:click="close"></uni-icons>
				<view class="uni-bold uni-center f-16 pt10 pb10">领取优惠券</view>
				<scroll-view scroll-x="false" scroll-y="true" style="height: 800rpx;">
					<view class="uni-flex uni-row mt10 ml10 mr10 item" v-for="(item, index) in coupons" :key="index">
						<view class="pd10 f-red width-surplus">
							<view class="f-18 uni-bold">{{item.coupon_value|currency}}</view>
							<view class="l-h20">满 {{item.min_amount|currency('', 0)}} 元使用</view>
							<view class="f-12 l-h20">有效期 {{item.end_time}}</view>
						</view>
						<view class="uni-center ml10 mr10 pl10 f-red uni-bold receive" v-on:click="receive($event, item)">点击领取</view>
					</view>
				</scroll-view>
				<view class="uni-center f-white ml10 mr10 uni-bold f-15 mybutton" v-on:click="close">完成</view>
			</view>
		</view>
	</view>
</template>

<script>
	import model from './coupon.js'
	export default {
		data() {
			return {
				store_id: 0,
				coupons: [],
				style: ''
			}
		},
		methods: {
			close() {
				uni.navigateBack()
			},
			receive: function(e, coupon) {
				model.receive(this, coupon)
			}
		},
		onLoad: function(options) {
			this.store_id = options.store_id
			model.coupons(this)
		}
	}
</script>
<style scoped>
	@import url("./coupon.css");
</style>
<style>
	page {
		background: transparent;
	}
</style>
