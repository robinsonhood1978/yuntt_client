<template>
	<view>
		<view v-if="gallery.list.length > 0" class="gallery mg5">
			<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item, index) in gallery.list" :key="index" class="item">
					<navigator :url="'/pages/goods/index?id='+item.goods_id" open-type="redirect" class="round-edge bgf mg5">
						<image :src="item.default_image" mode="widthFix"></image>
						<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
						<view class="uni-flex uni-row pb10 mt10 width-between">
							<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
							<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="pd10 uni-center uni-text-gray">—— 没有更多了 ——</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无访问记录</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './goods.js'
	export default {
		data() {
			return {
				gallery: {
					list: []
				}
			}
		},
		onLoad: function(options) {
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this)
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		}
	}
</script>
<style scoped>
</style>
