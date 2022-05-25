<template>
	<view class="uni-swiper__warp">
		<slot />
		<view v-if="mode === 'default'" key='default' :style="{'background-color':dotsStyles.backgroundColor}" class="uni-swiper__dots-box uni-swiper__dots-nav">
			<text :style="{'color':dotsStyles.color}" class="uni-swiper__dots-nav-item">{{ (current+1)+"/"+info.length}}</text>
		</view>
	</view>
</template>

<script>
	/**
	 * SwiperDod 商品详情轮播图指示点
	 */

	export default {
		name: 'UniSwiperDot',
		props: {
			info: {
				type: Array,
				default () {
					return []
				}
			},
			current: {
				type: Number,
				default: 0
			},
			dotsStyles: {
				type: Object,
				default () {
					return {
						
					}
				}
			},
			// 类型 ：default(默认) 
			mode: {
				type: String,
				default: 'default'
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style scoped>
	.uni-swiper__warp {
		position: relative;
	}
	.uni-swiper__dots-box {
		width: 100%;
		position: absolute;
		bottom: 0rpx;
		right: 0;
		padding: 20rpx 0;
		text-align: right;
	}
	.uni-swiper__dots-nav-item {
		width: 60rpx;
		font-size: 28rpx;
		color: #fff;
		margin: 0 30rpx;
		border-radius: 50rpx;
		padding: 5rpx 30rpx;
		background-color: rgba(0, 0, 0, 0.3);
	}
</style>