<template>
	<view>
		<view v-if="gallery.list.length > 0 || (gallery.keyword || gallery.selected)" class="fixed-top search-box">
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
		<view v-if="gallery.list.length > 0">
			<view class="gallery mg5">
				<view class="uni-flex uni-column">
					<view v-for="(item, index) in gallery.list" :key="index" class="item">
						<view class="uni-flex uni-row flex-middle round-edge bgf mg5">
							<view class="ml10 mt5">
								<image :src="item.goods_image" mode="widthFix"></image>
							</view>
							<view class="uni-flex uni-column ml10 pb10 mr10 pt10">
								<view class="line-clamp-2 l-h20">{{item.goods_name}}</view>
								<view class="uni-flex uni-row mt10 flex-middle">
									<view class="uni-flex uni-row mb10">
										<text class="f-red uni-bold">拼团价：{{item.teamPrice|currency}}</text>
										<text class="f-gray del ml10">{{item.price|currency}}</text>
									</view>
								</view>
								<view class="uni-flex uni-row mt10 flex-middle width-between">
									<text v-if="item.invalid" class="mybutton invalid">已失效</text>
									<view v-else v-on:click="redirectMp(item.goods_id)" class="mybutton">查看</view>
									<uni-icons v-on:click="operate(item)" type="more-filled" size="40" class="mr5"
										color="#666666">
									</uni-icons>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more class="mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore"
					:status="loadMore.status" :showIcon="true" :contentText="loadMore.contentText"></uni-load-more>

				<view class="uni-flex">
					<view class="fixed-bottom bgf">
						<navigator url="/pages/seller/teambuy/build" class="mybutton f-white f-15 mt10 mr10 mb10 ml10"
							hover-class="none">新增拼团活动</navigator>
					</view>
					<view class="bottom-placeholder"></view>
				</view>
			</view>
		</view>
		<view v-else>
			<view v-if="gallery.selected || gallery.keyword">
				<view class="uni-center">
					<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
					<view class="uni-text-gray">暂无拼团商品</view>
				</view>
			</view>
			<view v-else class="flex-middle">
				<navigator url="/pages/seller/teambuy/build" hover-class="none"
					class="width-surplus ml10 mr10 mt10 bgf round-edge pd10 flex-middle">
					<uni-icons type="plusempty" size="44"></uni-icons>
					<text class="f-16">创建拼团活动</text>
				</navigator>
			</view>
		</view>
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
			operate(item) {
				model.operate(this, item)
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
			redirectMp(id) {
				util.redirectMp('pages/goods/team?id=' + id)
			}
		},
		created: function() {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false

			model.gallery(this, 1)
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		},
		onReachBottom: function() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
