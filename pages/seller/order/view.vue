<template>
	<view class="pb10">
		<view class="ml10 mt10 mr10 mb10 round-edge f-white uni-center flex-middle flex-center order-status"
			:style="order.status == 0 ? 'background-color:#AAAAAA' : ''">{{order.status|translator}}</view>
		
		<view class="ml10 mr10 round-edge bgf pd10 shipping">
			<view class="mb10 f-16">收货信息</view>
			<view v-on:click="logistic" class="uni-flex uni-row width-between">
				<view class="uni-flex uni-row">
					<text class="iconfont iconziyuan f-16"></text>
					<view class="uni-flex uni-column ml5 width-surplus">
						<text class="uni-bold f-15">{{shipping.consignee}} {{shipping.phone_mob}}</text>
						<text
							class="f-gray">{{shipping.province||''}}{{shipping.city||''}}{{shipping.district||''}}{{shipping.address}}</text>
					</view>
				</view>
				<uni-icons v-if="order.express_no" type="arrowright"></uni-icons>
			</view>
		</view>
		<view class="round-edge pd10 mb10 bgf ml10 mr10 mt10 order-detail">
			<view class="uni-flex uni-row mb10">
				<text class="f-16">商品信息</text>
			</view>
			<view v-on:click="redirectMp(goods.goods_id)" v-for="(goods, id) in items" :key="id" class="uni-flex uni-row width-between item">
				<view>
					<image class="image" :src="goods.goods_image" mode="widthFix" />
				</view>
				<view class="uni-flex uni-column ml10 mr10">
					<view class="line-clamp-2 l-h20">{{goods.goods_name}}</view>
					<view class="f-gray">{{goods.specification}}</view>
				</view>
				<view class="uni-flex uni-column">
					<view class="f-red">{{goods.price|currency}}</view>
					<view class="f-gray" style="text-align: right;">x{{goods.quantity}}</view>
				</view>
			</view>
			<view class="uni-flex uni-row mt10 bt pt10 width-between">
				<text class="f-gray">订单运费</text>
				<view class="f-red">{{order.shipping_fee|currency}}</view>
			</view>
			<view class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">实付金额</text>
				<view class="f-red">{{order.order_amount|currency}}</view>
			</view>
		</view>
		<view class="round-edge bgf ml10 mr10 pd10 mb10">
			<view class="f-16">订单信息</view>
			<view class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">交易编号</text>
				<view>{{order.tradeNo}}</view>
			</view>
			<view class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">订单编号</text>
				<view>{{order.order_sn}}</view>
			</view>
			<view class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">创建时间</text>
				<view>{{order.add_time}}</view>
			</view>
			<view v-if="order.pay_time" class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">付款时间</text>
				<view>{{order.pay_time}}</view>
			</view>
			<view v-if="order.ship_time" class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">发货时间</text>
				<view>{{order.ship_time}}</view>
			</view>
			<view v-if="order.finished_time" class="uni-flex uni-row mt10 width-between">
				<text class="f-gray">完成时间</text>
				<view>{{order.finished_time}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './view.js'
	export default {
		data() {
			return {
				order_id: 0,
				order: {},
				items: [],
				shipping: {}
			}
		},
		methods: {
			logistic() {
				if (this.order.express_no) {
					uni.navigateTo({
						url: '/pages/order/logistic?order_id=' + this.order.order_id
					})
				}
			},
			redirectMp(id) {
				util.redirectMp('pages/goods/index?id=' + id)
			}
		},
		onLoad: function(options) {
			this.order_id = options.id
		},
		onShow: function(e) {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', util.getUrl())
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
			model.order(this)
			model.shipping(this)
		}
	}
</script>
<style scoped>
	@import url("./view.css");
</style>
