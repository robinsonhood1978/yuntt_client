<template>
	<view>
		<view class="relative">
			<view class="uni-flex uni-row fixed-top mynavbar" :style="{'opacity': navbar.opacity}">
				<my-nav-bar>
					<view class="uni-flex uni-row ml10 flex-middle">
						<view class="portait">
							<image v-if="visitor.portrait" :src="visitor.portrait+'?t='+random" mode="scaleToFill">
							</image>
							<image v-else src="@/static/images/default_user_portrait.gif" mode="scaleToFill"></image>
						</view>
						<view class="f-white ml10 f-16">
							<text v-if="visitor.userid">{{visitor.nickname||visitor.username}}</text>
							<navigator v-else hover-class="none" url="/pages/login/login">点击登录</navigator>
						</view>
					</view>
					<!-- #ifndef MP -->
					<view class="mr10">
						<uni-icons v-on:click="showPopup($event, 'morenav')" type="more-filled" color="#ffffff"
							size="44"></uni-icons>
						<uni-popup ref="morenav" type="dialog">
							<my-popup-morenav></my-popup-morenav>
						</uni-popup>
					</view>
					<!-- #endif -->
				</my-nav-bar>
			</view>

			<view class="uni-flex uni-column header" :style="{'padding-top': navbar.top}">
				<view class="hbg1"></view>
				<view class="hbg2"></view>
				<!-- #ifdef MP -->
				<view class="absolute" style="left: 0px; top:0; z-index: 103;">
					<my-nav-bar>
						<navigator hover-class="none" url="/pages/setting/index" class="f-white f-17 ml10">设置
						</navigator>
					</my-nav-bar>
				</view>
				<!-- #endif-->
				<view class="uni-flex uni-column mb10" style="position: relative; z-index: 102;">
					<!-- #ifdef MP -->
					<view style="height: 82rpx;"></view>
					<!-- #endif-->
					<!-- #ifndef MP -->
					<view class="uni-flex uni-row width-between pl10 pr10 pt10" style="height: 72rpx;">
						<navigator hover-class="none" url="/pages/setting/index" class="f-white f-17">设置</navigator>
						<view style="margin-top:-6rpx;">
							<uni-icons v-on:click="searchIcon" type="search" class="mr10" size="44" color="#FFFFFF">
							</uni-icons>
							<uni-icons v-on:click="categoryIcon" class="uni-bold" type="list" size="44" color="#FFFFFF">
							</uni-icons>
						</view>
					</view>
					<!-- #endif-->

					<view class="uni-flex uni-row flex-middle pd10">
						<view class="portait">
							<image v-if="visitor.portrait" :src="visitor.portrait+'?t='+random" mode="scaleToFill">
							</image>
							<image v-else src="@/static/images/default_user_portrait.gif" mode="scaleToFill"></image>
						</view>
						<view class="uni-flex uni-row ml10 line-clamp-2 l-h20 mr10 f-white f-17 width-surplus">
							<text v-if="visitor.userid">{{visitor.nickname||visitor.username}}</text>
							<navigator hover-class="none" url="/pages/login/login" v-if="!visitor.userid">点击登录
							</navigator>
						</view>
					</view>
				</view>
			</view>
			<view class=" bgf ml10 mr10 pt5 pb10 f-white round-edge remind">
				<view class="rbg1"></view>
				<view class="rbg2"></view>
				<view class="uni-flex uni-row" style="position: relative; z-index: 19;">
					<navigator url="/pages/my/favorite/goods" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="f-yellow f-16">{{favorite.goods||0}}</text>
						<text>收藏夹</text>
					</navigator>
					<navigator url="/pages/my/favorite/store" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="f-yellow f-16">{{favorite.store||0}}</text>
						<text>关注店铺</text>
					</navigator>
					<navigator url="/pages/my/footmark/goods" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="f-yellow f-16">{{footmark}}</text>
						<text>我的足迹</text>
					</navigator>
				</view>
			</view>
			<view class=" round-edge bgf ml10 mr10 mt10 pb10 orders">
				<navigator hover-class="none" url="/pages/my/order/list"
					class="uni-flex uni-row flex-middle width-between pt10 pb10 mr10 ml10 f-15"
					style="border-bottom: 2rpx #f1f1f1 solid;">
					<text>我的订单</text>
					<view>
						<text class="f-gray f-15">查看所有订单</text>
						<uni-icons type="arrowright" color="gray"></uni-icons>
					</view>
				</navigator>
				<view class="uni-flex uni-row pt10 pb10">
					<navigator hover-class="none" url="/pages/my/order/list?type=pending"
						class="uni-flex uni-column uni-center relative item">
						<text v-if="orders.pending > 0" class="badge f-12 absolute">{{orders.pending}}</text>
						<text class="iconfont icondaifukuan1 icon"></text>
						<view>待付款</view>
					</navigator>
					<navigator hover-class="none" url="/pages/my/order/list?type=accepted"
						class="uni-flex uni-column uni-center relative item">
						<text v-if="orders.accepted > 0" class="badge f-12 absolute">{{orders.accepted}}</text>
						<text class="iconfont icondaifahuo1 icon"></text>
						<view>待发货</view>
					</navigator>
					<navigator hover-class="none" url="/pages/my/order/list?type=shipped"
						class="uni-flex uni-column uni-center relative item">
						<text v-if="orders.shipped > 0" class="badge f-12 absolute">{{orders.shipped}}</text>
						<text class="iconfont icondaishouhuo1 icon"></text>
						<view>待收货</view>
					</navigator>
					<navigator hover-class="none" url="/pages/my/order/list?type=finished"
						class="uni-flex uni-column uni-center relative item">
						<text v-if="orders.evaluation > 0" class="badge f-12 absolute">{{orders.evaluation}}</text>
						<text class="iconfont icondaipingjia1 icon"></text>
						<view>待评价</view>
					</navigator>
					<navigator hover-class="none" url="/pages/my/refund/list?status=GOING"
						class="uni-flex uni-column uni-center relative item">
						<text v-if="orders.refund > 0" class="badge f-12 absolute">{{orders.refund}}</text>
						<text class="iconfont icontuikuan1 icon"></text>
						<text>退款</text>
					</navigator>
				</view>
			</view>
			<view class="uni-flex uni-column round-edge bgf pb10 ml10 mr10 mt10 tools">
				<navigator url="/pages/deposit/index/index" hover-class="none"
					class="uni-flex uni-row flex-middle width-between pt10 pb10 ml10 mr10 f-15"
					style="border-bottom: 2rpx #f1f1f1 solid;">
					<text>我的资产</text>
					<view>
						<text class="f-gray f-15">查看我的余额</text>
						<uni-icons type="arrowright" color="gray"></uni-icons>
					</view>
				</navigator>
				<view class="uni-flex uni-row pt10 pb10">
					<navigator url="/pages/deposit/index/index" hover-class="none"
						class="uni-flex uni-column uni-center item">
						<text class="iconfont iconqianbao icon"></text>
						<text>钱包</text>
					</navigator>
					<navigator url="/pages/my/coupon/list" hover-class="none"
						class="uni-flex uni-column uni-center item">
						<text class="iconfont iconyouhuiquan icon"></text>
						<text>优惠券</text>
					</navigator>
					<navigator url="/pages/my/integral/index" hover-class="none"
						class="uni-flex uni-column uni-center item">
						<text class="iconfont iconjifen icon"></text>
						<text>积分</text>
					</navigator>
					<navigator url='/pages/my/cashcard/list' hover-class="none"
						class="uni-flex uni-column uni-center item">
						<text class="iconfont iconqia icon"></text>
						<text>充值卡</text>
					</navigator>
				</view>
			</view>

			<view>
				<view v-if="visitor.userid" class="uni-flex uni-column round-edge bgf pb10 ml10 mr10 mt10 mb10 tools">
					<view class="uni-flex uni-row flex-middle width-between pt10 pb10 ml10 mr10 f-15"
						style="border-bottom: 2rpx #f1f1f1 solid;"><text>常用工具</text></view>
					<view class="uni-flex uni-row pt10 pb10" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
						<navigator v-if="guider" url="/pages/guider/index/index" hover-class="none"
							class="uni-flex uni-column uni-center item">
							<text class="iconfont iconchengweituanchang icon"></text>
							<text>团长端</text>
						</navigator>
						<navigator v-else url="/pages/guider/shop/apply" hover-class="none"
							class="uni-flex uni-column uni-center item">
							<text class="iconfont iconchengweituanchang icon"></text>
							<text>申请团长</text>
						</navigator>
						<navigator v-if="!visitor.store_id && site.store_allow == 1" url="/pages/store/apply"
							hover-class="none" class="uni-flex uni-column uni-center item">
							<text class="iconfont iconshanghupiliangruzhu icon"></text>
							<text>商家入驻</text>
						</navigator>
						<navigator url="/pages/distribute/index/index" hover-class="none"
							class="uni-flex uni-column uni-center item">
							<text class="iconfont iconshezhi1 icon"></text>
							<text>分销中心</text>
						</navigator>

						<navigator url="/pages/my/favorite/goods" hover-class="none"
							class="uni-flex uni-column uni-center item">
							<text class="iconfont iconfavor icon"></text>
							<text>我的收藏</text>
						</navigator>

						<navigator url="/pages/my/footmark/goods" hover-class="none"
							class="uni-flex uni-column uni-center item">
							<text class="iconfont iconlishi- icon"></text>
							<text>浏览历史</text>
						</navigator>
					</view>
				</view>
				<view v-if="!visitor.store_id" class="gallery mg5 pb10">
					<view class="uni-center mb10 uni-text-gray pt5">—— <text
							class="f-16 uni-bold ml10 mr10 f-gray">猜你喜欢</text> ——</view>
					<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
						<view v-for="(item, index) in recommend" :key="index" class="item">
							<navigator :url="'/pages/goods/index?id='+item.goods_id" class="round-edge bgf mg5">
								<image :src="item.default_image" mode="widthFix"></image>
								<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
								<view class="uni-flex uni-row mt5 pb5 width-between">
									<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
									<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
								</view>
							</navigator>
						</view>
					</view>
				</view>
			</view>

			<view v-if="visitor.store_id" class="uni-flex uni-column round-edge bgf pb10 ml10 mr10 mt10 mb10 tools">
				<navigator :url="'/pages/store/index?id='+visitor.store_id" hover-class="none"
					class="uni-flex uni-row flex-middle width-between pt10 pb10 ml10 mr10 f-15"
					style="border-bottom: 2rpx #f1f1f1 solid;">
					<text>商家工具</text>
					<view>
						<text class="f-gray f-15">查看我的店铺</text>
						<uni-icons type="arrowright" color="gray"></uni-icons>
					</view>
				</navigator>
				<view class="uni-flex uni-row pt10 pb10">
					<view v-on:click="redirectMp('/pages/seller/index/index')" class="uni-flex uni-column uni-center item">
						<text class="iconfont iconshezhi icon"></text>
						<text>店铺设置</text>
					</view>
					<view v-on:click="redirectMp('/pages/seller/goods/list')" class="uni-flex uni-column uni-center item">
						<text class="iconfont iconshangpin icon"></text>
						<text>商品管理</text>
					</view>
					<view v-on:click="redirectMp('/pages/seller/order/list')" class="uni-flex uni-column uni-center item">
						<text class="iconfont iconicon_order icon"></text>
						<text>订单管理</text>
					</view>
					<view v-on:click="redirectMp('/pages/seller/refund/list')" class="uni-flex uni-column uni-center item">
						<text class="iconfont iconshouhou icon"></text>
						<text>退款管理</text>
					</view>
				</view>
			</view>
			<view class="pb10"></view>
		</view>
		<view class="fixed-bottom-placeholder"></view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './index.js'
	export default {
		data() {
			return {
				random: '',
				visitor: {},
				guider: false,
				site: {
					store_allow: 0
				},
				recommend: [],
				favorite: {
					goods: 0,
					store: 0
				},
				footmark: 0,
				navbar: {
					top: 0,
					opacity: 0
				},
				orders: {
					pending: 0,
					accepted: 0,
					shipped: 0,
					evaluation: 0,
					refund: 0
				}
			}
		},
		methods: {
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			signIntegral: function() {
				model.signIntegral(this)
			},
			searchIcon: function() {
				uni.navigateTo({
					url: '/pages/search/index'
				})
			},
			categoryIcon: function() {
				uni.switchTab({
					url: '/pages/category/list'
				})
			},
			redirectMp(page) {
				// 商家端独立版
				util.redirectMp(page, util.CONFIG.seller.appId)
			}
		},
		created() {
			// #ifdef APP-PLUS
			let sysinfo = uni.getSystemInfoSync()
			this.navbar.top = sysinfo.statusBarHeight + 'px'
			// #endif

			// 该方法在支付宝小程序中无效
			// #ifdef MP
			let navbar = uni.getMenuButtonBoundingClientRect()

			// 减20是为了上下间隔不要那么大，这个值可以看情况定
			this.navbar.top = (navbar.bottom - 20) + 'px'
			// #endif
		},
		onLoad: function(options) {
			model.siteinfo(this)
			this.footmark = (uni.getStorageSync('historys') || []).length
		},
		onShow: function() {
			this.random = new Date().getTime()
			this.visitor = uni.getStorageSync('visitor') || {}
			if (!this.visitor.store_id) {
				model.recommend(this)
			}
			if (this.visitor.userid) {
				model.favorite(this)
				model.orders(this)
				model.guider(this)
			}
		},
		onPageScroll: function(e) {
			let value = e.scrollTop / 100
			// #ifdef MP
			value = e.scrollTop / 20
			// #endif
			this.navbar.opacity = value
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
