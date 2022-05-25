<template>
	<view>
		<view class="uni-flex uni-row fixed-top navtab">
			<view v-for="(item, key, index) in tabbars" :key="index" hover-class="none"
				:class="['item uni-center pt5 pb5 f-16', (refunds.selected == key || (!refunds.selected && key == '')) ? 'current' : '']"
				@click="galleryby(key)"><text>{{item}}</text></view>
		</view>
		<view v-if="refunds.list.length > 0" class="order-list mt10">
			<view v-for="(refund,index) in refunds.list" :key="index">
				<view class="round-edge bgf pd10 ml10 mr10 mb10">
					<view class="uni-flex uni-row shop mb10 width-between">
						<view class="uni-flex uni-row">
							<uni-icons type="person"></uni-icons>
							<text class="f-16">{{refund.buyer_name}}</text>
						</view>
					</view>
					<view v-on:click="redirectMp(goods.goods_id)" v-for="(goods, id) in refund.items" :key="id" class="uni-flex uni-row width-between pt10 items">
						<view>
							<image class="image" :src="goods.goods_image" mode="widthFix" />
						</view>
						<view class="uni-flex uni-column ml10 mr10">
							<view class="line-clamp-2 l-h20">{{goods.goods_name}}</view>
							<view class="f-gray">{{goods.specification}}</view>
						</view>
						<view class="uni-flex uni-column">
							<view>{{goods.price}}</view>
							<view class="f-gray" style="text-align: right;">x{{goods.quantity}}</view>
						</view>
					</view>
					<view class="uni-flex uni-row width-between pt10">
						<text></text>
						<view
							:class="['f-15', refund.status == 'CLOSED' ? 'f-gray' : (refund.status =='SUCCESS' ? 'f-green' : 'f-red')]">
							{{refund.status|translator('refund')}}</view>
					</view>
					<view class="uni-flex uni-row width-between mt10 operation bt">
						<text></text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<navigator :url="'/pages/seller/refund/view?id='+refund.refund_id" hover-class="none"
								class="f-13 mybutton pl10 pr10 f-white mr10 mt10">退款详情</navigator>
							<navigator :url="'/pages/seller/order/view?id='+refund.order_id" hover-class="none"
								class="f-13 mybutton pl10 pr10 gray mt10">订单详情</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无退款订单</view>
		</view>
		<uni-load-more v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
			:contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				tabbars: [],
				refunds: {
					selected: 'all',
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			galleryby: function(selected) {
				this.loadMore.show = false
				if (this.refunds.selected != selected) {
					this.refunds.list = [] // 清空原先加载的数据
					this.refunds.selected = selected
				}
				model.refunds(this, 1)
			},
			clickLoadMore: function(e) {
				model.refunds(this, this.refunds.page + 1)
			},
			redirectMp(id) {
				util.redirectMp('pages/goods/index?id=' + id)
			}
		},
		created: function(e) {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.refunds.selected = options.status || ''
			model.refunds(this, 1)
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		},
		onPullDownRefresh: function() {
			this.loadMore.show = false
			model.refunds(this, 1)
		},
		onReachBottom: function() {
			model.refunds(this, this.refunds.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
