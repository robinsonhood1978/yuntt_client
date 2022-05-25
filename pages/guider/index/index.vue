<template>
	<view>
		<view class="relative bgp">
			<view class=" mb10 pb10 profits">
				<view class="bg"></view>
				<view class="round-edge bgf ml10 mr10 pd10" style="margin-top:-240rpx;">
					<view class="uni-center pt10">
						<text>累计收益</text>
					</view>
					<view class="uni-center amount uni-bold">{{profits.amount|currency}}</view>
					<view class="uni-flex uni-row bgf round-edge ml10 mr10 pd10 mt10">
						<view class="uni-flex uni-column flex-center uni-center">
							<text class="f-20 f-red uni-bold">{{profits.yesterday|currency}}</text>
							<text class="f-gray">昨日收益</text>
						</view>
						<view class="uni-flex uni-column flex-center uni-center">
							<text class="f-20 f-red uni-bold">{{profits.lastWeek|currency}}</text>
							<text class="f-gray">上周收益</text>
						</view>
						<view class="uni-flex uni-column flex-center uni-center">
							<text class="f-20 f-red uni-bold">{{profits.currMonth|currency}}</text>
							<text class="f-gray">本月收益</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bgf round-edge ml10 mr10 pb10 relative gallery">
				<view class="uni-flex uni-row">
					<view class="ml10 mr5 flex-middle item">
						<navigator url="/pages/guider/order/list" hover-class="none"
							class="uni-flex uni-column flex-middle pd10 relative">
							<text class="iconfont iconicon_order" style="color: #7998ff;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">订单管理</view>
							</view>
							<text v-if="orders > 0"
								class="absolute badge uni-center f-white f-13 uni-bold">{{orders||0}}</text>
						</navigator>
					</view>
					<view class="ml5 mr10 flex-middle item">
						<navigator url="/pages/deposit/record/record?bizIdentity=GUIDE&title=收益明细" hover-class="none"
							class="uni-flex uni-column flex-middle mt10 pd10 relative">
							<text class="iconfont iconyue1" style="color: #ffc619;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">收益明细</view>
							</view>
							<text v-if="profits.total > 0"
								class="absolute badge uni-center f-white f-13 uni-bold">{{profits.total||0}}</text>
						</navigator>
					</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="ml10 mr5 flex-middle item">
						<navigator url="/pages/guider/shop/setting" hover-class="none"
							class="uni-flex uni-column flex-middle pd10">
							<text class="iconfont iconshangjialiebiaoicon" style="font-size: 78rpx;color: #fc2b34;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">门店管理</view>
							</view>
						</navigator>
					</view>
					<view class="ml5 mr10 flex-middle item">
						<view v-on:click="showPopup($event, 'share')" class="uni-flex uni-column flex-middle mt10 pd10">
							<text class="iconfont icontuiguangshezhi" style="color: #00aa00;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">推广门店</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 分享到弹窗-->
			<uni-popup ref="share" type="bottom" class="relative" style="z-index: 100;">
				<my-popup-share :body="share.body"></my-popup-share>
			</uni-popup>
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
				guideshop: {},
				orders: 0,
				profits: {
					amount: 0,
					total: 0,
					yesterday: 0,
					lastWeek: 0,
					currMonth: 0
				},
				share: {
					body: {}
				}
			}
		},
		methods: {
			showPopup(e, popup, item) {
				this.share.body = model.shareBody(this)
				return this.$refs[popup].open()
			}
		},
		onLoad(options) {
			model.orders(this)
			model.profits(this)
		},
		onShow() {
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.guideshop(this)
			}
		},
		onShareAppMessage(res) {
			if (this.guideshop.id) {
				return model.shareBody(this)
			}
		},
		onShareTimeline(res) {
			return model.shareBody(this)
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
<style>
	page {
		/* 解决下拉后，顶部出现的白边 */
		/* #ifdef MP */
		background-color: transparent;
		/* #endif */
	}
</style>
