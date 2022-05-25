<template>
	<view>
		<view class="uni-flex uni-column round-edge ml10 mr10 mt10 mb10 pb10 order-status">
			<text class="f-17 mt10 pt10 pl10 ml10 pb10">{{refund.status|translator('refund')}}</text>
			<view class="uni-flex uni-row pl10 ml10 pb10 mb10 pr10 width-between flex-middle">
				<text>{{refund.created}}</text>
				<navigator v-if="refund.status != 'SUCCESS' && refund.status != 'CLOSED'" :url="'/pages/refund/logs?id='+refund.refund_id"
				 hover-class="none" class="mybutton mr10">提交申诉</navigator>
			</view>
		</view>
		<view class="pd10 bgf ml10 mr10 round-edge">
			<view v-on:click="showPopup($event, 'ordermoney')" class="uni-flex uni-row width-between pb10">
				<text>订单金额</text>
				<view>
					<text>{{refund.total_fee}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
			<view v-on:click="showPopup($event, 'refundmoney')" class="uni-flex uni-row width-between bt pt10">
				<text>退款金额</text>
				<view>
					<text>{{refund.refund_total_fee}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</view>

		<view class="pd10 bgf ml10 mr10 round-edge mt10">
			<view class="uni-flex uni-row width-between pb10">
				<text>退款编号</text>
				<view>
					<text>{{refund.refund_sn}}</text>
				</view>
			</view>
			<view class="uni-flex uni-row width-between bt pt10 pb10">
				<text>收货情况</text>
				<view>
					<text>{{refund.shipped}}</text>
				</view>
			</view>
			<view class="uni-flex uni-row width-between bt pt10 pb10">
				<text>退款原因</text>
				<view>
					<text>{{refund.refund_reason}}</text>
				</view>
			</view>
			<view class="uni-flex uni-row width-between bt pt10 pb10">
				<text>退款说明</text>
				<view>
					<text>{{refund.refund_desc}}</text>
				</view>
			</view>
			<navigator :url="'/pages/refund/logs?id='+refund.refund_id" hover-class="none" class="uni-flex uni-row width-between bt pt10">
				<text>协商历史</text>
				<view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</navigator>
		</view>
		<view v-if="refund.status != 'SUCCESS' && refund.status != 'CLOSED'" class="uni-flex uni-row mt10 mb10 pt10 flex-center operate">
			<view v-on:click="cancel" class="mybutton">取消退款</view>
			<navigator :url="'/pages/my/refund/build?id='+refund.refund_id" class="mybutton yellow">修改退款</navigator>
			<view v-if="refund.intervene ==  0" v-on:click="intervene" class="mybutton gray">申请介入</view>
			<navigator v-if="refund.intervene == 1" :url="'/pages/my/order/view?id='+refund.order_id" class="mybutton gray">查看订单</navigator>
		</view>
		<view v-if="refund.status != 'SUCCESS' && refund.status != 'CLOSED' && refund.intervene == 1" class="uni-flex uni-column">
			<view class="fixed-bottom pd10">
				<view class="uni-center f-white">该退款已申请平台客服介入处理</view>
			</view>
			<view class="fixed-space"></view>
		</view>

		<!--订单总额说明弹窗-->
		<uni-popup ref="ordermoney" type="bottom" class="relative" style="z-index: 100;">
			<view class="pd10 bgf">
				<view class="pt10">订单总额说明</view>
				<view class="f-gray pb10">订单总额 = 商品总额({{refund.goods_fee}}) + 运费总额({{refund.shipping_fee}})</view>
			</view>
		</uni-popup>

		<!--退款总额说明弹窗-->
		<uni-popup ref="refundmoney" type="bottom" class="relative" style="z-index: 100;">
			<view class="pd10 bgf">
				<view class="pt10">退款金额说明</view>
				<view class="f-gray pb10">退款金额 = 退商品金额({{refund.refund_goods_fee}}) + 退运费({{refund.refund_shipping_fee}})</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './view.js'
	export default {
		data() {
			return {
				refund_id: 0,
				refund: {}
			}
		},
		methods: {
			cancel: function() {
				model.cancel(this)
			},
			intervene: function() {
				model.intervene(this)
			},
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			}
		},
		onLoad: function(options) {
			this.refund_id = options.id
			model.refund(this)
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		}
	}
</script>
<style scoped>
	@import url("./view.css");
</style>
