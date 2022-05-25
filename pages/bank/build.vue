<template>
	<view>
		<view class="pd10 f-16 f-gray">请绑定持卡人<text class="f-red">{{visitor.real_name}}</text>本人的银行卡</view>
		<view class="bgf">
			<view v-on:click="showPopup($event, 'bank')" class="uni-flex uni-row width-between pd10 flex-middle item">
				<text class="title f-15">开户行</text>
				<view>
					<text :class="['iconfont f-15', bank.short_name]"></text>
					<text class="ml5 f-15 mr10">{{bank.bank_name}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
			<view class="uni-flex uni-row width-between pd10 item bt flex-middle">
				<text class="title f-15">持卡人</text>
				<input v-model="bank.account_name" class="width-surplus f-15" :placeholder="visitor.real_name" />
			</view>
			<view class="uni-flex uni-row width-between pd10 item bt flex-middle">
				<text class="title f-15">卡号</text>
				<input v-model="bank.num" class="width-surplus f-15" type="number" placeholder="持卡人本人银行卡" />
			</view>
			<view v-on:click="change" class="uni-flex uni-row width-between pd10 item bt flex-middle">
				<text class="title f-15">卡类型</text>
				<view>
					<text class="ml5 f-15 mr10">{{banktypes.list[banktypes.selected]}}</text>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		<view class="mt10 pt10">
			<view v-on:click="showPopup($event, 'pay')" class="mybutton f-white uni-center f-16 mt10 ml10 mr10">确认提交</view>
		</view>
		<uni-popup ref="bank" type="bottom">
			<my-popup-bank :showAdd="false" title="添加银行卡" desc="请选择持卡人本人的银行卡" :banks="banks" :selected="bank" @close="close"
			 @confirm="confirm"></my-popup-bank>
		</uni-popup>
		<uni-popup ref="pay" type="dialog">
			<my-popup-pay @close="close" @confirm="submit"></my-popup-pay>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				visitor: {},
				banks: [{
					short_name: 'ICBC',
					bank_name: '中国工商银行'
				}, {

					short_name: 'ABC',
					bank_name: '中国农业银行'
				}, {

					short_name: 'CCB',
					bank_name: '中国建设银行'
				}, {

					short_name: 'BOC',
					bank_name: '中国银行'
				}],
				bank: {},
				banktypes: {
					list: ['储蓄卡', '信用卡'],
					selected: 0
				},
				form: {
					num: '',
					account_name: '',
					type: 'debit'
				}
			}
		},
		methods: {
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			},
			close(done) {
				done()
			},
			confirm(done, bank) {
				this.bank = bank
				this.form = Object.assign(this.form, bank)
				done()
			},
			change: function() {
				let that = this
				uni.showActionSheet({
					itemList: that.banktypes.list,
					success: function(res) {
						that.bank.type = res.tapIndex == 0 ? 'debit' : 'credit'
						that.banktypes.selected = res.tapIndex
					}
				})
			},
			submit(done, password) {
				model.submit(this, password)
				done()
			}
		},
		onLoad: function(options) {
			this.visitor = uni.getStorageSync('visitor') || {}
		},
		onShow: function() {
			util.verifyLogin(true, false)
			this.bank = this.banks[0]
		}
	}
</script>

<style scoped>
	@import url("./build.css");
</style>
