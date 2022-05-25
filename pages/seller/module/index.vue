<template>
	<view>
		<view class="round-edge bgf ml10 mr10 pd10 mt10">
			<text class="f-gray">基础功能</text>
			<view class="uni-flex uni-row pt10 pb10 basic" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<navigator url="/pages/seller/goods/build" class="uni-flex uni-column uni-center mt10 mb10 item">
					<text class="icon f-20 uni-bold">+</text>
					<text class="mt10 uni-bold">新增商品</text>
				</navigator>
				<navigator url="/pages/seller/goods/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconshangpin f-red"></text>
					<text class="uni-bold">商品列表</text>
				</navigator>
				<navigator url="/pages/seller/order/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconicon_order f-blue"></text>
					<text class="uni-bold">订单管理</text>
				</navigator>
				<navigator url="/pages/seller/refund/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconshouhou f-green"></text>
					<text class="uni-bold">售后</text>
				</navigator>
				<view class="uni-flex uni-column uni-center mb10 relative item">
					<text class="absolute">即将上线</text>
					<text class="iconfont iconshuju" style="color: #998774;"></text>
					<text class="uni-bold">店铺数据</text>
				</view>
			</view>
		</view>
		<view class="round-edge bgf ml10 mr10 pd10 mt10">
			<text class="f-gray">店铺管理</text>
			<view class="uni-flex uni-row pt10 pb10 basic" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<navigator url="/pages/seller/store/setting" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconhuaban f-blue"></text>
					<text class="uni-bold">店铺设置</text>
				</navigator>
				<navigator url="/pages/seller/store/location" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconziyuan"></text>
					<text class="uni-bold">店铺位置</text>
				</navigator>
				<view class="uni-flex uni-column uni-center mb10 relative item">
					<text class="absolute">即将上线</text>
					<text class="iconfont icondaishouhuo" style="color: #998774;"></text>
					<text class="uni-bold">运费模板</text>
				</view>
			</view>
		</view>
		<view class="round-edge bgf ml10 mr10 pd10 mt10">
			<text class="f-gray">营销工具</text>
			<view class="uni-flex uni-row pt10 pb10 basic" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<navigator url="/pages/seller/coupon/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconyouhuiquan f-yellow"></text>
					<text class="uni-bold">优惠券</text>
				</navigator>
				<navigator url="/pages/seller/limitbuy/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconlishi- f-red"></text>
					<text class="uni-bold">限时抢购</text>
				</navigator>
				<navigator url="/pages/seller/teambuy/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconpintuan2 f-red"></text>
					<text class="uni-bold">拼团</text>
				</navigator>
				<view class="uni-flex uni-column uni-center mb10 relative item">
					<text class="absolute">即将上线</text>
					<text class="iconfont icondapeitaocan" style="color: #998774;"></text>
					<text class="uni-bold">搭配购</text>
				</view>
				<navigator url="/pages/seller/fullprefer/build" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconyue1 f-blue"></text>
					<text class="uni-bold">满优惠</text>
				</navigator>
				<navigator url="/pages/seller/fullfree/build" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconbaoyou f-green"></text>
					<text class="uni-bold">满包邮</text>
				</navigator>
				<navigator url="/pages/seller/distribute/list" class="uni-flex uni-column uni-center mb10 item">
					<text class="iconfont iconshezhi1 f-red"></text>
					<text class="uni-bold">分销</text>
				</navigator>
			</view>
		</view>
		<view class="pb10"></view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {

			}
		},
		onLoad: function(options) {},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>
<style scoped>
	.basic .item {
		width: 33.333%;
		border-radius: 10rpx;
		padding: 20rpx 0;
	}

	.basic .item .icon {
		color: #fc2b34;
		border: 4rpx #fc2b34 solid;
		width: 50rpx;
		height: 50rpx;
		line-height: 44rpx;
		margin: 10rpx auto 10rpx;
	}

	.basic .item .iconfont {
		font-size: 66rpx;
		margin: 0 auto;
	}

	.basic .item .absolute {
		background-color: #fdf3f1;
		color: #fc2b34;
		padding: 0 10rpx;
		right: 0;
		top: 0;
		font-size: 20rpx;
		border-radius: 6rpx;
	}
</style>
