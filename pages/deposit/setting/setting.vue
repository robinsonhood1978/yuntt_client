<template>
	<view>
		<view class="uni-flex uni-row f-gray pd10">
			<text>绑定的手机号为：</text>
			<text v-if="user.phone_mob">{{user.phone_mob}}</text>
			<navigator v-else url="/pages/setting/phone" hover-class="none" class="f-blue">请先绑定手机号</navigator>
		</view>
		<view class="uni-flex uni-column bgf">
			<view class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 pr10">支付密码</text>
				<input class="f-15 pt5 pb5" password="true" v-model="password" placeholder="请输入6位数字密码" maxlength="6" type="number" />
			</view>
			<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt flex-middle">
				<text class="f-15 mr10 pt5 pb5 pr10">确认密码</text>
				<input class="f-15 pt5 pb5" password="true" v-model="confirmPassword" placeholder="再次确认支付密码" maxlength="6" type="number" />
			</view>
			<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt flex-middle">
				<view class="uni-flex uni-row width-surplus flex-middle mr10">
					<view class="f-15 mr10 pt5 pb5 pr10">验<text style="padding: 0 16rpx;">证</text>码</view>
					<input class="f-15 pt5 pb5" v-model="verifycode" placeholder="输入短信验证码" maxlength="6" type="number" />
				</view>
				<text v-if="!sendsms" v-on:click="sendcode" class="f-red pt5 pb5 mr5">获取验证码</text>
				<text v-else class="f-gray pt5 pb5 mr5">{{seconds}}秒后重发</text>
			</view>

		</view>
		<view class="uni-flex uni-row width-between pd10 bgf bt">
			<text>开启余额支付</text>
			<switch v-on:change="change" :checked="deposit.pay_status == 1" class="switch" color="#F0AD4E"></switch>
		</view>
		<view class="f-white uni-center f-15 ml10 mr10 pt10">
			<view v-on:click="submit" class="mybutton mt10 uni-bold f-15">保存</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './setting.js'
	export default {
		data() {
			return {
				user: {},
				deposit: {},
				password: '',
				confirmPassword: '',
				verifycode: '',
				seconds: 120,
				sendsms: false,
				balancepay: true
			}
		},
		methods: {
			sendcode: function() {
				model.sendcode(this)
			},
			change: function(e) {
				this.balancepay = e.detail.value
			},
			submit: function() {
				model.submit(this)
			}
		},
		onLoad: function(options) {

		},
		onShow: function() {
			if (util.verifyLogin(true, false)) {
				model.user(this)
				model.deposit(this)
			}
		}
	}
</script>
<style scoped>
	.switch {
		transform: scale(0.9);
	}
</style>
