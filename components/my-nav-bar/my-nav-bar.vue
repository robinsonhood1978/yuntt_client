<template>
	<view v-if="show" class="mynavbar" :style="{'background-color': backgroundColor}">
		
		<uni-status-bar v-if="statusBar" />
		<view class="flex-middle" :style="{'height': mynavbar.height, 'padding-top': mynavbar.top}">
			<view class="wraper flex-middle" :style="{'width': mynavbar.wraper}">
				<slot />
			</view>
		</view>
		
	</view>
</template>

<script>
	/**
	 * 兼容APP/小程序端自定义导航栏
	 * 小程序自动定位胶囊按钮左侧可用区域
	 */
	import util from '@/common/util.js'
	import uniStatusBar from "../uni-status-bar/uni-status-bar.vue";
	import uniIcons from "../uni-icons/uni-icons.vue";

	export default {
		name: "UniNavBar",
		components: {
			uniStatusBar,
			uniIcons
		},
		props: {
			statusBar: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				mynavbar: {
					top: 0,
					height: '88rpx',
					wraper: '100%'
				},
				show: true
			}
		},
		created() {
			// #ifdef MP
			let navbar = uni.getMenuButtonBoundingClientRect()
			let sysinfo = uni.getSystemInfoSync()
			if (!this.statusBar) {
				this.mynavbar.top = sysinfo.statusBarHeight + 'px'
			}
			this.mynavbar.wraper = navbar.left + 'px'
			this.mynavbar.height = navbar.height + (navbar.top - sysinfo.statusBarHeight) * 2 + 'px'
			// #endif
			
			// #ifdef H5
			if(util.isWechat() || util.isAlipay() || util.isQqbrowser()) {
				this.show = false
			}
			// #endif
		}
	}
</script>

<style scoped>
	.mynavbar {
		width: 100%;
	}
	.mynavbar .wraper {
		width: 100%;
		overflow: hidden;		
	}
</style>
