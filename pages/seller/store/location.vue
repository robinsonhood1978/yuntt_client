<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10">
			<view class="uni-flex uni-row bt pd10 flex-middle f-16">
				<text class="mr10">所在地区</text>
				<picker mode="multiSelector" @columnchange="columnchange" range-key="region_name" :value="multiIndex"
					:range="regions" class="width-surplus">{{selected}}</picker>
				<uni-icons type="arrowright"></uni-icons>
			</view>
			<view class="uni-flex uni-row bt pd10 flex-middle f-16">
				<text class="mr10">详细地址</text>
				<input v-model="address.address" class="width-surplus" placeholder="街道门牌信息" />
				<uni-icons v-on:click="clearInput($event, 'address')" v-show="address.address" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
		</view>
		<view class="pd10">
			<view v-on:click="save" class="mybutton f-white f-16 mt10">保存提交</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './location.js'
	export default {
		data() {
			return {
				address: {
					address: ''
				},
				regions: [],
				multiIndex: [0, 0, 0],
				selected: '请选择'
			}
		},
		methods: {
			columnchange: function(e) {
				this.multiIndex[e.detail.column] = e.detail.value
				if (e.detail.column == 0) {
					this.multiIndex = [e.detail.value, 0, 0]
				} else if (e.detail.column == 1) {
					this.multiIndex[2] = 0
				}
				model.regions(this)
			},
			save: function(e) {
				model.save(this)
			},
			clearInput: function(e, field) {
				this.address[field] = ''
			}
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}

			model.store(this)
		}
	}
</script>
<style scoped>
</style>
