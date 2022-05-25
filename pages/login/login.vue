<template>
	<view>
		<my-nav-bar>
			<view class="uni-flex uni-row width-between flex-middle">
				<uni-icons class="ml10" v-on:click="pageback" type="closeempty" size="52"></uni-icons>
				<!-- #ifndef MP -->
				<view class="mr10">
					<uni-icons class="mr5" v-on:click="showPopup($event, 'morenav')" type="more-filled" size="52">
					</uni-icons>
					<uni-popup ref="morenav" type="dialog">
						<my-popup-morenav></my-popup-morenav>
					</uni-popup>
				</view>
				<!-- #endif -->
			</view>
		</my-nav-bar>
		<view class="form">
			<view class="uni-flex uni-column mb10">
				<image class="logo" src="/static/images/logo.png" mode="widthFix"></image>
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
							<text>未注册手机验证后自动注册，我已阅读并同意</text>
						</label>
						<navigator url="/pages/article/view?id=5" hover-class="none" class="f-blue">《用户协议》</navigator> 和
						<navigator url="/pages/article/view?id=6" hover-class="none" class="f-blue">《隐私政策》</navigator>
					</view>
				</view>
				<view class="mt10">
					<view v-on:click="mblogin" class="mt10 mybutton f-white uni-center f-16">登录/注册</view>
				</view>
				<view class="mt10 pt5 f-15 f-blue uni-center">
					<text v-if="logintype == 'password'" v-on:click="changelogin($event, 'verifycode')">验证码登录</text>
					<text v-else v-on:click="changelogin($event, 'password')">账号密码登录</text>
				</view>
			</view>

			<view class="uni-flex uni-column mt10 mb10 pt10 flex-middle flex-center">
				<text class="uni-text-gray mt10 pt10 f-15">——— 合作账号登录 ———</text>
				<view class="uni-flex uni-row mt10 pt10">
					<!-- #ifdef MP-WEIXIN || APP-PLUS -->
					<view v-on:click="unilogin($event, 'weixin')" class="uni-center mt10 mr10 wxlogin">
						<uni-icons type="weixin" size="60" color="#fff"></uni-icons>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view v-on:click="unilogin($event, 'qq')" class="uni-center mt10 ml10 qqlogin">
						<uni-icons type="qq" size="60" color="#fff"></uni-icons>
					</view>
					<view v-if="platform == 'ios'" v-on:click="unilogin($event, 'apple')"
						class="uni-center mt10 ml10 applelogin">
						<view class="iconfont iconapple"></view>
					</view>
					<!-- #endif -->

					<!-- #ifdef H5 -->
					<view v-if="client == 'weixin'" v-on:click="weblogin($event, 'weixin')"
						class="uni-center mt10 mr10 wxlogin">
						<uni-icons type="weixin" size="60" color="#fff"></uni-icons>
					</view>
					<view v-if="client != 'weixin' && client != 'qq'" v-on:click="weblogin($event, 'alipay')"
						class="uni-center mt10 mr10 alipaylogin">
						<view class="iconfont alipay"></view>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<!-- #ifdef H5-->
		<view class="morenavh5" v-on:click="showPopup($event, 'morenavh5')">
			<view class="pl5 pr5 pt10 pb10 absolute f-white">快<br>捷<br>导<br>航</view>
			<uni-popup ref="morenavh5" type="dialog">
				<my-popup-morenav position="leftbottom"></my-popup-morenav>
			</uni-popup>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './login.js'
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
					logintype: this.logintype
				})
			},
			unilogin: function(e, logintype) {
				model.unilogin(this, {
					logintype: logintype
				})
			},
			// #ifdef H5
			weblogin: function(e, logintype) {
				model.weblogin(this, {
					logintype: logintype
				})
			},
			// #endif
			eyeclick: function() {
				this.eyeclose = this.eyeclose ? false : true
			},
			changelogin: function(e, logintype) {
				this.logintype = logintype
			},
			sendcode: function() {
				model.sendcode(this)
			},
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			pageback: function() {
				uni.navigateBack()
			},
			agreement: function() {
				this.accord = this.accord == 1 ? 0 : 1
			}
		},
		created() {
			this.platform = uni.getSystemInfoSync().platform

			// #ifdef H5
			this.client = util.isWechat() ? 'weixin' : (util.isQqbrowser() ? 'qq' : '')
			// #endif
		},
		onLoad: function(options) {
			// 不需要回跳，删除缓存
			util.reomveStorage('redirect', options.redirect != 'yes')
			if (util.verifyLogin(false)) {
				uni.navigateBack()
			}
		},
		onShow() {
			if (util.verifyLogin(false, false)) {
				uni.switchTab({
					url: '/pages/user/index'
				})
			}
		}
	}
</script>
<style scoped>
	@import url("./login.css");
</style>
<style>
	/* 此次放需要覆盖全局mian.css的样式  */
	page {
		background-color: #FFFFFF;
	}
</style>
