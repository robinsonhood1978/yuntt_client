<template>
	<view>
		<view class="uni-flex uni-row fixed-top navtab">
			<view v-for="(item, key, index) in tabbars" :key="index" hover-class="none"
				:class="['item uni-center pt5 pb5 f-16', (orders.selected == key || (!orders.selected && key == 'all')) ? 'current' : '']"
				@click="galleryby(key)"><text>{{item}}</text></view>
		</view>
		<view v-if="orders.list.length > 0" class="order-list">
			<view v-for="(order,index) in orders.list" :key="index">
				<view class="round-edge bgf pd10 ml10 mr10 mb10">
					<view class="uni-flex uni-row shop mb10 width-between">
						<view class="uni-flex uni-row">
							<uni-icons type="person"></uni-icons>
							<text class="f-16">{{order.buyer_name}}</text>
						</view>
						<view :class="order.status == 0 ? 'f-gray' : 'f-red'">{{order.status|translator}}</view>
					</view>
					<view v-for="(goods, id) in order.items" :key="id"
						class="uni-flex uni-row width-between pt10 items">
						<view v-on:click="redirectMp(goods.goods_id)">
							<image class="image" :src="goods.goods_image" mode="widthFix" />
						</view>
						<view class="uni-flex uni-column ml10 mr10">
							<view v-on:click="redirectMp(goods.goods_id)" class="line-clamp-2 l-h20">
								{{goods.goods_name}}
							</view>
							<view class="f-gray">{{goods.specification}}</view>
							<view v-if="order.refund_id" class="mt5">
								<navigator v-if="order.refund_status == 'SUCCESS'"
									:url="'/pages/seller/refund/view?id='+order.refund_id" hover-class="none"
									class="f-blue">{{order.refund_status|translator('refund')}}</navigator>
								<text v-else-if="order.refund_status == 'CLOSED'"
									class="f-gray">{{order.refund_status|translator('refund')}}</text>
								<navigator v-else :url="'/pages/seller/refund/view?id='+order.refund_id"
									hover-class="none" class="f-red">退款中</navigator>
							</view>
						</view>
						<view class="uni-flex uni-column">
							<view>{{goods.price}}</view>
							<view class="f-gray" style="text-align: right;">x{{goods.quantity}}</view>
						</view>
					</view>
					<view class="uni-flex uni-row width-between mt10">
						<text></text>
						<view>共{{order.items.length}}件，实付款<text class="f-red ml5">{{order.order_amount|currency}}</text>
						</view>
					</view>
					<view class="uni-flex uni-row width-between mt10 operation">
						<text></text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<navigator v-if="order.express_no" :url="'/pages/order/logistic?order_id='+order.order_id"
								hover-class="none" class="f-13 mybutton pl10 pr10 f-white mr10 mt10">查看物流</navigator>
							<view v-if="order.status == 30" v-on:click="shipped(index, '修改单号')"
								class="f-13 mybutton pl10 pr10 f-white mr10 mt10">修改单号</view>
							<view v-if="order.status == 20" v-on:click="shipped(index, '发货')"
								class="f-13 mybutton pl10 pr10 f-white mr10 mt10">发货</view>
							<navigator :url="'/pages/seller/order/view?id='+order.order_id" hover-class="none"
								class="f-13 mybutton pl10 pr10 b-gray mt10">查看订单</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无订单</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
			:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>

		<!--发货弹窗表单组件-->
		<uni-popup v-if="orders.list.length > 0" ref="popup" type="dialog">
			<my-popup-shipped :title="title" @close="close" @confirm="confirm" :order="orders.list[modifyId]">
			</my-popup-shipped>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				tabbars: {},
				orders: {
					selected: 'all',
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				},
				title: '',
				modifyId: 0
			}
		},
		methods: {
			clickLoadMore: function(e) {
				model.orders(this, this.orders.page + 1)
			},
			galleryby: function(selected) {
				this.loadMore.show = false
				if (this.orders.selected != selected) {
					this.orders.list = [] // 清空原先加载的数据
					this.orders.selected = selected
				}
				model.orders(this, 1)
			},
			shipped: function(index, title) {
				this.modifyId = index
				this.title = title
				return this.$refs.popup.open()
			},
			close(done) {
				done()
			},
			confirm(done, post) {
				model.shipped(this, this.orders.list[this.modifyId], post.express_comkey, post.express_no)
				done()
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
			this.orders.selected = options.type
		},
		onShow: function() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}

			model.orders(this, 1)
		},
		onPullDownRefresh: function() {
			this.loadMore.show = false
			model.orders(this, 1)
		},
		onReachBottom: function() {
			model.orders(this, this.orders.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
