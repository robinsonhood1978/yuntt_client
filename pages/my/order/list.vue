<template>
	<view>
		<view class="uni-flex uni-row fixed-top navtab">
			<view v-for="(item, key, index) in tabbars" :key="index" hover-class="none" :class="['item uni-center pt5 pb5 f-16', (orders.selected == key || (!orders.selected && key == 'all')) ? 'current' : '']"
			 @click="galleryby(key)"><text>{{item}}</text></view>
		</view>
		<view v-if="orders.list.length > 0" class="order-list">
			<view v-for="(order,index) in orders.list" :key="index">
				<view class="round-edge bgf pd10 ml10 mr10 mb10">
					<view class="uni-flex uni-row shop mb10 width-between">
						<view class="uni-flex uni-row">
							<!-- <uni-icons type="shop"></uni-icons> -->
							<navigator :url="'/pages/store/index?id=' + order.seller_id" open-type="redirect" hover-class="none" class="f-16">{{order.seller_name}}</navigator>
							<uni-icons type="arrowright"></uni-icons>
						</view>
						<view :class="order.status == 0 ? 'f-gray' : 'f-red'">{{order.status|translator}}</view>
					</view>
					<view v-for="(goods, id) in order.items"
					 :key="id" class="uni-flex uni-row width-between pt10 items">
						<navigator open-type="redirect" hover-class="none" :url="'/pages/goods/index?id=' + goods.goods_id">
							<image class="image" :src="goods.goods_image" mode="widthFix" />
						</navigator>
						<view class="uni-flex uni-column ml10 mr10">
							<navigator hover-class="none" :url="'/pages/goods/index?id=' + goods.goods_id" class="line-clamp-2 l-h20">{{goods.goods_name}}</navigator>
							<view class="f-gray">{{goods.specification}}</view>
							<view v-if="order.refund_id" class="mt5">
								<navigator v-if="order.refund_status == 'SUCCESS'" :url="'/pages/my/refund/view?id='+order.refund_id" hover-class="none" class="f-blue">{{order.refund_status|translator('refund')}}</navigator>
								<text v-else-if="order.refund_status == 'CLOSED'" class="f-gray">{{order.refund_status|translator('refund')}}</text>
								<navigator v-else :url="'/pages/my/refund/view?id='+order.refund_id" hover-class="none" class="f-red">退款中</navigator>
							</view>
						</view>
						<view class="uni-flex uni-column">
							<view>{{goods.price}}</view>
							<view class="f-gray" style="text-align: right;">x{{goods.quantity}}</view>
						</view>
					</view>
					<view class="uni-flex uni-row width-between mt10">
						<text></text>
						<view>共{{order.items.length}}件，实付款<text class="f-red ml5">{{order.order_amount|currency}}</text></view>
					</view>
					<view class="uni-flex uni-row width-between mt10 operation">
						<text></text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<navigator :url="'/pages/my/order/evaluation?order_id='+order.order_id" hover-class="none" v-if="order.status == 40 && order.evaluation_status != 1"
							 class="f-13 mybutton pl10 pr10 f-white mr10 mt10">评价订单</navigator>
							<view v-if="order.status == 30 || order.status == 36" v-on:click="finished(order.order_id)" class="f-13 mybutton pl10 pr10 f-white mr10 mt10">确认收货</view>
							<navigator v-if="order.express_no" :url="'/pages/order/logistic?order_id='+order.order_id" hover-class="none"
							 class="f-13 mybutton pl10 pr10 f-white mr10 mt10">查看物流</navigator>

							<view v-if="order.status >= 20">
								<navigator v-if="order.status != 40 && !order.refund_id" :url="'/pages/my/refund/build?order_id='+order.order_id"
								 hover-class="none" class="f-13 mybutton pl10 pr10 b-gray mr10 mt10">退款/退货</navigator>
								<navigator v-if="order.refund_id" :url="'/pages/my/refund/view?id='+order.refund_id" hover-class="none" class="f-13 mybutton pl10 pr10 b-gray mr10 mt10">查看退款</navigator>
							</view>

							<navigator v-if="order.status == 11" :url="'/pages/cashier/pay?bizOrderId='+order.bizOrderId+'&bizIdentity='+order.bizIdentity"
							 hover-class="none" class="f-13 mybutton f-white mr10 mt10">付款</navigator>
							<view v-if="order.status == 11" v-on:click="canceled(order)" class="f-13 mybutton pl10 pr10 b-gray mr10 mt10">取消订单</view>
							<navigator :url="'/pages/my/order/view?id='+order.order_id" hover-class="none" class="f-13 mybutton pl10 pr10 b-gray mt10">查看订单</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无订单</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
		 
		<!-- #ifdef H5-->
		<view class="morenavh5" v-on:click="showPopup($event, 'morenavh5')">
			<view class="pl5 pr5 pt10 pb10 absolute f-white">快<br>捷<br>导<br>航</view>
			<uni-popup ref="morenavh5" type="dialog">
				<my-popup-morenav position="leftbottom"></my-popup-morenav>
			</uni-popup>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				tabbars: [],
				orders: {
					selected: 'all',
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
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			galleryby: function(selected) {
				this.loadMore.show = false
				if (this.orders.selected != selected) {
					this.orders.list = [] // 清空原先加载的数据
					this.orders.selected = selected
				}
				model.orders(this, 1)
			},
			canceled: function(order) {
				model.canceled(this, order)
			},
			finished: function(order_id) {
				model.finished(this, order_id)
			}
		},
		created: function(e) {
			model.showLoadMore(this)
			model.tabbars(this)
		},
		onLoad: function(options) {
			this.orders.selected = options.type || ''
		},
		onShow: function() {
			if(util.verifyLogin(true, this.$mp.page.route)) {
				model.orders(this, 1)
			}
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
