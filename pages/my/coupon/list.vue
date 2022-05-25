<template>
	<view>
		<view v-if="gallery.list.length > 0">
			<view v-for="(item, index) in gallery.list" :key="index" class="uni-flex uni-row ml10 mr10 mt10 flex-middle">
				<view class="uni-flex uni-row width-surplus bgf pd10 flex-middle store">
					<view class="logo pt5 pb5"><image :src="item.store_logo" mode="scaleToFill"></image></view>
					<view class="uni-flex uni-column ml10">
						<text class="line-clamp-1">{{item.store_name}}</text>
						<text class="f-gray f-12">有效期：{{item.end_time}}</text>
					</view>
				</view>
				<view :class="['uni-flex uni-column f-white pl10 pr10 pb10 pt5 wraper', item.available == 1 ? '' : 'invalid']">
					<view><text>￥</text><text class="f-18 uni-bold">{{item.coupon_value|currency('', 0)}}</text></view>
					<view class="f-12">满{{item.min_amount|currency('', 0)}}元可用</view>
					<view class="f-12 uni-center pl10 pr10 button">
						<navigator v-if="item.available == 1" :url="'/pages/store/index?id='+item.store_id" open-type="redirect" hover-class="none">立即使用</navigator>
						<text v-else>已失效</text>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无优惠券</view>
		</view>
		<uni-load-more class="mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
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
			util.verifyLogin(true, this.$mp.page.route)
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
