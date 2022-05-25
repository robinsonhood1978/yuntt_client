<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16">
				<text class="mr10">活动名称</text>
				<input v-model="limitbuy.title" class="width-surplus" placeholder="设置活动标题" />
				<uni-icons v-on:click="clearInput($event, 'title')" v-show="limitbuy.title" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">开始时间</text>
				<uni-datetime-picker class="width-surplus" :border="false" v-model="limitbuy.start_time"
					type="datetime">
					<text class="f-16 f-gray">{{limitbuy.start_time||'设置开始时间'}}</text>
				</uni-datetime-picker>
			</view>
			<view class="uni-flex uni-row pt10 pb10 flex-middle f-16 bt">
				<text class="mr10">结束时间</text>
				<uni-datetime-picker class="width-surplus" :border="false" v-model="limitbuy.end_time" type="datetime">
					<text class="f-16 f-gray">{{limitbuy.end_time||'设置结束时间'}}</text>
				</uni-datetime-picker>
			</view>
		</view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pt5 pr10 pb5 pl10">
			<view class="uni-flex uni-row pt10 pb10 flex-middle width-between f-16">
				<text class="mr10">抢购商品</text>
				<navigator url="/pages/popup/goods?redirect=yes" hover-class="none" class="f-16 f-red">
					<text v-if="!goods.goods_id">添加</text>
					<text v-else>更换</text>
				</navigator>
			</view>
			<view v-if="gallery.list.length > 0" class="gallery">
				<view v-for="(item, index) in gallery.list" :key="index" class="uni-flex uni-row bt pt10">
					<view class="image">
						<image :src="item.image||goods.default_image" mode="widthFix"></image>
					</view>
					<view class="uni-flex uni-column ml10">
						<text class="line-clamp-2 l-h20">{{goods.goods_name}}</text>
						<text class="f-gray">{{item.specification}}</text>
						<view class="uni-flex uni-row mt5 flex-middle">
							<text class="uni-bold f-15">{{item.price|currency}}</text>
							<text class="f-gray ml10">库存{{item.stock||0}}件</text>
						</view>

						<view class="uni-flex uni-row width-between pt10 flex-middle mt10">
							<text class="width-surplus f-gray">折扣</text>
							<view class="uni-flex uni-row flex-middle flex-end">
								<input v-model="item.discount" type="digit" maxlength="4" placeholder="0.01-9.99"
									class="mr5 f-12 uni-center" />
								<text>折</text>
							</view>
						</view>
						<view class="uni-flex uni-row width-between pb10 flex-middle mt5">
							<text class="width-surplus f-gray width-surplus">减价</text>
							<view class="uni-flex uni-row flex-middle flex-end">
								<input v-model="item.decrease" type="number" placeholder="输入金额"
									class="mr5 f-12 uni-center" />
								<text>元</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pd10">
			<view v-on:click="submit" class="mybutton f-white f-16 mt10">保存提交</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	export default {
		data() {
			return {
				id: 0,
				goods: {},
				goods_id: 0,
				gallery: {
					list: []
				},
				limitbuy: {
					start_time: '',
					end_time: ''
				}
			}
		},
		methods: {
			submit() {
				model.submit(this)
			},
			clearInput(e, field) {
				this.limitbuy[field] = ''
			}
		},
		onLoad(options) {
			this.id = options.id || 0
			this.goods_id = options.goods_id || 0
			if (this.id) {
				model.limitbuy(this)
			} else {
				model.goods(this)
			}
		},
		onShow() {
			uni.setStorageSync('redirect', util.getUrl())
			if (!util.verifySeller(false)) {
				return util.redirectUrl('/pages/seller/login/login?redirect=yes')
			}
		}
	}
</script>

<style scoped>
	.mybutton {
		border-radius: 20rpx;
	}

	.gallery .image,
	.gallery image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
	}

	.gallery input {
		width: 140rpx;
		padding: 8rpx 0;
		background-color: #F5F5F5;
		border-radius: 10rpx;
	}
</style>
