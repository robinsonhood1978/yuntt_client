<template>
	<view>
		<view class="round-edge ml10 mr10 mt10 bgf pl10 pt5 pr10 pb5">
			<view class="uni-flex uni-row width-between item flex-middle">
				<text class="title f-15">充值卡</text>
				<input v-model="cardNo" class="width-surplus f-15" placeholder="充值卡号码" />
			</view>
			<view class="uni-flex uni-row width-between bt item flex-middle">
				<text class="title f-15">卡密码</text>
				<input v-model="password" class="width-surplus f-15" placeholder="持卡人本人银行卡" />
			</view>
		</view>
		<view class="ml10 mr10 mt10 mb10 pt10">
			<view v-on:click="submit" class="mybutton f-white f-15">立即充值</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				cardNo: '',
				password: ''
			}
		},
		methods: {
			submit: function() {
				model.submit(this)
			}
		},
		onShow: function() {
			util.verifyLogin(true, false)
		}
	}
</script>

<style scoped>
	@import url("./build.css");
</style>
