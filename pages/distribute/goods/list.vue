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
					:class="['item uni-center pt5 pb5 f-16', gallery.selected == key ? 'current' : '']"
					@click="galleryby(key)"><text>{{item}}</text></view>
			</view>
		</view>

		<view v-if="gallery.list.length > 0" class="gallery mg5">
			<view class="uni-flex uni-column">
				<view v-for="(item, index) in gallery.list" :key="index" class="item">
					<view class="uni-flex uni-row round-edge bgf mg5">
						<navigator :url="'/pages/goods/index?id='+item.goods_id" hover-class="none"
							class="ml10 mt10 pt5">
							<image :src="item.default_image" mode="widthFix"></image>
						</navigator>
						<view class="uni-flex uni-column ml10 pb10 mr10 pt10">
							<navigator :url="'/pages/goods/index?id='+item.goods_id" hover-class="none"
								class="line-clamp-2 l-h20">{{item.goods_name}}</navigator>
							<text class="f-yellow mt5">三级返佣：{{dynamicValue(item.ratio1)}}、{{dynamicValue(item.ratio2)}}、{{dynamicValue(item.ratio3)}}</text>
							<view class="uni-flex uni-row mt5 width-between">
								<text class="f-red f-16">{{item.price|currency}}</text>
								<text class="f-gray mr10">已售{{item.sales||0}}件</text>
							</view>
							<view class="uni-flex uni-row mt10 width-between flex-middle">
								<navigator :url="'/pages/store/index?id='+item.store_id" hover-class="none">
									<text class="f-gray">{{item.store_name}}</text>
									<uni-icons size="28" color="gray" type="arrowright"></uni-icons>
								</navigator>
								<view v-if="gallery.selected == 'pending'" v-on:click="distribute(item)"
									class="mybutton outside f-red">加入分销</view>
								<view v-else v-on:click="showPopup($event, 'share', item)"
									class="mybutton outside f-red">立即推广</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view v-if="gallery.selected == 'pending'" class="uni-text-gray">暂无可分销的商品</view>
			<view v-else class="f-gray">暂无分销中的商品</view>
		</view>
		<uni-load-more class="mb10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
			:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>

		<!-- 分享到弹窗-->
		<uni-popup ref="share" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-share :body="share.body"></my-popup-share>
		</uni-popup>
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
					selected: 'going',
					list: [],
					page: 1,
					keyword: ''
				},
				share: {
					body: {}
				},
				isAppBrowser: false,
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			clickLoadMore() {
				model.gallery(this, this.gallery.page + 1)
			},
			galleryby(selected) {
				this.loadMore.show = false
				if (selected != this.gallery.selected) {
					this.gallery.list = [] // 清空原先加载的数据
					this.gallery.selected = selected
				}
				model.gallery(this, 1)
			},
			distribute(item) {
				model.distribute(this, item)
			},
			showPopup(e, popup, item) {
				if (popup == 'share') {
					this.share.body = model.shareBody(this, item)
				}
				return this.$refs[popup].open()
			},
			closePopup(e, popup) {
				return this.$refs[popup].close()
			},
			dynamicValue(value) {
				return Number(value) * 100 + '%'
			}
		},
		created() {
			model.tabbars(this)
			model.showLoadMore(this)
		},
		onLoad(options) {
			if (options.type) {
				this.gallery.selected = options.type
			}
		},
		onShow() {
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.merchant(this)

				this.gallery.list = [] // 清空原先加载的数据
				model.gallery(this, 1)
			}
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		},
		onShareAppMessage(res) {
			return model.shareBody(this)
		},
		onShareTimeline(res) {
			return model.shareBody(this)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
