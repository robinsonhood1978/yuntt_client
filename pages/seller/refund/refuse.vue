<template>
	<view>
		<view class="uni-flex uni-column pd10">
			<view class="mb10 bgf wraper">
				<textarea v-on:input="oninput" class="textarea f-14" auto-height="true" placeholder="填写拒绝理由"></textarea>
			</view>
			<view v-on:click="submit" class="mybutton f-white f-15 mt10 uni-bold">提交</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './refuse.js'
	export default {
		data() {
			return {
				refund_id: 0,
				content: ''
			}
		},
		methods: {
			oninput: function(e) {
				this.content = e.detail.value
			},
			submit: function() {
				model.submit(this)
			}
		},
		onLoad: function(options) {
			this.refund_id = options.id
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', util.getUrl())
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>
<style scoped>
	.wraper {
		padding: 20rpx 20rpx 80rpx 20rpx;
		border-radius: 6rpx;
	}

	.wraper .textarea {
		width: 100%;
	}

	.mybutton {
		border-radius: 6rpx;
	}
</style>
