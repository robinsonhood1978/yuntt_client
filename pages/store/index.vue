<template>
	<view>
		<view class="uni-flex uni-row fixed-top navtab">
			<view v-for="(item, key, index) in tabbars" :key="index" :class="['item uni-center pt5 pb5 f-16', (gallery.selected == key || (!gallery.selected && key == '')) ? 'current' : '']"
			 @click="galleryby(key)"><text>{{item}}</text></view>
		</view>
		<view v-if="gallery.list.length > 0" class="gallery mg5">
			<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item, index) in gallery.list" :key="index" class="item">
					<navigator :url="'/pages/goods/index?id='+item.goods_id" hover-class="none" class="round-edge bgf mg5">
						<image :src="item.default_image" mode="widthFix"></image>
						<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
						<view class="uni-flex uni-row mt10 pb10 width-between">
							<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
							<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无相关商品</view>
		</view>
		<uni-load-more v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import model from './index.js'
	export default {
		data() {
			return {
				id: 0,
				store: {},
				tabbars: [],
				gallery: {
					selected: '',
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
			galleryby: function(selected) {
				this.loadMore.show = false
				if (selected != this.gallery.selected) {
					this.gallery.list = [] // 清空原先加载的数据
					this.gallery.selected = selected
				}
				model.gallery(this, 1)
			}
		},
		created: function() {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.id = options.id
			model.store(this)
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1)
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
