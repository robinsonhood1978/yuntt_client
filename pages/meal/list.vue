<template>
	<view>
		<view class="fixed-top search-box">
			<view class="uni-flex uni-row pb10 pt10">
				<!-- #ifdef H5 -->
				<uni-icons v-show="!isAppBrowser" v-on:click="pageback" type="arrowleft" class="ml10" size="44">
				</uni-icons>
				<!-- #endif -->
				<view class="uni-flex uni-row width-surplus ml10 mr10 pr10 wraper">
					<uni-icons type="search" class="ml10" size="38" color="gray"></uni-icons>
					<input v-on:confirm="galleryby(gallery.selected)" v-model="gallery.keyword"
						class="mt5 f-14 width-surplus pr10 input" placeholder="请输入关键词" />
				</view>
				<!-- #ifdef H5 -->
				<uni-icons v-show="!isAppBrowser" v-on:click="showPopup($event, 'morenav')" type="more-filled"
					class="mr10" size="44"></uni-icons>
				<uni-popup v-show="!isAppBrowser" ref="morenav" type="dialog">
					<my-popup-morenav></my-popup-morenav>
				</uni-popup>
				<!-- #endif -->
			</view>
			<view class="uni-flex uni-row navtab">
				<view v-for="(item, key, index) in tabbars" :key="index" hover-class="none"
					:class="['item uni-center pt5 pb5 f-16', (gallery.selected == key || (!gallery.selected && key == '')) ? 'current' : '']"
					@click="galleryby(key)"><text>{{item}}</text></view>
			</view>
		</view>

		<view v-if="gallery.list.length > 0" class="gallery mg5">
			<view class="uni-flex uni-column">
				<view v-for="(list, index) in gallery.list" :key="index" class="round-edge bgf mg5 list">
					<view v-for="(item, key) in list.items" :key="key" class="item">
						<view class="uni-flex uni-row flex-middle">
							<navigator :url="'/pages/goods/index?id='+item.goods_id" hover-class="none"
								class="ml10 mt5">
								<image :src="item.goods_image" mode="widthFix"></image>
							</navigator>
							<view class="uni-flex uni-column mb10 mt10 pt10 pb10 ml10 mr10">
								<view :class="[key > 0 ? 'bt' : '']" style="margin-top: -50rpx;"></view>
								<navigator :url="'/pages/goods/index?id='+item.goods_id" hover-class="none"
									class="line-clamp-2 l-h20 mt10 pt5">{{item.goods_name}}</navigator>
								<view class="mt10 l-h20 spec-box">
									<text v-if="item.spec_qty > 0"
										v-on:click="showPopup($event, 'specs', list.meal_id, item)"
										class="uni-text-gray">{{item.specification}}</text>
									<text v-else class="uni-text-gray">默认规格</text>
								</view>
								<view class="uni-flex uni-row mt10 flex-middle width-between">
									<text class="f-red uni-bold">{{item.price|currency}}</text>
									<text class="f-gray">已售{{item.sales||0}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="uni-flex uni-row f-white panel pd10">
						<view class="uni-flex uni-column lb uni-center pt5 pb5 flex-center flex-middle">
							<text class="f-15 line-clamp-1">原总价</text>
							<text class="f-17 del">{{list.price|currency}}</text>
						</view>
						<view v-on:click="submit(list.meal_id)"
							class="uni-flex uni-row rb uni-center pt5 pb5 flex-center flex-middle">
							<view class="uni-flex uni-column mr10" style="line-height: 40rpx;">
								<text class="f-15">搭配价</text>
								<text class="f-17">{{list.mealPrice|currency}}</text>
							</view>
							<uni-icons type="arrowright" size="40" color="#ffffff"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
				:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无搭配购商品</view>
		</view>

		<!-- 选择规格弹窗-->
		<uni-popup ref="specs" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-specs @close="close" @confirm="confirm" :item="popup" :showQuantity="false" successText="规格已更新">
			</my-popup-specs>
		</uni-popup>

		<!-- #ifdef H5-->
		<view class="morenavh5" v-on:click="showPopup($event, 'morenavh5')">
			<view class="pl5 pr5 pt10 pb10 absolute f-white">快<br>捷<br>导<br>航</view>
			<uni-popup ref="morenavh5" type="dialog">
				<my-popup-morenav position="leftbottom"></my-popup-morenav>
			</uni-popup>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				goods_id: 0,
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
				},
				popup: {
					goods_id: 0
				},
				form: {
					meal_id: 0,
					selected: {}
				}
			}
		},
		methods: {
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
			},
			submit: function(id) {
				model.submit(this, id)
			},
			showPopup: function(e, popup, mid, item) {
				if (popup != 'morenavh5') {
					this.popup = item
					this.form.meal_id = mid
					this.$forceUpdate()
				}
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			},
			close(done) {
				done()
			},
			confirm(done, item) {
				model.changeSpec(this, item)
				done()
			}
		},
		created: function() {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			if (options.goods_id) {
				this.goods_id = options.goods_id
			}
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
