<template>
	<view>
		<view class="ml10 mr10 mt10 mb10 round-edge pb10 f-white integral">
			<view class="uni-center amount">{{integral.amount||'0.00'}}</view>
			<navigator url="/pages/my/integral/list?type=frozen" hover-class="none" class="uni-center pb10 mb5"><text>{{integral.frozen||0}}个积分不可用</text>
				<uni-icons type="arrowright" color="#ffffff" size="26"></uni-icons>
			</navigator>
		</view>
		<view class="ml10 mr10 bgf round-edge tools">
			<navigator url="/pages/my/integral/list" hover-class="none" class="uni-flex uni-row flex-middle pd10">
				<text class="iconfont iconiconsvgtixianjilu mr10 ml5" style="font-size: 78rpx;color: #2aae67;"></text>
				<view class="width-surplus ml10">
					<view class="f-16">积分明细</view>
					<text class="f-gray">积分收入/支出记录</text>
				</view>
				<uni-icons type="arrowright" size="40" color="gray"></uni-icons>
			</navigator>
		</view>
		<view class="ml10 mr10 bgf round-edge tools">
			<navigator url="/pages/integral/goods" hover-class="none" class="uni-flex uni-row flex-middle mt10 pd10">
				<text class="iconfont iconjifen mr10 ml5" style="color: #ffc619;"></text>
				<view class="width-surplus ml10">
					<view class="f-16">花积分</view>
					<text class="f-gray">使用积分换购您喜欢的商品</text>
				</view>
				<uni-icons type="arrowright" size="40" color="gray"></uni-icons>
			</navigator>
		</view>
		<view class="uni-flex uni-row flex-middle pb10 pt10 buttons">
			<view v-on:click="signIntegral" class="uni-center uni-bold f-white width-surplus mybutton f-16 pt5 pb5 ml10 mr10">点击可领取{{integral.signIntegral}}积分</view>
		</view>
		<view class="fixed-space"></view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import  model from './index.js'
	export default {
		data() {
			return {
				integral: {
					amount: 0
				}
			}
		},
		methods: {
			signIntegral: function() {
				model.signIntegral(this)
			}
		},
		onShow: function() {
			if(util.verifyLogin(true, this.$mp.page.route)) {
				model.integral(this)
			}
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
