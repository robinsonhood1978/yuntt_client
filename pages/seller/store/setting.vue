<template>
	<view>
		<view class="uni-flex uni-row bgf pd10 width-between flex-middle mt10">
			<view v-on:click="logo" class="uni-flex uni-row width-surplus logo">
				<image v-if="store.store_logo" :src="store.store_logo+'?t='+random" mode="scaleToFill"></image>
				<view class="uni-flex uni-column f-gray ml10 mt5 f-14">
					<view>点此修改店铺LOGO</view>
					<text>店铺名：{{store.store_name}}</text>
				</view>
			</view>
			<uni-icons type="arrowright"></uni-icons>
		</view>
		<view class="bgf mt10">
			<navigator :url="'/pages/seller/store/build?field=store_name&value='+store.store_name" hover-class="none"
				class="uni-flex width-between pd10 mt10 f-15">
				<text>店铺名称</text>
				<view class="uni-flex uni-row">
					<view class="f-15">{{store.store_name}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</navigator>
			<navigator url="/pages/seller/store/location" hover-class="none"
				class="uni-flex width-between ml10 mr10 pt10 pb10 bt f-15">
				<text style="width: 270rpx;">店铺位置</text>
				<view class="uni-flex uni-row">
					<text class="f-15 line-clamp-1 ml10 pl10">{{store.address}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</navigator>
			<navigator :url="'/pages/seller/store/build?field=tel&value='+store.tel" hover-class="none"
				class="uni-flex width-between ml10 mr10 pt10 pb10 bt f-15">
				<text>客服电话</text>
				<view class="uni-flex uni-row">
					<view class="f-15">{{store.tel}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</navigator>
			<navigator :url="'/pages/seller/store/build?field=im_qq&value='+store.im_qq" hover-class="none"
				class="uni-flex width-between ml10 mr10 pt10 pb10 bt f-15">
				<text>客服QQ</text>
				<view class="uni-flex uni-row">
					<view class="f-15">{{store.im_qq}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</navigator>
		</view>
		<view class="pt10">
			<view v-on:click="logout" class="f-15 uni-center pd10 mt10 bgf">退出登录</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './setting.js'
	export default {
		data() {
			return {
				random: '',
				store: {}
			}
		},
		methods: {
			logo() {
				model.logo(this, 'store_logo')
			},
			logout() {
				model.logout(this)
			}
		},
		onLoad(options) {
			this.random = new Date().getTime()
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}

			model.store(this)
		}
	}
</script>
<style scoped>
	.logo image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.mybutton {
		border-radius: 20rpx;
		background: #dddddd;
	}
</style>
