<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">一级返佣</text>
				<input v-model="distribute.ratio1" class="width-surplus" type="digit" placeholder="填写0.01-0.99" />
				<uni-icons v-on:click="clearInput($event, 'ratio1')" v-show="distribute.ratio1" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">二级返佣</text>
				<input v-model="distribute.ratio2" class="width-surplus" type="digit" placeholder="填写0.01-0.99" />
				<uni-icons v-on:click="clearInput($event, 'ratio2')" v-show="distribute.ratio2" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">三级返佣</text>
				<input v-model="distribute.ratio3" class="width-surplus" type="digit" placeholder="填写0.01-0.99" />
				<uni-icons v-on:click="clearInput($event, 'ratio3')" v-show="distribute.ratio3" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
		</view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle width-between f-16">
				<text class="mr10">启用</text>
				<switch v-on:change="change" :checked="distribute.enabled == 1" color="#F0AD4E"></switch>
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
				distribute: {}
			}
		},
		methods: {
			submit() {
				model.submit(this)
			},
			clearInput(e, field) {
				this.distribute[field] = ''
			},
			change(e) {
				this.distribute.enabled = e.detail.value ? 1 : 0
			}
		},
		onLoad(options) {
			if (options.goods_id) {
				this.goods_id = options.goods_id
				model.distribute(this)
			}
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', util.getUrl())
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>

<style scoped>
</style>
