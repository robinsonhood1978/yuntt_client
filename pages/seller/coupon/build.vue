<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">券名称</text>
				<input v-model="coupon.coupon_name" class="width-surplus" />
				<uni-icons v-on:click="clearInput($event, 'coupon_name')" v-show="coupon.coupon_name" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">消费满</text>
				<input v-model="coupon.min_amount" class="width-surplus" type="digit" placeholder="XX元" />
				<uni-icons v-on:click="clearInput($event, 'min_amount')" v-show="coupon.min_amount" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">减金额</text>
				<input v-model="coupon.coupon_value" class="width-surplus" type="digit" placeholder="XX元" />
				<uni-icons v-on:click="clearInput($event, 'coupon_value')" v-show="coupon.coupon_value"
					type="closeempty" class="ml10" color="gray"></uni-icons>
			</view>
		</view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">开始时间</text>
				<uni-datetime-picker class="width-surplus" :border="false" v-model="coupon.start_time" type="datetime">
					<view class="uni-flex uni-row width-between">
						<text></text>
						<view><text class="f-16 f-gray">{{coupon.start_time||'设置开始时间'}}</text>
							<uni-icons type="arrowright" color="gray"></uni-icons>
						</view>
					</view>
				</uni-datetime-picker>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">结束时间</text>
				<uni-datetime-picker class="width-surplus" :border="false" v-model="coupon.end_time" type="datetime">
					<view class="uni-flex uni-row width-between">
						<text></text>
						<view><text class="f-16 f-gray">{{coupon.end_time||'设置结束时间'}}</text>
							<uni-icons type="arrowright" color="gray"></uni-icons>
						</view>
					</view>
				</uni-datetime-picker>
			</view>
		</view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">发行张数</text>
				<input v-model="coupon.total" class="width-surplus" type="number" />
				<uni-icons v-on:click="clearInput($event, 'total')" v-show="coupon.total" type="closeempty" class="ml10"
					color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10 width-surplus">支持领取</text>
				<switch :checked="coupon.clickreceive == 1" v-on:change="receive" color="#F0AD4E"></switch>
			</view>
		</view>
		<view class="pd10">
			<view v-on:click="submit" class="mybutton f-white f-16 mt10">保存提交</view>
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
				coupon: {
					start_time: '',
					end_time: ''
				}
			}
		},
		methods: {
			submit() {
				model.submit(this)
			},
			clearInput(e, field) {
				this.coupon[field] = ''
			},
			receive(e) {
				this.coupon.clickreceive = e.detail.value ? 1 : 0
			}
		},
		onLoad(options) {
			this.id = options.id || 0
			model.coupon(this)
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', util.getUrl())
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>

<style scoped>
	.mybutton {
		border-radius: 20rpx;
	}

	.datetime {
		font-size: 42rpx;
	}
</style>
