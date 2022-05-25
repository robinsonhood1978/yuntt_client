<template>
	<view>
		<view class="pb10 relative bgp">
			<view class="pb10 f-white profits">
				<view class="uni-flex uni-column">
					<view class="uni-flex uni-row width-between pd10 flex-middle">
						<navigator hover-class="none" class="f-16">我的收益</navigator>
						<view class="uni-flex uni-row">
							<navigator url="/pages/deposit/record/record?bizIdentity=FX&flow=income&title=收益明细"
								hover-class="none" class="f-16">查看明细</navigator>
							<uni-icons type="arrowright" color="#ffffff"></uni-icons>
						</view>
					</view>
					<view class="uni-flex uni-row width-between pl5 pt10 pr10 pb10 flex-middle mt10">
						<view class="uni-center f-25">{{profits.amount|currency}}</view>
						<navigator url="/pages/deposit/drawal/drawal" hover-class="none" class="mybutton f-white f-15">提现
						</navigator>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-row bgf round-edge ml10 mr10 pd10 mt10 dayprofits" style="margin-top: -40rpx;">
				<view class="uni-flex uni-column flex-center uni-center">
					<text class="f-20 f-red uni-bold">{{profits.yesterday|currency}}</text>
					<text>昨日收益</text>
				</view>
				<view class="uni-flex uni-column flex-center uni-center">
					<text class="f-20 f-red uni-bold">{{profits.lastWeek|currency}}</text>
					<text>上周收益</text>
				</view>
				<view class="uni-flex uni-column flex-center uni-center">
					<text class="f-20 f-red uni-bold">{{profits.currMonth|currency}}</text>
					<text>本月收益</text>
				</view>
			</view>
			<navigator url="/pages/distribute/apply/apply"
				class="uni-flex uni-row ml10 mr10 mt10 pd10 bgf round-edge width-between flex-middle">
				<view class="teams mr10"><text class="iconfont iconjifen"></text></view>
				<view class="uni-flex uni-row width-surplus width-between flex-middle">
					<view class="width-surplus mr10">
						<view class="uni-bold f-16">如何赚佣金</view>
						<view class="f-gray l-h20 mt5 mb5">直接推广分销商品，或发展分销团队成员消费，都可以获得佣金</view>
					</view>
					<uni-icons type="arrowright" size="40"></uni-icons>
				</view>
			</navigator>

			<view class="bgf round-edge ml10 mr10 pb10 mt10 mb10 gallery">
				<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
					<view class="item">
						<navigator url="/pages/distribute/goods/list" hover-class="none"
							class="uni-flex uni-column flex-middle pd10 relative">
							<text class="iconfont iconshangpin" style="font-size: 78rpx;color: #8c965d;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">分销商品</view>
							</view>
							<text v-if="goodses > 0"
								class="absolute badge uni-center f-white f-13 uni-bold">{{goodses||0}}</text>
						</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/distribute/order/list" hover-class="none"
							class="uni-flex uni-column flex-middle pd10 relative">
							<text class="iconfont iconicon_order" style="color: #aaaa00;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">分销订单</view>
							</view>
							<text v-if="orders > 0"
								class="absolute badge uni-center f-white f-13 uni-bold">{{orders||0}}</text>
						</navigator>
					</view>

					<view class="item">
						<navigator url="/pages/deposit/record/record?bizIdentity=FX&flow=income&title=收益明细" hover-class="none"
							class="uni-flex uni-column flex-middle mt10 pd10 relative">
							<text class="iconfont iconyue1" style="color: #ffc619;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">分销收益</view>
							</view>
							<text v-if="profits.total > 0"
								class="absolute badge uni-center f-white f-13 uni-bold">{{profits.total||0}}</text>
						</navigator>
					</view>
					<view class="item">
						<navigator url="/pages/distribute/team/list" hover-class="none"
							class="uni-flex uni-column flex-middle mt10 pd10 relative">
							<text class="iconfont icontuandui" style="color: #37caff;"></text>
							<view class="uni-flex uni-column uni-center">
								<view class="f-15 uni-bold">分销团队</view>
							</view>
							<text v-if="teams > 0"
								class="absolute badge uni-center f-white f-13 uni-bold">{{teams||0}}</text>
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
	export default {
		data() {
			return {
				goodses: 0,
				orders: 0,
				teams: 0,
				profits: {
					amount: 0,
					total: 0,
					yesterday: 0,
					lastWeek: 0,
					currMonth: 0
				}
			}
		},
		methods: {

		},
		onLoad(options) {
			model.teams(this)
			model.goodses(this)
			model.orders(this)
			model.profits(this)
		},
		onShow() {
			util.verifyLogin(true, this.$mp.page.route)
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
