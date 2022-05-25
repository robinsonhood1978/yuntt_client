<template>
	<view>
		<view class="ml10 mr10 mt10 mb10 round-edge pb10 f-white deposit">
			<view class="uni-center amount">{{deposit.money|currency}}</view>
			<navigator url="/pages/deposit/frozen/frozen" hover-class="none" class="uni-center pb10 mb5"><text>{{deposit.frozen||'0.00'}}元不可用</text>
				<uni-icons type="arrowright" color="#ffffff" size="26"></uni-icons>
			</navigator>
		</view>
		<view class="ml10 mr10 bgf round-edge tools">
			<navigator url="/pages/deposit/trade/trade" hover-class="none" class="uni-flex uni-row flex-middle pd10">
				<text class="iconfont iconiconsvgtixianjilu mr10 ml5" style="font-size: 78rpx;color: #2aae67;"></text>
				<view class="width-surplus ml10">
					<view class="f-16">交易记录</view>
					<text class="f-gray">资金账户：{{deposit.account}}</text>
				</view>
				<uni-icons type="arrowright" size="40" color="gray"></uni-icons>
			</navigator>
			<navigator url="/pages/deposit/record/record" hover-class="none" class="uni-flex uni-row flex-middle bt pd10">
				<text class="iconfont iconjifen mr10 ml5" style="color: #ffc619;"></text>
				<view class="width-surplus ml10">
					<view class="f-16">财务明细</view>
					<text class="f-gray">账户余额的收支明细记录</text>
				</view>
				<uni-icons type="arrowright" size="40" color="gray"></uni-icons>
			</navigator>
		</view>
		<view class="ml10 mr10 bgf round-edge mt10 tools">
			<navigator url="/pages/deposit/setting/setting" hover-class="none" class="uni-flex uni-row flex-middle pd10 mt10">
				<text class="iconfont iconshezhi mr10 ml5" style="color: #4685af;"></text>
				<view class="width-surplus ml10">
					<view class="f-16">账户管理</view>
					<text class="f-gray">修改支付密码，开启/关闭余额支付</text>
				</view>
				<uni-icons type="arrowright" size="40" color="gray"></uni-icons>
			</navigator>
			<navigator url="/pages/bank/list" hover-class="none" class="uni-flex uni-row flex-middle bt pd10">
				<text class="iconfont iconqia mr10 ml5" style="color: #ff570a;"></text>
				<view class="width-surplus ml10">
					<view class="f-16">银行卡</view>
					<text class="f-gray">提现银行卡的绑定/解绑</text>
				</view>
				<uni-icons type="arrowright" size="40" color="gray"></uni-icons>
			</navigator>
		</view>
		<view class="uni-flex uni-row flex-middle width-between pb10 pt10 buttons">
			<navigator url="/pages/deposit/drawal/drawal" hover-class="none" class="uni-center uni-bold f-white round-edge ml10 pt5 pb5 item">提现</navigator>
			<navigator url="/pages/deposit/recharge/recharge" hover-class="none" class="uni-center uni-bold f-white round-edge mr10 pt5 pb5 item recharge">充值</navigator>
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
				deposit: {
					money: 0
				}
			}
		},
		onShow: function() {
			if(util.verifyLogin(true, false)) {
				model.deposit(this)
			}
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
