<template>
	<view class="fixed-top">
		<view v-if="gcategory.list.length > 0" class="uni-flex uni-row pt10">
			<scroll-view scroll-x="false" scroll-y="true" class="pt5 scroller" :style="style">
				<view v-for="(item, index) in gcategory.list" :key="index">
					<view v-on:click="change($event, item)" :class="['uni-center pl10 pr10 uni-ellipsis f-15 item', item.cate_id == selected ? 'f-red uni-bold selected' : '']">{{item.cate_name}}</view>
				</view>
				<view class="pb10 pt10"></view>
			</scroll-view>
			<scroll-view scroll-x="false" scroll-y="true" class="uni-flex uni-column width-surplus ml10 mr10 main" :style="style">
				<view v-if="gcategory.children" v-for="(category, index) in gcategory.children" :key="index">
					<view class="bgf round-edge pd5 mt10" style="min-width: 510rpx;">
						<navigator :url="'/pages/search/goods?cate_id='+category.cate_id" hover-class="none" class="uni-flex width-between"><text
							 class="f-15 uni-bold ml10">{{category.cate_name}}</text>
							<uni-icons type="arrowright" class="mr10"></uni-icons>
						</navigator>
						<view class="uni-flex uni-row pb10" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<view v-for="(item, index) in category.children" :key="index" class="pt10 item">
								<navigator :url="'/pages/search/goods?cate_id='+item.cate_id" hover-class="none" class="uni-flex uni-column uni-center">
									<image v-if="item.image" :src="item.image" mode="widthFix"></image>
									<image v-else src="/static/images/logo.png" mode="widthFix"></image>
									<text class="pr10 pl10 f-13 uni-ellipsis">{{item.cate_name}}</text>
								</navigator>
							</view>
						</view>
					</view>
				</view>
				<view class="pt10 pb10 uni-center uni-text-gray mb10" v-show="showend">—— 已经到底了 ——</view>
				<view class="pb5"></view>
			</scroll-view>
		</view>
		<view v-else class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
	</view>
</template>

<script>
	import model from './list.js'
	export default {
		data() {
			return {
				selected: 0,
				gcategory: {
					list: [],
					children: []
				},
				style: '',
				showend: true
			}
		},
		methods: {
			change: function(e, item) {
				this.selected = item.cate_id
				model.children(this, this.selected)
			}
		},
		onLoad: function(options) {
			model.gcategory(this)
		},
		onShow: function() {
			this.style = "height:" + (uni.getSystemInfoSync().screenHeight - 120) + "px"
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
