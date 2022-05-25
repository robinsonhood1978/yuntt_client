<template>
	<view>
		<view class="wraper ml10 mr10 mt10">
			<view class="uni-flex uni-row width-between bank">
				<text class="f-15 mr10">充值方式</text>
				<view v-on:click="showPopup($event, 'payment')" class="uni-flex uni-row width-surplus">
					<view class="uni-flex uni-column width-surplus ml10">
						<view>
							<text :class="['iconfont f-15', payment.code]"></text>
							<text class="ml5 f-15">{{payment.name}}</text>
						</view>
						<text class="f-gray">充值及时到账</text>
					</view>
					<uni-icons type="arrowright" color="gray"></uni-icons>
				</view>
			</view>
			<view class="pd10 bgf" style="padding: 40rpx;">
				<text class="ml10">充值金额</text>
				<view class="uni-flex uni-row ml10 pt10 pb10 flex-middle money">
					<text class="uni-bold mr10 mt10">￥</text>
					<input v-model="money" class="width-surplus uni-bold mt10" type="digit" maxlength="10" />
				</view>
				<view class="f-gray ml10 pt10 pb10 bt" style="padding-top:40rpx;"><text>建议最少充值100元起</text></view>
				<view v-on:click="submit" class="f-white pd10 uni-center f-16 mt10 mb10 uni-bold mybutton">确认充值</view>
			</view>
			<uni-popup ref="payment" type="bottom">
				<my-popup-payment :payments="payments" :selected="payment" @close="close" @confirm="confirm">
				</my-popup-payment>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './recharge.js'
	export default {
		data() {
			return {
				payments: [],
				payment: {},
				money: 100
			}
		},
		methods: {
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			},
			submit: function() {
				model.submit(this)
			},
			close(done) {
				done()
			},
			confirm(done, payment) {
				this.payment = payment
				done()
			}
		},
		onLoad: function(options) {
			model.getPayments(this)
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		}
	}
</script>
<style scoped>
	@import url("./recharge.css");
</style>
