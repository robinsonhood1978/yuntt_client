<template>
	<view>
		<view class="relative">
			<view class="uni-flex uni-row fixed-top mynavbar" :style="{'opacity': navbar.opacity}">
				<my-nav-bar>
					<view class="uni-flex uni-row ml10 flex-middle">
						<navigator url="/pages/seller/store/setting" hover-class="none" class="logo">
							<image v-if="store.store_logo" :src="store.store_logo+'?t='+random" mode="scaleToFill"></image>
						</navigator>
						<view class="f-white ml10 f-16">
							<text>{{store.store_name}}</text>
						</view>
					</view>
					<!-- #ifndef MP -->
					<view class="mr10">
						<uni-icons v-on:click="chat()" type="more-filled" color="#ffffff" size="44"></uni-icons>
					</view>
					<!-- #endif -->
				</my-nav-bar>
			</view>

			<view class="uni-flex uni-column header" :style="{'padding-top': navbar.top}">
				<view class="uni-flex uni-column mb10 relative" style="z-index: 102;margin-top: 40rpx;">
					<view class="uni-flex uni-row flex-middle pd10 mt10">
						<navigator url="/pages/seller/store/setting" hover-class="none" class="logo">
							<image v-if="store.store_logo" :src="store.store_logo+'?t='+random" mode="scaleToFill"></image>
						</navigator>
						<view class="uni-flex uni-column ml10 line-clamp-2 l-h20 mr10 f-white width-surplus">
							<text class="f-20">{{store.store_name}}</text>
							<view class="flex-middle f-12">
								<text class="mr10">粉丝数 {{store.collects||0}}</text>
								<!-- #ifdef MP-->
								<text v-on:click="redirectMp(store.store_id)">进店</text>
								<uni-icons type="arrowright" size="26" color="#ffffff"></uni-icons>
								<!-- #endif -->
							</view>
						</view>
						<view v-on:click="scan()" class="plusempty uni-center mr10">
							<uni-icons type="plusempty" color="#ffffff" size="40"></uni-icons>
						</view>
					</view>
				</view>
			</view>

			<view class=" bgf ml10 mr10 pb10 mt10 round-edge orders">
				<navigator url="/pages/seller/order/list" hover-class="none"
					class="uni-flex uni-row width-between pd10"><text class="uni-bold f-15">待处理</text>
					<view>
						<text class="f-gray f-15">所有订单</text>
						<uni-icons type="arrowright" color="#cccccc"></uni-icons>
					</view>
				</navigator>
				<view class="uni-flex uni-row ml10 mr10 pt10 pb10" style="position: relative; z-index: 19;">
					<navigator url="/pages/seller/order/list?type=pending" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="uni-bold f-20">{{orders.pending||0}}</text>
						<text class="f-gray f-12 mt10">待付款</text>
					</navigator>
					<navigator url="/pages/seller/order/list?type=accepted" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="uni-bold f-20">{{orders.accepted||0}}</text>
						<text class="f-gray f-12 mt10">待发货</text>
					</navigator>
					<navigator url="/pages/seller/refund/list?status=GOING" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="uni-bold f-20">{{orders.refund||0}}</text>
						<text class="f-gray f-12 mt10">售后</text>
					</navigator>
				</view>
			</view>

			<view class="bgf ml10 mr10 pb10 round-edge mt10 sells">
				<navigator url="/pages/seller/order/list" hover-class="none"
					class="uni-flex uni-row width-between pd10 mb10">
					<view class="flex-middle">
						<text class="uni-bold f-15">本月数据</text>
						<text class="f-gray f-13 ml10">{{sells.time}}</text>
					</view>
					<uni-icons type="arrowright" color="#cccccc"></uni-icons>
				</navigator>
				<view class="uni-flex uni-row uni-center">
					<view class="uni-flex uni-column item">
						<text>支付金额</text>
						<text class="uni-bold f-20 pt5 pb5">{{sells.curr.money|currency}}</text>
						<text class="f-gray f-12">上月{{sells.last.money|currency}}</text>
					</view>
					<view class="uni-flex uni-column item">
						<text>订单数</text>
						<text class="uni-bold f-20 pt5 pb5">{{sells.curr.quantity||0}}</text>
						<text class="f-gray f-12">上月{{sells.last.quantity||0}}</text>
					</view>
					<view class="uni-flex uni-column item">
						<text>退款数</text>
						<text class="uni-bold f-20 pt5 pb5">{{sells.curr.refunds||0}}</text>
						<text class="f-gray f-12">上月{{sells.last.refunds||0}}</text>
					</view>
				</view>
			</view>

			<view class=" bgf ml10 mr10 pb10 round-edge mt10 tools mygoods">
				<navigator url="/pages/seller/goods/list" hover-class="none"
					class="uni-flex uni-row width-between pd10"><text class="uni-bold f-15">我的商品</text>
					<uni-icons type="arrowright" color="#cccccc"></uni-icons>
				</navigator>
				<view class="uni-flex uni-row ml10 mr10 pt10 pb10" style="position: relative; z-index: 19;">
					<navigator url="/pages/seller/goods/list?type=going" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="uni-bold f-20 mr10">{{goodses.onsale||0}}</text>
						<view class="f-gray f-12 mt10"><text>销售中</text>
							<uni-icons type="arrowright" size="20" color="#999999"></uni-icons>
						</view>
					</navigator>
					<navigator url="/pages/seller/goods/list?type=pending" hover-class="none"
						class="uni-flex uni-column uni-center f-13 item">
						<text class="uni-bold f-20 mr10">{{goodses.offshelf||0}}</text>
						<view class="f-gray f-12 mt10"><text>待上架</text>
							<uni-icons type="arrowright" size="20" color="#999999"></uni-icons>
						</view>
					</navigator>
					<navigator url="/pages/seller/goods/build" hover-class="none"
						class="uni-flex uni-column uni-center flex-middle f-13 item">
						<view class="plus">
							<uni-icons type="plusempty" color="#fc2b34" size="40"></uni-icons>
						</view>
						<view url="/pages/seller/goods/build" hover-class="none" class="f-gray f-12 mt10">新增商品</view>
					</navigator>
				</view>
			</view>

			<view class="uni-flex uni-column round-edge bgf pb10 ml10 mr10 mt10 mb10 tools promote">
				<navigator url="/pages/seller/module/index" hover-class="none"
					class="uni-flex uni-row flex-middle width-between pt10 pb10 ml10 mr10 f-15">
					<text class="uni-bold">营销工具</text>
					<view>
						<text class="f-gray f-15"></text>
						<uni-icons type="arrowright" color="#cccccc"></uni-icons>
					</view>
				</navigator>
				<view class="uni-flex uni-row pt10 pb10 pd5" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
					<navigator url="/pages/seller/coupon/list" hover-class="none" class="uni-center item">
						<view class="label pd10 mg5">优惠券</view>
					</navigator>
					<navigator url="/pages/seller/limitbuy/list" hover-class="none" class="uni-center item">
						<view class="label pd10 mg5">限时秒杀</view>
					</navigator>
					<navigator url="/pages/seller/teambuy/list" hover-class="none" class="uni-center item">
						<view class="label pd10 mg5">拼团</view>
					</navigator>
				</view>
			</view>
			<view class="uni-flex uni-column round-edge bgf pb10 ml10 mr10 mt10 mb10 tools school">
				<text class="f-15 pd10 uni-bold">商家成长</text>
				<view class="uni-flex uni-row pt10 pb10 pd5" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
					<view class="item">
						<navigator url="/pages/article/webview?href=https://www.shopwind.net/product/guide.html"
							class="label pd10 uni-center">商家学堂</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/article/webview?href=https://www.shopwind.net/forum/portal.html"
							class="label pd10 uni-center">商家社区</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/article/webview?href=https://www.shopwind.net/forum/gid-14528-1.html"
							class="label pd10 uni-center">常见问题</navigator>
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
				navbar: {
					top: 0,
					opacity: 0
				},
				goodses: {
					onsale: 0,
					offshelf: 0
				},
				orders: {
					pending: 0,
					accepted: 0,
					refund: 0
				},
				store: {},
				sells: {
					time: '',
					curr: {},
					last: {}
				}
			}
		},
		methods: {
			scan() {
				// #ifdef APP-PLUS || MP
				return util.scanCode(this)
				// #endif
			},
			chat() {
				uni.showModal({
					title: '提示',
					content: '有任何问题，请联系平台客服(QQ:561223725)处理！',
					showCancel: false
				})
			},
			redirectMp(id) {
				util.redirectMp('pages/store/index?id=' + id)
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
			this.random = new Date().getTime()
			model.store(this)
			model.orders(this)
			model.goodses(this)
			model.sells(this)
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
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
