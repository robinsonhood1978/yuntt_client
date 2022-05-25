<template>
	<view>
		<view class="mt10" v-if="gallery.list.length > 0">
			<view v-for="(item, index) in gallery.list" :key="index" class="uni-flex uni-row bt bgf pd10 flex-middle">
				<view class="uni-flex uni-column width-surplus ml10 mr10">
					<text class="line-clamp-1 f-15">{{item.title}}</text>
					<text class="f-gray pt5">{{item.add_time}}</text>
				</view>
				<view class="uni-flex uni-column" style="text-align: right;">
					<view class="f-18 uni-bold">
						<text v-if="item.flow == 'income'">+</text>
						<text v-else>-</text>
						<text>{{item.amount}}</text>
					</view>
					<text :class="[item.status == 'PENDING' ? '' : (item.status == 'CLOSED' ? 'f-gray' : (item.status == 'SUCCESS' ? 'f-blue' : 'f-red'))]">{{item.status|translator('trade')}}</text>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无记录</view>
		</view>
		<uni-load-more class="mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './frozen.js'
	export default {
		data() {
			return {
				gallery: {
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.gallery(this, this.gallery.page + 1)
			}
		},
		created: function() {
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this)
		},
		onShow: function() {
			util.verifyLogin(true, false)
		},
		onPullDownRefresh: function() {
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1)
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>

</style>
