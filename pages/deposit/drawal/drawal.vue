<template>
	<view>
		<view class="wraper ml10 mr10 mt10">
			<view class="uni-flex uni-row width-between bank">
				<text class="f-15 mr10">到账银行卡</text>
				<view v-if="banks.length > 0" v-on:click="showPopup($event, 'bank')"
					class="uni-flex uni-row width-surplus">
					<view class="uni-flex uni-column width-surplus ml10">
						<view>
							<text :class="['iconfont f-15', bank.short_name]"></text>
							<text class="ml5 f-15">{{bank.bank_name}}</text>
						</view>
						<text class="f-gray">24小时内到账</text>
					</view>
					<uni-icons type="arrowright" color="gray"></uni-icons>
				</view>
				<navigator v-else url="/pages/bank/build" hover-class="none" class="uni-flex uni-row width-surplus">
					<view class="uni-flex uni-column width-surplus ml10">
						<text class="f-15">暂无提现银行卡</text>
						<text class="f-gray">前往设置</text>
					</view>
					<uni-icons type="arrowright" color="gray"></uni-icons>
				</navigator>
			</view>
			<view class="pd10 bgf" style="padding: 40rpx;">
				<text class="ml10">提现金额</text>
				<view class="uni-flex uni-row ml10 pt10 pb10 flex-middle money">
					<text class="uni-bold mr10 mt10">￥</text>
					<input v-model="money" class="width-surplus uni-bold mt10" type="digit" maxlength="10" />
				</view>
				<view class="f-gray ml10 pt10 pb10 bt" style="padding-top:40rpx;">
					<text>余额 {{deposit.money||'0.00'}}元</text>
					<text v-if="deposit.nodrawal > 0">，其中{{deposit.nodrawal}}不可提现</text>
					<text v-on:click="drawall" class="f-blue ml10">全部提现</text>
				</view>
				<view v-on:click="submit" class="f-white pd10 uni-center f-16 mt10 mb10 uni-bold mybutton">确认提现</view>
			</view>
			<uni-popup ref="bank" type="bottom">
				<my-popup-bank :banks="banks" :selected="bank" @close="close" @confirm="confirm"></my-popup-bank>
			</uni-popup>
			<uni-popup ref="pay" type="dialog">
				<my-popup-pay @close="close" @confirm="payConfirm"></my-popup-pay>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './drawal.js'
	export default {
		data() {
			return {
				banks: [],
				bank: {},
				deposit: {
					money: 0
				},
				money: ''
			}
		},
		methods: {
			drawall: function() {
				this.money = this.deposit.money - this.deposit.nodrawal
			},
			submit: function() {
				if (util.isEmpty(this.bank.bid)) {
					uni.showModal({
						content: '请先设置提现银行卡',
						showCancel: false
					})
				} else if (Number(this.money) <= 0) {
					uni.showModal({
						content: '提现金额有误',
						showCancel: false
					})
				} else if ((Number(this.money) > Number(this.deposit.money - this.deposit.nodrawal))) {
					uni.showModal({
						content: '最多能提现' + (this.deposit.money - this.deposit.nodrawal) + '元',
						showCancel: false
					})
				} else {
					return this.$refs.pay.open()
				}
			},
			close(done) {
				done()
			},
			confirm(done, bank) {
				this.bank = bank
				done()
			},
			payConfirm(done, password) {
				model.submit(this, password)
				done()
			},
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			}
		},
		onShow: function() {
			if (util.verifyLogin(true, false)) {
				model.deposit(this)
				model.banks(this)
			}
		}
	}
</script>
<style scoped>
	@import url("./drawal.css");
</style>
