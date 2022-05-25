<template>
	<view>
		<view v-if="gallery.list.length > 0" class="pt10">
			<view v-for="(item, index) in gallery.list" :key="index" class="bgf round-edge pb10 ml10 mr10 mb10 item">
				<view class="uni-flex uni-row width-between">
					<view class="uni-flex uni-row width-surplus pd10">
						<view class="mr10">
							<view class="uni-flex uni-row">
								<text class="f-red f-14 mt10">￥</text>
								<text class="f-25 f-red uni-bold">{{item.coupon_value|currency('', 0)}}</text>
							</view>
						</view>
						<view class="uni-flex uni-column ml10 pl10">
							<text class="line-clamp-1 f-16">满{{item.min_amount|currency('', 0)}}元可用</text>
							<text class="f-gray f-12">全店通用</text>
							<text class="f-gray f-12">截止：{{item.end_time}}</text>
						</view>

					</view>
					<uni-icons v-on:click="operate(item)" type="more-filled" size="40" class="mr10" color="#666666">
					</uni-icons>
				</view>
				<view class="uni-flex uni-row width-between mr10">
					<text></text>
					<view :class="['mybutton f-12 uni-bold', item.available == 1 ? '' : 'invalid']">
						<navigator v-if="item.available == 1" :url="'/pages/seller/coupon/build?id='+item.coupon_id" hover-class="none">修改</navigator>
						<text v-else>已失效</text>
					</view>
				</view>
			</view>
			<uni-load-more class="mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
				:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>

			<view class="uni-flex">
				<view class="fixed-bottom bgf">
					<navigator url="/pages/seller/coupon/build" class="mybutton f-white f-15 mt10 mr10 mb10 ml10"
						hover-class="none">创建优惠券</navigator>
				</view>
				<view class="bottom-placeholder"></view>
			</view>
		</view>
		<view v-else class="flex-middle">
			<navigator url="/pages/seller/coupon/build" hover-class="none"
				class="width-surplus ml10 mr10 mt10 bgf round-edge pd10 flex-middle">
				<uni-icons type="plusempty" size="44"></uni-icons>
				<text class="f-16">创建优惠券</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
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
			operate(item) {
				model.operate(this, item)
			},
			clickLoadMore(e) {
				model.gallery(this, this.gallery.page + 1)
			}
		},
		created() {
			model.showLoadMore(this)
		},
		onLoad(options) {
			model.gallery(this, 1)
		},
		onShow() {
			if (!util.verifySeller(false)) {
				uni.setStorageSync('redirect', this.$mp.page.route)
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
