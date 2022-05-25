<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">满金额</text>
				<input v-model="fullfree.amount" class="width-surplus" type="digit" placeholder="单笔订单购满XX元免运费" />
				<uni-icons v-on:click="clearInput($event, 'amount')" v-show="fullfree.amount" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">满件数</text>
				<input v-model="fullfree.quantity" class="width-surplus" type="number" placeholder="单笔订单购满XX件免运费" />
				<uni-icons v-on:click="clearInput($event, 'quantity')" v-show="fullfree.quantity" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle width-between f-16 bt">
				<text class="mr10">启用</text>
				<switch v-on:change="change" :checked="fullfree.status == 1" color="#F0AD4E"></switch>
			</view>
		</view>
		<view class="pd10">
			<view v-on:click="submit" class="mybutton f-white f-16 mt10">保存提交</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				fullfree: {
					status: 1
				}
			}
		},
		methods: {
			submit() {
				model.submit(this)
			},
			change(e) {
				this.fullfree.status = e.detail.value ? 1 : 0
			},
			clearInput(e, field) {
				this.fullfree[field] = ''
			}
		},
		onLoad(options) {
			model.fullfree(this)
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>

<style scoped>
</style>
