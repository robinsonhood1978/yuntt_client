<template>
	<view>
		<view v-if="addresses.list.length > 0" class="mt10">
			<radio-group>
				<navigator open-type="redirect" :url="redirectUrl(item.addr_id)" v-for="(item, addr_id, index) in addresses.list" :key="addr_id"
					class=" bgf ml10 mr10 mb10 pd10 round-edge">
					<label class="uni-flex uni-row width-between flex-middle">
						<view class="uni-flex uni-column ml10">
							<view><text class="uni-bold mr10">{{item.consignee}}</text><text>{{item.phone_mob}}</text>
							</view>
							<text class="f-gray">{{item.province}}{{item.city}}{{item.district||''}}{{item.address}}</text>
						</view>
						<radio class="radio mb5" :checked="item.addr_id == addresses.selected" color="#fc2b34" />
					</label>
				</navigator>
			</radio-group>
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
		<view class="fixed-space"></view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './address.js'
	export default {
		data() {
			return {
				addresses: {
					selected: 0,
					page: 1,
					list: []
				},
				loadMore: {},
				redirect: ''
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.address(this, this.addresses.page + 1)
			},
			add: function() {
				uni.redirectTo({
					url: '/pages/address/build?redirect=yes'
				})
			},
			redirectUrl: function(addr_id) {
				return util.spliceUrl(this.redirect, {
					addr_id: addr_id
				})
			}
		},
		created() {
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.addresses.selected = options.addr_id
			this.redirect = uni.getStorageSync('redirect')
			model.address(this, 1)
		},
		onReachBottom: function() {
			model.address(this, this.addresses.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./address.css");
</style>
