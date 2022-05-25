<template>
	<view class="pb10">
		<view class="ml10 mt10 mr10 mb10 round-edge f-white flex-center flex-middle order-status"
			:style="order.status == 0 ? 'background-color:#AAAAAA' : ''">{{order.status|translator}}</view>
		
		<view v-if="order.otype !='guidebuy'" class="ml10 mr10 round-edge bgf pd10 shipping">
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
		<view v-else class="ml10 mr10 round-edge bgf pd10 shipping">
			<view>
				<uni-icons type="person"></uni-icons>
				<text class="ml10 uni-bold f-15">{{shipping.consignee}} {{shipping.phone_mob}}</text>
			</view>
			<view class="uni-flex uni-row mt10 pt10 bt width-between">
				<view class="uni-flex uni-row mr10">
					<uni-icons type="shop"></uni-icons>
					<view class="uni-flex uni-column ml10 width-surplus">
						<text class="uni-bold f-15">自提点：{{guideshop.name}}</text>
						<text
							class="f-gray l-h20">{{shipping.province||''}}{{shipping.city||''}}{{shipping.district||''}}{{shipping.address}}</text>
					</view>
				</view>
				<view v-on:click="openLocation" class="uni-flex uni-row flex-middle l-h20 mr5 f-c60"
					style="min-width: 130rpx; justify-content: flex-end;">
					<text class="iconfont iconnavigation_line f-13"></text>
					<text>导航</text>
				</view>
			</view>
			<view class="uni-flex uni-row mt10 pt10 bt width-between">
				<view class="uni-flex uni-row mr10 ensure">
					<text class="iconfont iconanquanzhuye mr5"></text>
					<view class="uni-flex uni-column ml10 width-surplus l-h20">
						<text>如有商品缺货少送等问题，可联系团长为您解决</text>
					</view>
				</view>
				<view v-on:click="call" class="uni-flex uni-row flex-middle l-h20 mr5"
					style="min-width: 160rpx; justify-content: flex-end;">
					<uni-icons type="phone" color="#ff6600"></uni-icons>
					<text class="f-c60 ml5">联系团长</text>
				</view>
			</view>
		</view>

		<view class="round-edge pd10 mb10 bgf ml10 mr10 mt10 order-detail">
			<view class="uni-flex uni-row mb10">
				<!-- <navigator class="f-16" :url="'/pages/store/index?id='+order.seller_id">{{order.seller_name}}</navigator>
				<uni-icons type="arrowright"></uni-icons> -->
				<text class="f-16">商品信息</text>
			</view>
			<navigator :url="'/pages/goods/index?id=' + goods.goods_id" open-type="redirect" hover-class="none"
				v-for="(goods, id) in items" :key="id" class="uni-flex uni-row width-between item">
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
			</navigator>
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
				<text class="f-gray">交易号</text>
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
			<view class="uni-flex uni-row pt10 mt10 order-seller">
				<view v-on:click="contact" class="flex-item uni-center">
					<uni-icons type="chat" color="gray"></uni-icons>
					<text class="f-15 f-gray ml5">联系卖家</text>
				</view>
				<navigator :url="'/pages/store/index?id='+order.seller_id" open-type="redirect" hover-class="none"
					class="flex-item uni-flex uni-row flex-middle flex-center">
					<uni-icons type="shop" color="gray"></uni-icons>
					<text class="f-15 f-gray ml5">进店逛逛</text>
				</navigator>
			</view>
		</view>
		<view v-if="order.status == 11">
			<view class="fixed-bottom">
				<view class="uni-flex uni-row flex-middle flex-center pd10 bgp">
					<navigator
						:url="'/pages/cashier/pay?bizOrderId='+order.bizOrderId+'&bizIdentity='+order.bizIdentity"
						class="btn-pay uni-center f-white width-surplus pt10 pb10 f-15 uni-bold">
						立即支付({{order.order_amount|currency}})</navigator>
				</view>
			</view>
			<view class="fixed-space"></view>
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
				store: {},
				items: [],
				shipping: {},
				guideshop: {}
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
			contact() {
				let qq = this.store.im_qq || '561223725'
				// #ifdef APP-PLUS
				plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin=' + qq + '&version=1&src_type=web')
				// #endif
			},
			call() {
				if(!this.guideshop.phone_mob) {
					return false
				}
				uni.makePhoneCall({
					phoneNumber: this.guideshop.phone_mob
				})
			},
			openLocation() {
				uni.openLocation({
					latitude: Number(this.guideshop.latitude),
					longitude: Number(this.guideshop.longitude)
				})
			}
		},
		onLoad: function(options) {
			this.order_id = options.id
		},
		onShow: function(e) {
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.order(this)
				model.shipping(this)
			}
		}
	}
</script>
<style scoped>
	@import url("./view.css");
</style>
