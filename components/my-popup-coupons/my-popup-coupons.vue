<template>
	<view>
		<view v-if="coupons" class="bgf top-round-edge pt5 pb10 wraper">
			<uni-icons type="closeempty" size="44" class="ml10 absolute pt5" v-on:click="close"></uni-icons>
			<view class="uni-bold uni-center f-16 pt10 pb10">{{title}}</view>
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
</template>

<script>
	import server from '@/common/server.js'
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '领取优惠券'
			},
			beforeClose: {
				type: Boolean,
				default: false
			},
			store_id: {
				type: String / Number,
				default: 0
			}
		},
		data() {
			return {
				coupons: []
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.getCoupons()
		},
		methods: {
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			},
			receive: function(e, coupon) {
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
			getCoupons: function() {
				let that = this
				server.request('coupon/list', {
					store_id: this.store_id
				}, function(res) {
					if (res.code == 0) {
						that.coupons = res.data.list
					}
				})
			}
		}
	}
</script>
<style scoped>
	.wraper .item {
		border-radius: 16rpx;
		background-image: linear-gradient(to right, #ffefe9, #fff5f2);
	}

	.wraper .receive {
		margin: 20rpx;
		padding-top: 46rpx;
		border-left: 2rpx #ffd6cb dashed;
	}
</style>
