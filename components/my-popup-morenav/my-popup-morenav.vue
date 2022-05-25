<template>
	<view>
		<view :class="['morenav pl5 pr5 relative', position]">
			<view class="uni-flex uni-column pl10 pr10">
				<navigator url="/pages/index/index" open-type="switchTab" hover-class="none" class="uni-flex uni-row flex-middle pt5 pb5 item">
					<uni-icons size="38" type="home"></uni-icons><text class="f-15 ml5">首页</text>
				</navigator>
				
				<navigator url="/pages/cart/index" open-type="switchTab" hover-class="none" class="uni-flex uni-row flex-middle pt5 pb5 bt item">
					<uni-icons size="38" type="cart"></uni-icons><text class="f-15 ml5">购物车</text>
				</navigator>
				<navigator url="/pages/user/index" open-type="switchTab" hover-class="none" class="uni-flex uni-row flex-middle pt5 pb5 bt item">
					<uni-icons size="38" type="person"></uni-icons><text class="f-15 ml5">我的</text>
				</navigator>
				<navigator url="/pages/search/index" open-type="redirect" hover-class="none" class="uni-flex uni-row flex-middle pt5 pb5 bt item">
					<uni-icons size="38" type="search"></uni-icons><text class="f-15 ml5">搜索</text>
				</navigator>
			</view>
			<view v-show="position == 'leftbottom'" @click.stop="close()" class="pl5 pr5 pt10 pb10 absolute f-white">快<br>捷<br>导<br>航</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			beforeClose: {
				type: Boolean,
				default: false
			},
			position: {
				type: String,
				default: 'topright'
			}
		},
		data() {
			return {
				
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = this.position == 'leftbottom' ? false : true
		},
		methods: {
			close() {
				this.popup.close()
			}
		}
	}
</script>
<style scoped>
	.morenav {
		position: fixed;
		/* 需要高过头部和底部导航 */
		z-index: 1000;
		width: 220rpx;
		height: 358rpx;
		right: 20rpx;
		top: calc(var(--window-top) + 80rpx);
		/* #ifndef H5 */
		top: calc(var(--window-top) + 120rpx);
		/* #endif */
		background-color: rgba(255, 255, 255, 0.95);
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 4rpx 0rpx #dedede;
	}
	.morenav.leftbottom {
		top: auto;
		right: auto;
		left: 0rpx;
		bottom: 180rpx;
		border-radius: 0 10rpx 10rpx 0;
		background-color: rgba(255, 255, 255, 0.98);
	}
	.morenav .absolute {
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 0rpx 10rpx 10rpx 0;
		right: -46rpx;
		bottom: 90rpx;
		line-height: 36rpx;
	}
</style>
