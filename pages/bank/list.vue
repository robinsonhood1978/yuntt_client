<template>
	<view>
		<view class="mt10" v-if="banks.list.length > 0">
			<view v-on:click="operate($event, item)" v-for="(item, index) in banks.list" :key="index"
				:class="['ml10 mr10 mb10 pd10 round-edge item', 'item-'+item.short_name]">
				<view class="uni-flex uni-row width-between">
					<view class="logo uni-center mr10"><text :class="['iconfont', item.short_name]"></text></view>
					<view class="uni-flex uni-column width-surplus f-white">
						<text>{{item.bank_name}}</text>
						<text class="f-12" v-if="item.type == 'debit'">储蓄卡</text>
						<text class="f-12" v-else>信用卡</text>
						<text class="f-18">{{item.num}}</text>
						<text :class="['iconfont big-icon', item.short_name]"></text>
					</view>
				</view>
			</view>
			<uni-load-more class="mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
				:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>

			<view class="uni-flex">
				<view class="fixed-bottom bgf">
					<navigator url="/pages/bank/build" class="mybutton f-white f-15 mt10 mr10 mb10 ml10"
						hover-class="none">绑定银行卡</navigator>
				</view>
				<view class="bottom-placeholder"></view>
			</view>
		</view>
		<view v-else class="flex-middle">
			<navigator url="/pages/bank/build" hover-class="none"
				class="width-surplus ml10 mr10 mt10 bgf round-edge pd10 flex-middle">
				<uni-icons type="plusempty" size="44"></uni-icons>
				<text class="f-16">添加银行卡</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				banks: {
					page: 1,
					list: []
				},
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.banks(this, this.banks.page + 1)
			},
			operate: function(e, bank) {
				model.operate(this, bank)
			}
		},
		created: function() {
			model.showLoadMore(this)
		},
		onShow: function() {
			if (util.verifyLogin(true, false)) {
				model.banks(this, 1)
			}
		},
		onReachBottom: function() {
			model.banks(this, this.banks.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
