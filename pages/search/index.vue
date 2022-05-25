<template>
	<view>
		<view class="fixed-top search-box">
			<view class="uni-flex uni-row pb10 pt10">
				<!-- #ifdef APP-PLUS || H5 -->
				<uni-icons v-on:click="pageback" type="arrowleft" class="ml10" size="44"></uni-icons>
				<!-- #endif -->
				<view class="uni-flex uni-row width-surplus ml10 mr10 pr10 wraper">
					<uni-icons type="search" class="ml10" size="38" color="gray"></uni-icons>
					<input v-on:confirm="gallery" v-model="keyword" focus="true" class="mt5 f-14 width-surplus pr10 input" placeholder="请输入关键词" />
				</view>
				<!-- #ifndef MP -->
				<uni-icons v-on:click="showPopup($event, 'morenav')" type="more-filled" class="mr10" size="44"></uni-icons>
				<uni-popup ref="morenav" type="dialog">
					<my-popup-morenav></my-popup-morenav>
				</uni-popup>
				<!-- #endif -->
			</view>
		</view>
		<view class="pl5 pr5 pt10 mt10 keywords-list">
			<text class="ml10 f-gray">热搜</text>
			<view class="uni-flex uni-row mt5" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item, index) in keywords" :key="index">
					<navigator :url="'/pages/search/goods?keyword='+item" hover-class="none" class="item bgf mg5">{{item}}</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				keywords: ['iPhone', 'iPad', '女鞋', '女装', '韩版']
			}
		},
		onLoad() {

		},
		methods: {
			gallery() {
				uni.redirectTo({
					url: '/pages/search/goods?keyword=' + this.keyword
				})
			},
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			pageback: function() {
				uni.navigateBack()
			}
		}
	}
</script>
<style scoped>
	@import url("./index.css");
</style>
