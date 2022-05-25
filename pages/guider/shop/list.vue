<template>
	<view>
		<view v-if="gallery.list.length > 0">
			<map class="maps relative" :latitude="maps.latitude" :longitude="maps.longitude" :markers="maps.markers">
				<!-- #ifdef MP-->
				<cover-image v-on:click="pageback" class="roundleft" src="/static/images/roundleft.png"></cover-image>
				<!-- #endif-->
				<!-- #ifndef MP -->
				<cover-image v-on:click="pageback" class="arrowleft" src="/static/images/arrowleft.png"></cover-image>
				<!-- #endif-->
				<!-- <cover-view class="button f-15">搜索提货点地址/小区/门店名</cover-view>
				<cover-image class="search ml10" src="/static/images/search.png"></cover-image> -->
			</map>
			<view class="gallery pt10">
				<view class="uni-center line"></view>
				<view class="pd10 f-15 uni-bold f-gray">附近提货点</view>
				<view class="pl10 pr10">
					<view v-on:click="choseitem(item)" v-for="(item,index) in gallery.list" :key="index"
						:class="['uni-flex uni-row list pt10 pl10 pr10 flex-middle mb10 relative', gallery.selected == item.id ? 'selected' : '']">
						<text v-if="index == 0" class="nearest absolute f-white f-12">距离最近</text>
						<view class="image mb10">
							<image :src="item.banner" mode="scaleToFill"></image>
						</view>
						<view class="uni-flex uni-column mb10">
							<view class="uni-flex uni-row width-between flex-middle">
								<text class="ml10 mr10 l-h20 uni-bold f-15">{{item.address}}{{item.name}}</text>
							</view>
							<view class="uni-flex uni-column f-gray ml10 l-h20 mr10">
								<text class="f-c60 uni-bold">距离{{distanceValue(item.distance)}}</text>
								<text
									class="line-clamp-2">{{item.province||''}}{{item.city||''}}{{item.district||''}}{{item.address}}{{item.name}}</text>
							</view>
						</view>
						<radio :checked="gallery.selected == item.id" color="#ff6600"></radio>
					</view>
				</view>
				<uni-load-more v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
					:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
			</view>
			<view class="mt5">
				<view class="fixed-bottom bt bgf">
					<view v-on:click="confirm" class="mybutton f-white f-16 ml10 mr10 mb10 mt10">确认提货点</view>
				</view>
				<view class="bottom-placeholder"></view>
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
				maps: {
					latitude: 0,
					longitude: 0,
					markers: []
				},
				gallery: {
					selected: 0,
					list: [],
					page: 1,
				},
				redirect: '',
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			confirm() {
				let shopid = this.gallery.selected
				if (!shopid) {
					uni.showToast({
						title: '您还没有选择提货点哦',
						icon: 'none'
					})
					return false
				}
				uni.setStorageSync('guideshopid', shopid)
				
				if (!this.redirect) {
					this.redirect = '/pages/community/index/index'
				}

				util.redirectUrl(util.spliceUrl(this.redirect, {
					shopid: shopid
				}))
			},
			choseitem(item) {
				model.markers(this, item)
			},
			clickLoadMore() {
				model.gallery(this, this.gallery.page + 1)
			},
			distanceValue(value) {
				if (value >= 1000) {
					return Number(value / 1000).toFixed(0) + '公里'
				}
				return Number(value).toFixed(0) + '米'
			},
			pageback() {
				uni.navigateBack()
			}
		},
		created() {
			model.showLoadMore(this)
		},
		onLoad(options) {
			this.gallery.selected = options.shopid || 0

			// 不需要回跳，移除缓存
			util.reomveStorage('redirect', options.redirect != 'yes')
			this.redirect = uni.getStorageSync('redirect')

			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1)
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped>
	.maps {
		/* 官方不建议用百分比 */
		width: 750rpx;
		height: 750rpx;
	}

	.arrowleft,
	.roundleft {
		width: 70rpx;
		height: 70rpx;
		position: fixed;
		left: 20rpx;
		/* 小程序中无效 */
		background-color: rgba(0, 0, 0, 0.6);
	}

	.arrowleft {
		top: calc(var(--status-bar-height) + 20rpx);
		border-radius: 70rpx;
	}

	.roundleft {
		top: calc(var(--status-bar-height) + 0rpx);
	}

	/* .maps .search {
		width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
		border-radius: 100%;
		position: absolute;
		left: -420rpx;
		right: 0;
		margin: auto;
		top: 38rpx;
		z-index: 999;
	} 

	.maps .button {
		background-color: #ffffff;
		border-radius: 50rpx;
		width: 500rpx;
		height: 70rpx;
		line-height: 66rpx;
		margin: 20rpx auto 20rpx auto;
		text-align: center;
		color: #999;
	} */

	.maps .cover-image {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 64rpx;
		height: 88rpx;
	}

	.gallery .line {
		margin: 0 auto;
		width: 100rpx;
		height: 10rpx;
		background-color: #DDDDDD;
		border-radius: 20rpx;
	}

	.gallery .list {
		border: 2rpx #EEEEEE solid;
		border-radius: 20rpx;
		background-color: #FAFAFA;
	}

	.gallery .list.selected {
		border: 2rpx #FF6600 solid;
		border-radius: 20rpx;
		background-color: #fff8f4;
	}

	.gallery .list image,
	.gallery .list .image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 20rpx;
	}

	.gallery .list .nearest {
		background-color: #FF6600;
		left: -2rpx;
		top: -2rpx;
		z-index: 99;
		border-radius: 20rpx 0 20rpx 0;
		padding: 0 20rpx;
	}

	.gallery .mybutton {
		padding: 0;
		height: 60rpx;
		line-height: 60rpx;
		background-image: linear-gradient(to right, #ffa200, #ff570a);
	}

	.bottom-placeholder {
		width: 100%;
		height: 140rpx;

	}
</style>
