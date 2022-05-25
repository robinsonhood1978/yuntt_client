<template>
	<view>
		<view v-if="gallery.list.length > 0" class="gallery mt10">
			<radio-group>
				<view v-on:click="redirectUrl(goods.goods_id)" v-for="(goods, index) in gallery.list" :key="index"
					class="bgf ml10 mr10 mb10 pd10 round-edge">
					<label class="uni-flex uni-row flex-middle">
						<view class="image mr10">
							<image :src="goods.default_image" mode="scaleToFill"></image>
						</view>
						<view class="mr10">
							<text class="line-clamp-2 l-h20 mb5">{{goods.goods_name}}</text>
							<text class="f-15 f-red">{{goods.price|currency}}</text>
						</view>
						<radio class="radio mb5" :checked="goods.goods_id == gallery.selected" color="#fc2b34" />
					</label>
				</view>
			</radio-group>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无商品</view>
		</view>
		<uni-load-more v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
			:contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './goods.js'
	export default {
		data() {
			return {
				gallery: {
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
				model.gallery(this, this.gallery.page + 1)
			},
			redirectUrl: function(goods_id) {
				let redirect = util.spliceUrl(this.redirect, {
					goods_id: goods_id
				})
				util.redirectUrl(redirect)
			}
		},
		created() {
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.gallery.selected = options.goods_id
			this.redirect = uni.getStorageSync('redirect')
			model.gallery(this, 1)
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./goods.css");
</style>
