<template>
	<view>
		<view class="flex-middle">
			<navigator url="/pages/my/cashcard/build" hover-class="none" class="width-surplus ml10 mr10 mt10 bgf round-edge pd10 flex-middle">
				<uni-icons type="plusempty" size="36"></uni-icons>
				<text class="f-16">绑定新充值卡</text>
			</navigator>
		</view>
		<view class="mt10" v-if="cards.list.length > 0">
			<view v-for="(item, index) in cards.list" :key="index" class="ml10 mr10 mb10 round-edge bgf item">
				<view url="/pages/deposit/trade/trade" hover-class="none" class="uni-flex uni-row width-between">
					<view class="uni-flex uni-column pd10">
						<text class="uni-bold f-15">{{item.name}}</text>
						<text class="f-gray">卡号码：{{item.cardNo}}</text>
						<text v-if="item.expire_time != 0" class="f-gray">有效期：{{item.expire_time}}</text>
						<text v-else class="f-gray">有效期：不限制</text>
						<text v-if="item.active_time" class="f-yellow">卡状态：已激活</text>
					</view>
					<view class="uni-flex uni-column cardvalue">
						<text class="mt10 pt10 f-white f-20">￥</text>
						<text class="f-white money">{{dynamicValue(item.money)}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				cards: {
					page: 1,
					list: []
				},
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.cards(this, this.cards.page + 1)
			},
			dynamicValue: function(value) {
				return Number(value).toFixed(0)
			}
		},
		created: function() {
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			model.cards(this, 1)
		},
		onShow: function() {
			util.verifyLogin(true, false)
		},
		onReachBottom: function() {
			model.cards(this, this.cards.page + 1)
		}
	}
</script>
<style scoped>
 .cardvalue {
	 min-width: 150rpx;
	 text-align: right;
	 background-color: #E6A016;
	 border-radius: 0 20rpx 20rpx 0;
	 padding: 0 20rpx 0 30rpx;
	 line-height: 70rpx;
 }
 .cardvalue .money {
	 font-size: 70rpx;
 }
</style>
