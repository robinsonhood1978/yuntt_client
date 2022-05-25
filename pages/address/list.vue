<template>
	<view>
		<view class="mt10" v-if="addresses.list.length > 0">
			<view v-on:click="operate($event, item)" v-for="(item, addr_id, index) in addresses.list" :key="addr_id" class=" bgf ml10 mr10 mb10 pd10 round-edge">
				<label class="uni-flex uni-row width-between flex-middle">
					<view class="flex-item uni-flex uni-column ml10">
						<view><text class="f-16 uni-bold mr10">{{item.consignee}}</text><text>{{item.phone_mob}}</text></view>
						<text v-if="addr_type==0" class="f-gray">{{item.province}}{{item.city}}{{item.district||''}}{{item.address}}</text>
						<text v-else class="f-gray">{{item.address}}</text>
					</view>
					<uni-icons type="arrowright" color="gray"></uni-icons>
				</label>
			</view>
		</view>
		<view v-else class="flex-middle">
			<view v-on:click="add" class="width-surplus ml10 mr10 mt10 bgf round-edge pd10 flex-middle">
				<uni-icons type="plusempty" size="44"></uni-icons>
				<text class="f-16">添加收货地址</text>
			</view>
		</view>
		<uni-load-more v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
		<view v-if="addresses.list.length > 0" class="fixed-bottom bgp">
			<view class="uni-center f-15 ml10 mr10 mb10 mt10 f-white uni-bold mybutton" v-on:click="add">添加新地址</view>
		</view>
		<view style="padding-bottom: 140rpx;"></view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				addresses: {
					page: 1,
					list: []
				},
				loadMore: {
					show: false
				},
				address_type: 0
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.address(this, this.addresses.page + 1)
			},
			add: function() {
				uni.navigateTo({
					url: '/pages/address/build'
				})
			},
			operate: function(e, address) {
				model.operate(this, address)
			}
		},
		created: function() {
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.address_type = uni.getStorageSync('address_type') || 0
			model.address(this, 1)
		},
		onShow: function() {
			util.verifyLogin(true, false)
		},
		onReachBottom: function() {
			model.address(this, this.addresses.page + 1)
		}
	}
</script>
<style scoped>

</style>
