<template>
	<view>
		<view class="uni-flex uni-column pb10 uni-center">
			<view class="mt10 pt10 ml10 mr10"><text class="ml10 mr10 line-clamp-2 l-h20">{{orderInfo.title}}</text>
			</view>
			<view class="amount uni-bold">{{orderInfo.amount|currency}}</view>
		</view>
		<view class="pl10 pr10 bgf payee">
			<view class="uni-flex uni-row pd10 f-14 width-between">
				<text class="f-gray">收款方</text>
				<text class="line-clamp-1">{{orderInfo.payee}}</text>
			</view>
		</view>
		<view class="pt10">
			<view v-on:click="wxpay" class="mybutton pt10 pb10 f-white f-16 ml10 mr10 mt10">立即支付</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './pay.js'
	export default {
		data() {
			return {
				orderInfo: {
					title: '',
					amount: 0,
					payee: 'shopwind'
				},
				jsApiParameters: {}
			}
		},
		methods: {
			wxpay() {
				model.wxpay(this)
			}
		},
		onLoad(options) {
			model.wxpaybuild(this, options)
		},
		onShow() {
			util.verifyLogin(true, false)
		}
	}
</script>
<style scoped>
	.amount {
		height: 200rpx;
		font-size: 80rpx;
	}

	.payee {
		border-top: 2rpx #dedede solid;
		border-bottom: 2rpx #dedede solid;
		margin-bottom: 30rpx;
		padding: 2rpx 0;
	}

	.mybutton {
		border-radius: 10rpx;
		background: #57be6a;
	}
</style>
