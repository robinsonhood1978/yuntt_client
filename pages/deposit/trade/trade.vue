<template>
	<view>
		<view class="mt10" v-if="gallery.list.length > 0">
			<view v-for="(item, index) in gallery.list" :key="index"
				class="uni-flex uni-row bgf pl10 flex-middle width-between">
				<view class="uni-center portrait">
					<image v-if="visitor.userid == item.buyer_id && item.seller_id > 0" :src="item.seller_portrait"
						class="image" mode="scaleToFill"></image>
					<image v-else-if="visitor.userid == item.seller_id && item.buyer_id > 0" :src="item.buyer_portrait"
						class="image" mode="scaleToFill"></image>
					<text v-else class="iconfont iconyue f-yellow"></text>
				</view>
				<view :class="['uni-flex uni-row width-surplus pt10 pb10 flex-middle', index > 0 ? 'bt' : '']">
					<view class="uni-flex uni-column width-surplus ml10 mr10 pr10">
						<text class="line-clamp-1 f-15">{{item.title}}</text>
						<text class="f-gray pt5">{{item.add_time}}</text>
					</view>
					<view class="uni-flex uni-column mr10 pr5" style="text-align: right;">
						<view class="f-18 uni-bold">
							<text v-if="item.flow == 'income'">+</text>
							<text v-else>-</text>
							<text>{{item.amount}}</text>
						</view>
						<text
							:class="[item.status == 'PENDING' ? '' : (item.status == 'CLOSED' ? 'f-gray' : (item.status == 'SUCCESS' ? 'f-blue' : 'f-red'))]">{{item.status|translator('trade')}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无记录</view>
		</view>
		<uni-load-more class="mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
			:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>

		<!-- #ifdef H5-->
		<view class="morenavh5" v-on:click="showPopup($event, 'morenavh5')">
			<view class="pl5 pr5 pt10 pb10 absolute f-white">快<br>捷<br>导<br>航</view>
			<uni-popup ref="morenavh5" type="dialog">
				<my-popup-morenav position="leftbottom"></my-popup-morenav>
			</uni-popup>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './trade.js'
	export default {
		data() {
			return {
				visitor: {},
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
			},
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
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
			this.visitor = uni.getStorageSync('visitor') || {}
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
	.portrait,
	.portrait .image {
		width: 100rpx;
		height: 100rpx;
		overflow: hidden;
		background-color: #FFFFFF;
		border-radius: 100%;
	}

	.portrait .iconfont {
		font-size: 90rpx;
		line-height: 104rpx;
	}
</style>
