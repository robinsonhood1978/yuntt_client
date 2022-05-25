<template>
	<view>
		<view class="gallery" :style="{'--bgcolor': options.bgcolor, '--space': options.space + 'px'}">
			<view :class="['uni-flex uni-row ml5 mr5 flex-wrap wraper', options.theme||'square']">
				<view v-for="(item, index) in gallery.list" :key="index" class="round-edge bgf mt10 item">
					<navigator hover-class="none" :url="'/pages/goods/index?id='+item.goods_id"
						:class="[options.theme == 'list' ? 'uni-flex uni-row': '']">
						<image :src="item.default_image" mode="widthFix"></image>
						<view class="extra mb5 mt10 width-surplus">
							<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
							<view class="uni-flex uni-row mt5 pb5 width-between">
								<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
								<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
							</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<uni-load-more v-if="loadMore.show && options.paging == 1" @clickLoadMore="clickLoadMore"
			:status="loadMore.status" :showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import server from '@/common/server.js'
	import util from '@/common/util.js'
	export default {
		name: 'MyBlock',
		props: {
			options: {
				type: Object / String,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				gallery: {
					list: [],
					page: 1
				},
				params: {},
				loadMore: {
					status: "more",
					show: false,
					contentText: {
						contentdown: "查看更多",
						contentrefresh: "加载中...",
						contentnomore: "—— 没有数据了 ——"
					}
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {

				if (this.options.source == 'choice') {
					this.options.quantity = (this.options.items).split(',').length
					this.params.items = this.options.items
				} else if (this.options.source == 'category') {
					this.params.cate_id = this.options.cate_id
				}
				// 不分页
				this.params.page_size = this.options.quantity

				// 分页
				if (this.options.paging > 0) {
					this.params.page_size = this.options.page_size
				}

				this.getData(1)
			},
			getData(page) {
				let that = this

				// 触发onReachBottom事件
				if (page === false) {
					if (this.options.paging == 1) {
						page = that.gallery.page + 1
					} else {
						return false
					}
				}

				that.loadMore.status = "loading"
				server.request('goods/list', Object.assign(this.params, {
					page: page
				}), function(res) {

					let list = (res.code == 0) ? res.data.list : []
					if (list.length > 0) {
						// 合并数据
						that.gallery.list = that.gallery.list.concat(list)
						that.gallery.page = res.data.pagination.page
					}
					that.loadMore.show = true
					that.loadMore.status = list.length > 0 ? 'more' : 'noMore'
					uni.stopPullDownRefresh()
				})
			},
			clickLoadMore() {
				this.getData(this.gallery.page + 1)
			}
		},
		onPageScroll() {
			console.log('kkk');
		}
	}
</script>
<style>
	.gallery {
		background-color: var(--bgcolor);
		padding-top: var(--space);
		padding-bottom: var(--space);
	}

	.gallery .item {
		margin-left: 10rpx;
		margin-right: 10rpx;
		width: calc(50% - 20rpx);
	}

	.gallery .item image {
		width: 100%;
		height: 350rpx;
		display: block;
		border-radius: 20rpx 20rpx 0 0;
	}

	.gallery .item:nth-child(1),
	.gallery .square .item:nth-child(2) {
		margin-top: 0;
	}

	.gallery .list .item {
		width: calc(100% - 60rpx);
		border-radius: 20rpx;
		padding: 20rpx;
	}

	.gallery .list .item image {
		width: 250rpx;
		border-radius: 8rpx;
	}

	.gallery .banner .item {
		width: calc(100% - 20rpx);
	}
</style>
