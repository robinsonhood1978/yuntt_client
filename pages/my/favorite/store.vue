<template>
	<view>
		<view v-if="gallery.list.length > 0" class="gallery mg5">
			<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item, index) in gallery.list" :key="index" class="item">
					<navigator :url="'/pages/store/index?id='+item.store_id" open-type="redirect" class="round-edge bgf mg5">
						<image :src="item.store_logo" mode="scaleToFill"></image>
						<view class="line-clamp-2 ml10 mr10 l-h20 pb10 f-15">{{item.store_name}}</view>
					</navigator>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无收藏店铺</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status" :showIcon="true"
		 :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './store.js'
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
</style>
