<template>
	<view>
		<view class="gallery"
			:style="{'--bgcolor': options.bgcolor||'#ffefe9', '--txtcolor': options.txtcolor||'#fc2b34', '--background': options.background, '--space': options.space + 'px'}">
			<view class="wraper pl10 pr10">
				<view v-for="(item,index) in gallery" :key="index"
					:class="['uni-flex uni-row pd10 width-between item', index == 0 ? '': 'mt5']">
					<view class="lp pl10 width-surplus">
						<view class="f-18">{{item.coupon_value|currency}}</view>
						<view class="f-12 mt5">满{{item.min_amount|currency('', 0)}}元可用</view>
					</view>
					<view class="rp uni-center mt5">
						<text v-on:click="receive(item)" class="ml10 pl10 mr10 f-13">立即领取</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import server from '@/common/server.js'
	export default {
		name: 'MyBlock',
		props: {
			options: {
				type: Object / String,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				gallery: []
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				let that = this

				let params = {
					page_size: that.options.quantity
				}
				if (that.options.source == 'choice') {
					params.items = that.options.items
					if (params.items) {
						params.page_size = (params.items).split(',').length
					}
				}
				server.request('coupon/list', params, function(res) {
					if (res.code == 0) {
						that.gallery = res.data.list
					}
				})
			},
			receive(coupon) {
				server.request('coupon/receive', {
					coupon_id: coupon.coupon_id
				}, function(res) {
					if (res.code == 0) {
						uni.showToast({
							title: "领取成功"
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				}, false)
			},
		}
	}
</script>
<style>
	.gallery {
		padding-top: var(--space);
		padding-bottom: var(--space);
		background: var(--background);
	}

	.gallery .wraper .item {
		width: calc(100% - 40rpx);
		border-radius: 16rpx;
		background-color: var(--bgcolor);
		color: var(--txtcolor);
	}

	.gallery .wraper .item .rp {
		border-left: 2rpx #fc2b34 dashed;
		border-left-color: var(--txtcolor);
		height: 100rpx;
		line-height: 100rpx;
	}
</style>
