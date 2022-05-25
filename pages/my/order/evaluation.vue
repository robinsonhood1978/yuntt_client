<template>
	<view>
		<view v-if="order.evaluation_status == 0">
			<view class="round-edge ml10 mr10 bgf pd10 mt10" v-for="(item, index) in order.items" :key="index">
				<navigator open-type="redirect" hover-class="none" :url="'/pages/goods/index?id='+item.goods_id" class="uni-flex uni-row item mt10">
					<image class="image" :src="item.goods_image" mode="widthFix"></image>
					<text class="line-clamp-2 l-h20 ml10">{{item.goods_name}}</text>
				</navigator>
				<view class="uni-flex uni-row mt10">
					<text class="mr10">描述相符</text>
					<uni-rate @change="goodsChange($event, item.spec_id)" v-model="evaluations.goods[item.spec_id].value" :size="44"
					 :margin="14" :is-fill="false" color="#bbbbbb" active-color="#fc2b34" />
				</view>
				<view class="uni-flex uni-row width-surplus">
					<textarea v-model="evaluations.goods[item.spec_id].comment" class="bt pt10 mt10 pd10 f-14" auto-height="true"
					 placeholder="输入您对宝贝的评价"></textarea>
				</view>
			</view>
			<view class="ml10 mr10 pd10 bgf round-edge mt10">
				<text class="uni-bold">店铺动态评分</text>
				<view class="uni-flex uni-row mt10">
					<text class="mr10">服务评分</text>
					<uni-rate @change="storeChange($event, 'service')" v-model="evaluations.store.service" :size="44" :margin="14"
					 :is-fill="false" color="#bbbbbb" active-color="#fc2b34" />
				</view>
				<view class="uni-flex uni-row mt10">
					<text class="mr10">物流评分</text>
					<uni-rate @change="storeChange($event, 'shipped')" v-model="evaluations.store.shipped" :size="44" :margin="14"
					 :is-fill="false" color="#bbbbbb" active-color="#fc2b34" />
				</view>
			</view>

			<view class="fixed-bottom">
				<view @click="submit" class="uni-center ml10 mr10 mb10 f-white width-surplus mybutton f-15 uni-bold">提交评价</view>
			</view>
			<view class="fixed-space"></view>
		</view>
		<view v-else class="ml10 mr10 mt10 round-edge bgf pd10">该订单已评价，不能重复评价</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './evaluation.js'
	export default {
		data() {
			return {
				order: {
					order_id: 0,
					evaluation_status: 0,
					items: []
				},
				evaluations: {
					goods: {},
					store: {
						service: 5,
						shipped: 5
					}
				}
			}
		},
		methods: {
			goodsChange: function(e, index) {
				this.evaluations.goods[index].value = e.value
			},
			storeChange: function(e, type) {
				this.evaluations.store[type] = e.value
			},
			submit: function() {
				model.submit(this)
			}
		},
		onShow: function() {
			if(util.verifyLogin(true, this.$mp.page.route)) {
				model.order(this)
			}
		},
 		onLoad: function(options) {
			this.order.order_id = options.order_id
		}
	}
</script>
<style scoped>
	@import url("./evaluation.css");
</style>
