<template>
	<view>
		<view class="fixed-top search-box">
			<view class="uni-flex uni-row pb10 pt10">
				<!-- #ifdef H5 -->
				<uni-icons v-show="!isAppBrowser" v-on:click="pageback" type="arrowleft" class="ml10" size="44"></uni-icons>
				<!-- #endif -->
				<view class="uni-flex uni-row width-surplus ml10 mr10 pr10 wraper">
					<uni-icons type="search" class="ml10" size="38" color="gray"></uni-icons>
					<input v-on:confirm="galleryby(gallery.selected)" v-model="gallery.keyword"
						class="mt5 f-14 width-surplus pr10 input" placeholder="请输入关键词" />
				</view>
				<!-- #ifdef H5 -->
				<uni-icons v-show="!isAppBrowser" v-on:click="showPopup($event, 'morenav')" type="more-filled" class="mr10" size="44"></uni-icons>
				<uni-popup v-show="!isAppBrowser" ref="morenav" type="dialog">
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
			<view class="uni-flex uni-column">
				<view v-for="(item, index) in gallery.list" :key="index" class="item">
					<view class="uni-flex uni-row flex-middle round-edge bgf mg5">
						<navigator :url="'/pages/goods/team?id='+item.goods_id" hover-class="none" class="ml10 mt5">
							<image :src="item.goods_image" mode="widthFix"></image>
						</navigator>
						<view class="uni-flex uni-column ml10 pb10 mr10 pt10">
							<navigator :url="'/pages/goods/team?id='+item.goods_id" hover-class="none" class="line-clamp-2 l-h20">{{item.goods_name}}</navigator>
							<view class="uni-flex uni-row mt5 width-between">
								<view class="f-red uni-bold">{{item.teamPrice|currency}}</view>
								<navigator :url="'/pages/store/index?id='+item.store_id" hover-class="none">
									<text class="ml10 f-13 f-gray">{{item.store_name}}</text>
									<uni-icons size="24" color="gray" type="arrowright"></uni-icons>
								</navigator>
							</view>
							<view class="uni-flex uni-row mt10 width-between">
								<view class="mr10">
									<text>{{item.people}}人团</text>
									<text class="f-gray ml10">已拼{{item.sales||0}}件</text>
								</view>
								<navigator :url="'/pages/goods/team?id='+item.goods_id" hover-class="none"
									class="mybutton f-white">去开团</navigator>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无拼团商品</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
			:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				tabbars: [],
				gallery: {
					selected: '',
					list: [],
					page: 1,
					keyword: ''
				},
				isAppBrowser: false,
				loadMore: {
					show: false
				}
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
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1)
		},
		onShow() {
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
