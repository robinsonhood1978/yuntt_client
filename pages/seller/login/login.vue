<template>
	<view>
		<view class="form" style="margin-top: 140rpx;">
			<view class="uni-flex uni-column mb10">
				<image class="logo" src="/static/images/sellerlogo.png" mode="widthFix"></image>
			</view>
			<view class="uni-flex uni-column pt10">
				<view class="uni-flex uni-row flex-middle pt10 pb10 mt10 item">
					<view class="f-18 mr5" style="margin-top: 4rpx;">
						<text>+86</text>
						<uni-icons type="arrowright"></uni-icons>
					</view>
					<input v-model="phone_mob" class="flex-middle" placeholder-class="placeholder" type="number"
						maxlength="11" placeholder="请输入手机号" />
					<uni-icons v-on:click="clearInput" v-show="phone_mob" type="closeempty" size="38" class="mr10">
					</uni-icons>
				</view>
				<view v-if="logintype == 'password'" class="uni-flex uni-row flex-middle pt10 pb10 mt10 item">
					<input v-model="password" maxlength="20" class="flex-middle" :password="eyeclose"
						placeholder-class="placeholder" placeholder="请输入密码" />
					<text v-on:click="eyeclick"
						:class="['iconfont f-gray uni-bold mr10 ml10', eyeclose ? 'iconicon-eye-close' : 'iconyanjing1']"></text>
				</view>
				<view v-else class="uni-flex uni-row flex-middle pt10 pb10 mt10 item">
					<input v-model="verifycode" maxlength="20" class="flex-middle" placeholder-class="placeholder"
						placeholder="请输入短信验证码" />
					<text v-if="!sendsms" v-on:click="sendcode" :class="['iconfont ml10 f-red']">获取验证码</text>
					<text v-else :class="['iconfont ml10 f-gray']">{{seconds}}秒后重发</text>
				</view>
				<view class="mt10 pt5 f-gray f-13">
					<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
						<label v-on:click="agreement">
							<checkbox :checked="accord == 1" style="transform:scale(0.7)"></checkbox>
							<text>我已阅读并同意</text>
						</label>
						<navigator url="/pages/article/view?id=5" hover-class="none" class="f-blue">《用户协议》</navigator> 和
						<navigator url="/pages/article/view?id=6" hover-class="none" class="f-blue">《隐私政策》</navigator>
					</view>
				</view>
				<view class="mt10">
					<view v-on:click="mblogin" class="mt10 mybutton f-white uni-center f-16">立即登录</view>
				</view>
				<view class="mt10 pt5 f-15 f-blue uni-center">
					<text v-if="logintype == 'password'" v-on:click="changelogin($event, 'verifycode')">验证码登录</text>
					<text v-else v-on:click="changelogin($event, 'password')">账号密码登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from '@/pages/login/login.js'
	export default {
		data() {
			return {
				phone_mob: '',
				password: '',
				verifycode: '',
				logintype: 'password',
				eyeclose: true,
				seconds: 120,
				sendsms: false,
				platform: '',
				client: '',
				accord: 0
			}
		},
		methods: {
			clearInput: function() {
				this.phone_mob = ''
			},
			mblogin: function(e) {
				model.mblogin(this, {
					logintype: this.logintype,
					checkseller: 1
				})
			},
			eyeclick: function() {
				this.eyeclose = this.eyeclose ? false : true
			},
			changelogin: function(e, logintype) {
				this.logintype = logintype
			},
			sendcode: function() {
				model.sendcode(this)
			},
			agreement: function() {
				this.accord = this.accord == 1 ? 0 : 1
			}
		},
		onLoad: function(options) {
			this.platform = uni.getSystemInfoSync().platform
		},
		onShow() {
			if (util.verifySeller(false)) {
				util.redirectUrl('/pages/seller/index/index')
			}
		}
	}
</script>
<style scoped>
	@import url("@/pages/login/login.css");
</style>
<style>
	/* 此次放需要覆盖全局mian.css的样式  */
	page {
		background-color: #FFFFFF;
	}
</style>
