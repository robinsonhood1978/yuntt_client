<template>
	<view>
		<view class="relative bgp">
			<view v-for="(block, index) in floors" :key="index">
				<view v-if="block.name == 'df_searchbox'">
					<my-block-searchbox :options="block.options"></my-block-searchbox>
				</view>
				<view v-if="block.name == 'df_category'">
					<my-block-category :options="block.options"></my-block-category>
				</view>
				<view v-if="block.name == 'df_swiper'">
					<my-block-swiper :options="block.options"></my-block-swiper>
				</view>
				<view v-if="block.name == 'df_mainnav'">
					<my-block-mainnav :options="block.options"></my-block-mainnav>
				</view>
				<view v-if="block.name == 'df_titlebar'">
					<my-block-titlebar :options="block.options"></my-block-titlebar>
				</view>
				<view v-if="block.name == 'df_rubikcube'">
					<my-block-rubikcube :options="block.options"></my-block-rubikcube>
				</view>
				<view v-if="block.name == 'df_imagead'">
					<my-block-imagead :options="block.options"></my-block-imagead>
				</view>
				<view v-if="block.name == 'df_goodslist'">
					<my-block-goodslist :options="block.options" ref="goods"></my-block-goodslist>
				</view>
				<view v-if="block.name == 'df_coupon'">
					<my-block-coupon :options="block.options"></my-block-coupon>
				</view>
				<view v-if="block.name == 'df_limitbuy'">
					<my-block-limitbuy :options="block.options"></my-block-limitbuy>
				</view>
				<view v-if="block.name == 'df_teambuy'">
					<my-block-teambuy :options="block.options"></my-block-teambuy>
				</view>
				<view v-if="block.name == 'df_notice'">
					<my-block-notice :options="block.options"></my-block-notice>
				</view>
				<view v-if="block.name == 'df_textbox'">
					<my-block-textbox :options="block.options"></my-block-textbox>
				</view>
				<view v-if="block.name == 'df_blank'">
					<my-block-blank :options="block.options"></my-block-blank>
				</view>
				<view v-if="block.name == 'df_horzline'">
					<my-block-horzline :options="block.options"></my-block-horzline>
				</view>
			</view>

			<view v-if="!logined" class="bottom-placeholder">
				<view class="fixed-bottom mb10">
					<view class="uni-flex uni-row width-between ml10 mr10 flex-middle loginplease">
						<text class="f-white f-13 uni-bold">登录开启品质生活</text>
						<navigator class="f-white mybutton f-12 uni-bold" url="/pages/login/login" hover-class="none">
							立即开通
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed-bottom-placeholder"></view>
	</view>
</template>
<script>
	import util from '@/common/util.js'
	import model from './index.js'
	import server from '@/common/server.js'

	export default {
		data() {
			return {
				logined: false,
				floors: []
			}
		},
		methods: {

		},
		created() {
			model.floors(this)
		},
		onLoad: function(options) {
			// 用户协议
			// #ifdef APP-PLUS
			let accord = uni.getStorageSync('accessAgreePolicy') || false
			if (!accord) {
				uni.navigateTo({
					url: '/pages/accord/index'
				})
			}
			// #endif

			let default_currency = uni.getStorageSync('default_currency') || false
			if (!default_currency) {
				server.request('article/currency', {}, function(res) {
					if (res.code == 0) {
						console.log('addr type:', res.data.address_type)
						uni.setStorageSync('default_currency', res.data.price_currency)
						uni.setStorageSync('address_type', res.data.address_type)
					}
				})
			}
		},
		onShow: function() {
			if (util.verifyLogin(false)) {
				this.logined = true
			}
		},
		onReachBottom() {
			this.$refs.goods[0].getData(false)
		},
		onShareAppMessage(res) {
			return model.shareBody(this)
		},
		onShareTimeline(res) {
			return model.shareBody(this)
		}
	}
</script>
<style>
	page {
		/* 解决下拉后，顶部出现的白边 */
		/* #ifdef MP */
		background-color: transparent;
		/* #endif */
	}

	.loginplease {
		background: rgba(0, 0, 0, 0.7);
		border-radius: 90rpx;
		padding: 14rpx 16rpx 14rpx 40rpx;
		margin: 0 40rpx;
	}

	.loginplease .mybutton {
		background-image: linear-gradient(to right, #f12d8c, #f13257);
		padding: 10rpx 20rpx;
	}

	.bottom-placeholder {
		height: 120rpx;
	}
</style>
