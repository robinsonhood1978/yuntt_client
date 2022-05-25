<template>
	<view>
		<view class="round-edge bgf ml10 mt10 mr10">
			<view class="pl10 pr10 pb10">
				<view class="uni-flex uni-row pd10 flex-middle width-between">
					<text class="f-gray mr10 f-16 pt5 pb5">退款金额</text>
					<view class="uni-flex uni-row">
						<input v-model="refund.refund_total_fee" type="digit" :placeholder="refund.total_fee" class="input pt5 pb5 mr10" />
						<uni-icons v-on:click="clearInput('refund_total_fee')" v-show="refund.refund_total_fee" color="#ddd" size="38" type="clear"></uni-icons>
					</view>
				</view>
				<view v-on:click="shippedOptions" class="uni-flex uni-row pd10 flex-middle width-between bt">
					<text class="f-gray mr10 f-16 pt5 pb5">收货情况</text>
					<view class="pt5 pb5">
						<text class="f-16">{{refund.shipped_label}}</text>
						<uni-icons type="arrowright"></uni-icons>
					</view>
				</view>
				<view v-on:click="reasonOptions" class="uni-flex uni-row pd10 flex-middle width-between bt">
					<text class="f-gray mr10 f-16 pt5 pb5">退款原因</text>
					<view class="pt5 pb5">
						<text class="f-16">{{refund.refund_reason}}</text>
						<uni-icons type="arrowright"></uni-icons>
					</view>
				</view>
				<view class="uni-flex uni-row pd10 flex-middle width-between bt">
					<text class="f-gray mr10 f-16 pt5">退款说明</text>
					<view class="uni-flex uni-row">
						<input v-model="refund.refund_desc" placeholder="选填" class="f-16 pt5 input mr10" />
						<uni-icons v-on:click="clearInput('refund_desc')" v-show="refund.refund_desc" color="#ddd" size="38" type="clear"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="mt10 pd10">
			<view v-on:click="submit" class="mybutton f-white uni-center pt5 pb5 f-16 uni-bold">提交</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				order_id: 0,
				order: {},
				refund: {
					refund_id: 0,
					total_fee: '',
					refund_total_fee: '',
					shipped: 0,
					shipped_label: '未收到货，需要退款',
					refund_reason: '缺货',
					refund_desc: ''
				}
			}
		},
		methods: {
			clearInput: function(filed) {
				this.refund[filed] = ''
			},
			shippedOptions: function() {
				model.shippedOptions(this)
			},
			reasonOptions: function() {
				model.reasonOptions(this)
			},
			submit: function() {
				model.submit(this)
			}
		},
		onLoad: function(options) {
			//  申请退款
			if (options.order_id) {
				this.order_id = options.order_id
				model.order(this)
			}
			// 修改退款
			else if (options.id) {
				uni.setNavigationBarTitle({
					title: '修改退款'
				})
				this.refund.refund_id = options.id
				model.refund(this)
			}
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		}
	}
</script>
<style scoped>
	.mybutton {
		border-radius: 16rpx;
	}

	.input {
		text-align: right;
	}
</style>
