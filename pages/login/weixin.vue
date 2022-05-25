<template>
	<view>
		<view class="uni-flex uni-column portrait uni-center flex-center mt10 mb10">
			<image src="@/static/images/default_user_portrait.gif" mode="scaleToFill"></image>
		</view>
		<view class="f-gray uni-center mb10 f-15">点击后，同步微信头像信息</view>
		<button open-type="getUserInfo" @getuserinfo="getuserinfo" class="ml10 mr10 mt10 mb10 f-16 f-white uni-center mybutton">微信用户一键登录</button>
		<!-- <button open-type="getPhoneNumber" @getphonenumber="getuserinfo" class="ml10 mr10 mt10 mb10 f-16 f-white uni-center mybutton">微信用户一键登录</button> -->
		<!--参考https://ask.dcloud.net.cn/article/37452-->
	</view>
</template>

<script>
	import model from './login.js'
	export default {
		data() {
			return {
				code: '',
				logintype: 'weixin'
			}
		},
		methods: {
			getuserinfo: function(res) {
				if (res.detail.errMsg.indexOf('getUserInfo:ok') > -1) {
					let userInfo = res.detail.userInfo
					let params = {
						'wxcode': this.code,
						logintype: this.logintype,
						portrait: userInfo.avatarUrl,
						nickname: userInfo.nickName
					}
					model.login(params)
				}
				else if(res.detail.errMsg.indexOf('getUserInfo:fail auth deny') > -1) {
					uni.showModal({
						title: '提示',
						content: '抱歉！您需要同意授权后，才能登录',
						showCancel: false
					})
				}
				else {
					uni.showModal({
						title: '提示',
						content: res.detail.errMsg,
						showCancel: false
					})
				}
			}
		},
		onLoad: function(options) {
			this.code = options.code
		}
	}
</script>

<style scoped>
	.portrait {
		margin: 150rpx 0 80rpx 0;
	}

	.portrait image {
		width: 260rpx;
		height: 260rpx;
		border-radius: 100%;
		margin: 0 auto;
		background-color: #FAFAFA;
		/* border: 2rpx #DDDDDD solid; */
	}

	.mybutton {
		border-radius: 60rpx;
		background-image: linear-gradient(to right, #05ce01, #04BE02);
		width: 500rpx;
		margin: 50rpx auto;
		padding: 6rpx 0;
	}

	.mybutton::after {
		border: none;
	}
</style>
