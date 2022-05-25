<template>
	<view>
		<view class="uni-flex uni-row fixed-top navtab">
			<view v-for="(item, key, index) in tabbars" :key="index" hover-class="none"
				:class="['item uni-center pt5 pb5 f-16', (orders.selected == key || (!orders.selected && key == 'all')) ? 'current' : '']"
				@click="galleryby(key)"><text>{{item}}</text></view>
		</view>
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
						<view :class="['f-15', order.status == 36 ? 'f-green' : 'f-red']">{{order.status|translator}}
						</view>
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
							<view v-if="order.refund_id" class="mt5">
								<text v-if="order.refund_status == 'SUCCESS'"
									class="f-blue">{{order.refund_status|translator('refund')}}</text>
								<text v-else-if="order.refund_status == 'CLOSED'"
									class="f-gray">{{order.refund_status|translator('refund')}}</text>
								<text v-else class="f-red">退款中</text>
							</view>
						</view>
						<view class="uni-flex uni-column">
							<view>{{goods.price}}</view>
							<view class="f-gray" style="text-align: right;">x{{goods.quantity}}</view>
						</view>
					</view>
					<view class="uni-flex uni-row width-between mt10">
						<text></text>
						<view>共{{order.items.length}}件，实付款<text class="f-red ml5">{{order.order_amount|currency}}</text>
						</view>
					</view>
					<view v-if="order.status >= 20" class="uni-flex uni-row consignee pd10 mt10">
						<uni-icons type="person" color="#fc2b34" size="30"></uni-icons>
						<text class="f-15 ml5">提货人：{{order.consignee.name}} {{order.consignee.phone_mob}}</text>
					</view>
					<view class="mt10">
						<view v-if="order.status == 35" v-on:click="delivered(order)"
							class="f-15 mybutton pl10 pr10 f-white mr10 mt10">通知已到货</view>
						<view v-if="order.status == 40" class="uni-flex uni-row flex-middle">
							<uni-icons type="checkbox-filled" color="#00cc00" size="38"></uni-icons>
							<text class="ml5 f-15">取货完成</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无订单</view>
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
				tabbars: {},
				orders: {
					selected: 'all',
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				},
				title: '',
				modifyId: 0
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.orders(this, this.orders.page + 1)
			},
			galleryby: function(selected) {
				this.loadMore.show = false
				if (this.orders.selected != selected) {
					this.orders.list = [] // 清空原先加载的数据
					this.orders.selected = selected
				}
				model.orders(this, 1)
			},
			delivered(order) {
				model.delivered(this, order)
			}
		},
		created: function(e) {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.orders.selected = options.type
		},
		onShow: function() {
			model.orders(this, 1)
		},
		onPullDownRefresh: function() {
			this.loadMore.show = false
			this.orders.list = [] // 清空原先加载的数据
			model.orders(this, 1)
		},
		onReachBottom: function() {
			model.orders(this, this.orders.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
