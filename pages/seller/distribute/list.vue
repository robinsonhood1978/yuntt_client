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
						<view class="ml10 mt10 pt5">
							<image :src="item.default_image" mode="widthFix"></image>
						</view>
						<view class="uni-flex uni-column ml10 pb10 mr10 pt10">
							<view class="line-clamp-2 l-h20">{{item.goods_name}}</view>
							<view class="f-yellow mt5">
								<text v-if="gallery.selected == 'going'">三级返佣：{{dynamicValue(item.ratio1)}}、{{dynamicValue(item.ratio2)}}、{{dynamicValue(item.ratio3)}}</text>
								<view class="uni-flex uni-row mt5 width-between">
									<view class="f-red f-16">{{item.price|currency}}</view>
									<view class="mr10">
										<text class="f-gray">已售{{item.sales||0}}件</text>
									</view>
								</view>
							</view>
							<view v-if="gallery.selected == 'going'" class="uni-flex uni-row mt10 flex-middle width-between">
								<text v-if="!item.enabled" class="mybutton invalid">已失效</text>
								<navigator v-else :url="'/pages/seller/distribute/build?goods_id='+item.goods_id" hover-class="none"
									class="mybutton">调整比率</navigator>
								<uni-icons v-on:click="operate(item)" type="more-filled" size="40" class="mr5"
									color="#666666">
								</uni-icons>
							</view>
							<view v-if="gallery.selected == 'pending'" class="uni-flex uni-row mt10 flex-middle width-between">
								<navigator :url="'/pages/seller/distribute/build?goods_id='+item.goods_id" hover-class="none"
									class="mybutton">去设置</navigator>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view v-if="gallery.selected == 'pending'" class="uni-text-gray">暂无未分销的商品</view>
			<view v-else class="f-gray">暂无已分销的商品</view>
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
					selected: 'going',
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
			operate(item) {
				model.operate(this, item)
			},
			dynamicValue(value) {
				return Number(value) * 100 + '%'
			},
			pageback() {
				uni.navigateBack()
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
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}

			model.gallery(this, 1)
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
