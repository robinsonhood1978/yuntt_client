<template>
	<view>
		<view class="fixed-top search-box">
			<view class="uni-flex uni-row pb10 pt10">
				<!-- #ifdef APP-PLUS || H5 -->
				<uni-icons v-on:click="pageback" type="arrowleft" class="ml10" size="44"></uni-icons>
				<!-- #endif -->
				<view class="uni-flex uni-row width-surplus ml10 mr10 pr10 wraper">
					<uni-icons type="search" class="ml10" size="38" color="gray"></uni-icons>
					<navigator url="/pages/search/index" hover-class="none" class="f-14 width-surplus f-gray input">{{selectors.keyword||'请输入关键词'}}</navigator>
				</view>
				<!-- #ifndef MP -->
				<uni-icons v-on:click="showPopup($event, 'morenav')" type="more-filled" class="mr10" size="44"></uni-icons>
				<uni-popup ref="morenav" type="dialog">
					<my-popup-morenav></my-popup-morenav>
				</uni-popup>
				<!-- #endif -->
			</view>
			<view class="uni-flex uni-row navtab">
				<view v-for="(item, key, index) in tabbars" :key="index" hover-class="none" :class="['item uni-center pt5 pb5 f-16', (gallery.selected == key || (!gallery.selected && key == '')) ? 'current' : '']"
				 @click="galleryby(key)"><text>{{item}}</text></view>
			</view>
		</view>

		<view v-if="gallery.list.length > 0" class="gallery mg5">
			<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item, index) in gallery.list" :key="index" class="item">
					<navigator :url="'/pages/goods/index?id='+item.goods_id" class="round-edge bgf mg5">
						<image :src="item.default_image" mode="widthFix"></image>
						<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
						<view class="uni-flex uni-row mt5 pb5 width-between">
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
	import model from './goods.js'
	export default {
		data() {
			return {
				tabbars: [],
				gallery: {
					selected: '',
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				},
				selectors: {}
			}
		},
		methods: {
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			pageback: function() {
				uni.navigateBack()
			},
			clickLoadMore: function(e) {
				model.gallery(this, this.gallery.page + 1, this.selectors)
			},
			galleryby: function(selected) {
				this.loadMore.show = false
				if (selected != this.gallery.selected) {
					this.gallery.list = [] // 清空原先加载的数据
					this.gallery.selected = selected
				}
				model.gallery(this, 1, this.selectors)
			}
		},
		created: function() {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.selectors.keyword = options.keyword ? options.keyword : ''
			this.selectors.cate_id = Number(options.cate_id)

			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1, this.selectors)
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1, this.selectors)
		}
	}
</script>
<style scoped>
	@import url("./goods.css");
</style>
