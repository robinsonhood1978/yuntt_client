<template>
	<view>
		<!-- #ifdef MP -->
		<my-nav-bar backgroundColor="#ededed"></my-nav-bar>
		<!-- #endif -->
		<view class="uni-flex uni-column pl10 pr10 ml10 mr10 main" :style="style">
			<!-- <view class="uni-flex uni-column mb10">
				<image class="image" src="/static/images/logo.png" mode="widthFix"></image>
			</view> -->
			<view class="uni-flex uni-column pd10 ml10 mr10 bgf round-edge wraper">
				<text class="uni-bold f-17 uni-center pt5">用户协议和隐私政策</text>
				<view class="mt10 pt5 f-gray">尊敬的用户，我们非常重视您的个人信息和隐私保护。在使用产品前，请务必仔细阅读并充分理解<text v-on:click="accord('service')" class="uni-bold f-blue">《用户协议》</text>和<text
					 v-on:click="accord('privacy')" class="uni-bold f-blue">《隐私政策》</text>的条款内容，以了解您的权益和义务。</view>
				<view class="f-gray">为向您更好的提供服务，我们会收集您的个人信息，但在未经过您的同意前，我们不会向任何第三方共享或提供您的个人信息，同时我们也会采取必要及可靠的安全措施来保护您的信息安全。如您不同意协议内容，我们将无法为您提供服务。</view>
				<view class="mt10 pt10">
					<view v-on:click="agree" class="mybutton f-white uni-center mt10 mb10 pt10">同意</view>
					<view v-on:click="disagree" class="uni-center mt10 pt10 mb10">不同意</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				style: ''
			}
		},
		methods: {
			accord: function(target) {
				if (target == 'service') {
					uni.navigateTo({
						url: '/pages/article/view?id=5'
					})
				} else {
					uni.navigateTo({
						url: '/pages/article/view?id=6'
					})
				}
			},
			agree: function() {
				uni.setStorageSync('accessAgreePolicy', true)
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			disagree: function() {
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					plus.runtime.quit()
				} else {
					const threadClass = plus.ios.importClass("NSThread")
					const mainThread = plus.ios.invoke(threadClass, "mainThread")
					plus.ios.invoke(mainThread, "exit")
					// ios11
					plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
				}
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: '提示',
					content: '您需要同意《用户协议》和《隐私政策》方可使用本软件',
					showCancel: false,
					confirmText: '我知道了'
				})
				// #endif
			}
		},
		onReady: function() {
			// if(uni.getSystemInfoSync().platform === 'android') {
			// }
			this.style = "padding-top:" + (uni.getSystemInfoSync().screenHeight - 500) + "rpx"
		}
	}
</script>

<style scoped>
	.wraper {
		margin-top: 50rpx;
		padding: 30rpx 40rpx;
	}

	.mybutton {
		width: 80%;
		margin: 0 auto;
	}

	.image {
		width: 200rpx;
		height: 200rpx;
		margin: 0 auto;
		border-radius: 30rpx;
	}
</style>
