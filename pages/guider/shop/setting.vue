<template>
	<view>
		<view class="round-edge bgf ml10 mr10 mt10">
			<view v-on:click="upload('banner')" class="uni-flex uni-row pd10 width-between flex-middle">
				<view class="uni-flex uni-row width-surplus banner">
					<image :src="guideshop.banner+'?t='+random" mode="scaleToFill"></image>
					<view class="uni-flex uni-column f-gray ml10 mt5 f-15">
						<view>点此修改门店招牌</view>
						<text>门店名：{{guideshop.name}}</text>
					</view>
				</view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
			<view class="uni-flex width-between pd10 bt f-16">
				<text>门店店名</text>
				<view class="uni-flex uni-row">
					<view class="f-16">{{guideshop.name}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
			<view v-on:click="location" class="uni-flex width-between pd10 bt f-16">
				<text>地理坐标</text>
				<view class="uni-flex uni-row">
					<view class="f-16 f-gray">更改位置经纬度</view>
					<uni-icons type="arrowright" color="gray"></uni-icons>
				</view>
			</view>
		</view>
		<view class="round-edge bgf ml10 mr10 mt10">
			<view class="uni-flex width-between pd10 bt f-16">
				<text>门店店长</text>
				<view class="uni-flex uni-row">
					<view class="f-16">{{guideshop.owner}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
			<view class="uni-flex width-between pd10 bt f-16">
				<text>联系电话</text>
				<view class="uni-flex uni-row">
					<view class="f-16">{{guideshop.phone_mob}}</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
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
				guideshop: {}
			}
		},
		methods: {
			upload(field) {
				model.upload(this, field)
			},
			location() {
				let that = this
				uni.chooseLocation({
					latitude: that.guideshop.latitude,
					longitude: that.guideshop.longitude,
					success(res) {
						let param = {
							latitude: res.latitude,
							longitude: res.longitude
						}
						model.submit(that, param)
						Object.assign(that.guideshop, param)
					}
				})
			}
		},
		onShow() {
			this.random = new Date().getTime()
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.guideshop(this)
			}
		}
	}
</script>
<style scoped>
	.banner image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
	}
</style>
