<template>
	<view>
		<view v-if="orders.list.length > 0" class="order-list">
			<view v-for="(order,index) in orders.list" :key="index">
				<view class="round-edge bgf pd10 ml10 mr10 mb10">
					<view class="uni-flex uni-row shop mb10 width-between">
						<view class="uni-flex uni-row">
							<!-- <uni-icons type="shop"></uni-icons> -->
							<navigator :url="'/pages/store/index?id=' + order.seller_id" open-type="redirect"
								hover-class="none" class="f-16">{{order.seller_name}}</navigator>
							<uni-icons type="arrowright"></uni-icons>
						</view>
						<view class="f-15 f-red">{{order.status|translator}}</view>
					</view>
					<view v-for="(goods, id) in order.items" :key="id"
						class="uni-flex uni-row width-between pt10 items">
						<navigator hover-class="none" :url="'/pages/goods/index?id=' + goods.goods_id">
							<image class="image" :src="goods.goods_image" mode="widthFix" />
						</navigator>
						<view class="uni-flex uni-column ml10 mr10">
							<navigator open-type="redirect" hover-class="none"
								:url="'/pages/goods/index?id=' + goods.goods_id" class="line-clamp-2 l-h20">
								{{goods.goods_name}}
							</navigator>
							<view class="f-gray">{{goods.specification}}</view>
							<!-- <view class="mt5 f-gray f-13">
								收益：{{goods.money|currency}}，比率：{{goods.ratio}}
							</view> -->
						</view>
						<view class="uni-flex uni-column">
							<view>{{goods.price}}</view>
							<view class="f-gray" style="text-align: right;">x{{goods.quantity}}</view>
						</view>
					</view>
					<view class="uni-flex uni-row width-between mt5 mb5">
						<text></text>
						<view>订单支付金额：<text class="f-red">{{order.order_amount|currency}}</text>，总收益：<text class="f-red">{{order.amount|currency}}</text>
						</view>
					</view>
					<!-- <view class="pt10 bt">
						<navigator class="mybutton outside f-red">查看收益</navigator>
					</view> -->
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无交易完成的分销订单</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
			:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				orders: {
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.orders(this, this.orders.page + 1)
			},
			galleryby: function(selected) {
				this.loadMore.show = false
				model.orders(this, 1)
			}
		},
		created: function(e) {
			model.showLoadMore(this)
		},
		onShow: function() {
			if(util.verifyLogin(true, this.$mp.page.route)) {
				model.merchant(this)
				model.orders(this, 1)
			}
		},
		onReachBottom: function() {
			model.orders(this, this.orders.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
