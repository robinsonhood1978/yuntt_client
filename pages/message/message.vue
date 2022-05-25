<template>
	<view>
		<view class="uni-center">
			<uni-icons v-if="status == 'warn'" type="info-filled" size="200" color="#0080FF"></uni-icons>
			<uni-icons v-else-if="status == 'fail'" type="clear" size="200" color="#999999"></uni-icons>
			<uni-icons v-else type="checkbox-filled" size="200" color="#04BE02"></uni-icons>
		</view>
		<view class="pl10 pr10 ml10 mr10">
			<view class="uni-center f-18 pb10">操作提示</view>
			<view class="pl10 pr10 ml10 mr10 uni-center f-16 f-gray l-h20 pb10">{{content}}</view>
			<view v-for="(item, index) in btns" :key="index">
				<navigator :class="['mybutton f-white f-15 mt10 mb10', index > 0 ? 'gray' : status]"
					:open-type="item.opentype ? item.opentype : 'redirect'" :url="item.url">{{item.title}}</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'success',
				content: '',
				btns: {}
			}
		},
		onLoad: function(options) {
			this.status = options.status
			this.content = options.content
			uni.setNavigationBarTitle({
				title: options.title
			})
			if (options.btns) {
				this.btns = JSON.parse(options.btns)
			}
		}
	}
</script>
<style scoped>
	.mybutton {
		border-radius: 20rpx;
		background: #04BE02;
	}
	.mybutton.warn {
		background: #0080FF;
	}
	.mybutton.gray {
		background: #CCCCCC;
	}
</style>
