<template>
	<view>
		<view class="uni-flex uni-column round-edge ml10 mr10 mt10 mb10 paymoney">
			<text class="uni-center f-14 mt10 pt10">支付金额</text>
			<view class="uni-center amount">{{orderInfo.amount|currency}}</view>
		</view>
		<view class="ml10 mt10 pl5 f-gray f-15">选择付款方式</view>
		<view class="ml10 mt10 mr10 mb10 bgf round-edge payments">
			<radio-group @change="change">
				<view>
					<label :class="['uni-flex uni-row mg5 pl10 pr10 width-between flex-middle', 'bt']">
						<view class="uni-flex uni-row flex-middle">
							<view :class="['iconfont mr10', 'wxpay']"></view>
							<view class="uni-flex uni-column">
								<text class="f-15">微信支付</text>
							</view>
						</view>
						<radio value="latipay" checked="true" color="#fc2b34"></radio>
					</label>
				</view>
				<view v-for="(payment, key, index) in payments" :key="key">
					<label :class="['uni-flex uni-row mg5 pl10 pr10 width-between flex-middle', index == 0 ? '' : 'bt']">
						<view class="uni-flex uni-row flex-middle">
							<view :class="['iconfont mr10', payment.code]"></view>
							<view class="uni-flex uni-column">
								<text class="f-15">{{payment.subname||payment.name}}</text>
								<text v-if="payment.disabled_desc" class="f-gray f-12">{{payment.disabled_desc}}</text>
							</view>
						</view>
						<radio v-if="!payment.disabled" :value="payment.code" :checked="payment.code == payment_code" color="#fc2b34"></radio>
						<radio v-else disabled="true" style="opacity: 0.3;"></radio>
					</label>
				</view>
			</radio-group>
		</view>
		<view class="ml10 mr10 pt10 pb10">
			<view class="f-16 f-white mybutton" v-on:click="submit">确认支付</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<my-popup-pay @close="close" @confirm="confirm"></my-popup-pay>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import server from '@/common/server.js'
	import model from './pay.js'
	export default {
		data() {
			return {
				bizOrderId: '',
				bizIdentity: '',
				orderInfo: {},
				payments: {},
				payment_code: '',
				orderId: ''
			}
		},
		methods: {
			change: function(e) {
				this.payment_code = e.detail.value
				console.log(e.detail.value)
			},
			submit: function() {
				if (this.payment_code == 'deposit') {
					return this.$refs.popup.open()
				}
				model.submit(this)
				// if (this.payment_code == 'latipay') {
				// 	// model.submit(this)
				// 	// return false;
				// 	let visitor = uni.getStorageSync('visitor') || {}
				// 	if (!visitor.userid) {
				// 		uni.showModal({
				// 			title: '提示',
				// 			content: '请先登录',
				// 			showCancel: false,
				// 			success(res) {
				// 				uni.navigateTo({
				// 					url: "/pages/login/login?redirect=yes",
				// 					animationType: 'slide-in-bottom',
				// 					animationDuration: 300
				// 				})
				// 			}
				// 		})
				// 		return false
				// 	}
				// 	let sdata = {
				// 		userId: visitor.userid,
				// 		orderId: this.orderId,
				// 		bizOrderId: this.bizOrderId
				// 	}
				// 	console.log('Robin sdata:', sdata)
				// 	server.request('article/latipaywechat', sdata, function(resp) {
				// 		console.log('Robin server latipaywechat response:', resp)
				// 		if (resp.code == 0) {
				// 			wx.requestPayment({
				// 				...resp.data.result,
				// 				success: function (res) {
				// 					console.log(res)
				// 					// setTimeout(showSuccess, 500, '支付成功')
				// 					// uni.showToast({
				// 					// 	title: '支付成功'
				// 					// })

				// 					// uni.showModal({
				// 					// 	title: '提示',
				// 					// 	content: '支付成功',
				// 					// 	showCancel: false,
				// 					// 	success(res) {
				// 					// 		uni.navigateBack()
				// 					// 	}
				// 					// })

				// 					// model.submit(this)

				// 					uni.showToast({
				// 						title: '支付成功',
				// 						duration: 1000,
				// 						complete() {
				// 							setTimeout(function() {
				// 								uni.redirectTo({
				// 									url: '/pages/my/order/list'
				// 								})
				// 							}, 1000)
				// 						}
				// 					})
				// 				},
				// 				fail (res) {
				// 					console.log(res)
				// 					// showFail("支付失败，请选择其他途径")
				// 					uni.showToast({
				// 						title: res.message,
				// 						icon: "支付失败，请选择其他途径"
				// 					})
				// 				}
				// 			})
				// 		}
				// 	})
				// }
				// else{
					
				// }
			},
			close(done) {
				done()
			},
			confirm(done, value) {
				model.submit(this, value)
				done()
			}
		},
		onLoad: function(options) {
			this.bizOrderId = options.bizOrderId
			this.bizIdentity = options.bizIdentity
			model.cashier(this)
		},
		onShow: function() {
			util.verifyLogin(true, false)
		},
		onPullDownRefresh: function() {
			model.cashier(this)
		}
	}
</script>
<style scoped>
	@import url("./pay.css");
</style>
