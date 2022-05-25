<template>
	<view>
		<view class="uni-flex uni-column bgf">
			<view class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5">手机号</text>
				<input class="f-15 pt5 pb5" v-model="phone_mob" placeholder="输入新手机号" maxlength="11" type="number" />
			</view>
			<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt flex-middle">
				<view class="uni-flex uni-row width-surplus flex-middle">
					<text class="f-15 mr10 pt5 pb5">验证码</text>
					<input class="f-15 pt5 pb5" v-model="verifycode" placeholder="输入短信验证码" maxlength="6" type="number" />
				</view>
				<text v-if="!sendsms" v-on:click="sendcode" class="f-red pt5 pb5 mr5">获取验证码</text>
				<text v-else class="f-gray pt5 pb5 mr5">{{seconds}}秒后重发</text>
			</view>
		</view>
		<view class="f-white uni-center f-15 ml10 mr10 pt10">
			<view v-on:click="submit" class="mybutton mt10 uni-bold f-15">保存</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './phone.js'
	export default {
		data() {
			return {
				phone_mob: '',
				verifycode: '',
				seconds: 120,
				sendsms: false
			}
		},
		methods: {
			sendcode: function() {
				model.sendcode(this)
			},
			submit: function() {
				model.phone(this)
			}
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		}
	}
</script>
<style scoped>
</style>
