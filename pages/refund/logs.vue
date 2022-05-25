<template>
	<view>
		<view v-if="refund.status != 'SUCCESS' && refund.status != 'CLOSED'" class="uni-flex uni-column pd10">
			<view class="mb10 bgf round-edge wraper">
				<textarea v-on:input="oninput" class="textarea f-16" auto-height="true" placeholder="填写留言内容"></textarea>
			</view>
			<view v-on:click="submit" class="mybutton f-white f-15 mt10 uni-bold">提交</view>
		</view>
		<view v-if="gallery.list.length > 0" class="order-list mt10">
			<view v-for="(refund,index) in gallery.list" :key="index">
				<view class="uni-flex uni-column round-edge bgf pd10 ml10 mr10 mb10">
					<view class="uni-flex uni-row pl10 pr10 pb10 pt5 width-between">
						<text class="uni-bold">{{refund.sender}}</text>
						<text>{{refund.created}}</text>
					</view>
					<view class="bt pd10">{{refund.content}}</view>
				</view>
			</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './logs.js'
	export default {
		data() {
			return {
				refund_id: 0,
				refund: {},
				gallery: {
					list: [],
					page: 1
				},
				content: '',
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			oninput: function(e) {
				this.content = e.detail.value
			},
			submit: function() {
				model.submit(this)
			},
			clickLoadMore: function(e) {
				model.gallery(this, this.gallery.page + 1)
			}
		},
		created: function(e) {
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.refund_id = options.id
			model.refund(this)
			model.gallery(this, 1)
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		},
		onPullDownRefresh: function() {
			this.loadMore.show = false
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1)
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	.wraper {
		padding: 30rpx 20rpx 80rpx 20rpx;
		border-radius: 10rpx;
	}

	.wraper .textarea {
		width: 100%;
	}

	.mybutton {
		border-radius: 10rpx;
	}
</style>
