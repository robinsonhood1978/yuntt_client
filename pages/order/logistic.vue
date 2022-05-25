<template>
	<view>
		<view v-if="logistic.number" class="uni-flex uni-column round-edge ml10 mr10 mt10 mb10 pd10 bg">
			<text>物流公司：{{logistic.company}}</text>
			<text>物流单号：{{logistic.number}}</text>
		</view>
		<view v-if="logistic.details && logistic.details.length > 0" class="pb10">
			<view class="round-edge ml10 mr10 bgf pd10 mt10 mb10">
				<view :class="['pb10', index == 0 ? 'f-red' : '']" v-for="(item, index) in logistic.details"
					:key="index" :style="index != 0 ? 'border-top:2rpx #ddd solid;padding-top:20rpx': ''">
					<view class="f-gray f-15">{{item.time}}</view>
					<view>{{item.context}}</view>
				</view>
			</view>
		</view>
		<view v-else class="uni-center">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
			<view class="uni-text-gray">暂无物流跟踪信息</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './logistic.js'
	export default {
		data() {
			return {
				logistic: {
					company: '',
					number: '',
					details: []
				}
			}
		},
		onShow: function() {
			util.verifyLogin(true, this.$mp.page.route)
		},
		onLoad: function(options) {
			if (!options.order_id) {
				return false
			}
			model.logistic(this, options.order_id)
		}
	}
</script>
<style scoped>
	.bg {
		background-image: linear-gradient(to right, #ff570a, #fc2b34);
		color: #FFFFFF;
		padding: 50rpx 20rpx;
	}
</style>
