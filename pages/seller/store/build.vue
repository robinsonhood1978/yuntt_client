<template>
	<view>
		<view class="uni-flex uni-column bgf">
			<!--修改店铺名-->
			<view v-if="field == 'store_name'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">店铺名</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="store.store_name" />
				<uni-icons v-if="store.store_name" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>
			
			<!--修改店铺联系电话-->
			<view v-if="field == 'tel'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">联系电话</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="store.tel" />
				<uni-icons v-if="store.tel" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>

			<!--修改店铺客服QQ-->
			<view v-if="field == 'im_qq'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">客服QQ</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="store.im_qq" />
				<uni-icons v-if="store.im_qq" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>
		</view>
		<view class="f-white uni-center f-15 ml10 mr10 pt10">
			<view v-on:click="submit" class="mybutton mt10 f-15 uni-bold">保存</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				field: '',
				store: {
					tel: '',
					store_name: '',
					im_qq: ''
				}
			}
		},
		methods: {
			clearInput: function() {
				this.store[this.field] = ''
			},
			submit: function() {
				model.submit(this)
			}
		},
		onLoad: function(options) {
			this.field = options.field
			this.store[this.field] = options.value
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', util.getUrl())
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>

<style>
</style>
