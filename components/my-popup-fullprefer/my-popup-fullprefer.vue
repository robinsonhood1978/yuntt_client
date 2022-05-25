<template>
	<view class="pd10 bgf top-round-edge">
		<!-- <uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons> -->
		<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
		<scroll-view :scroll-x="false" :scroll-y="true" style="height: 800rpx;">
			<uni-icons type="checkbox" color="#fc2b34" class="mr10"></uni-icons>店铺活动
			<view class="f-gray f-13 ml10">
				单笔订单购满{{fullprefer.amount}}元（不支持跨店），可立减{{fullprefer.decrease}}元
			</view>
		</scroll-view>
		<view class="mybutton uni-center f-white f-15 uni-bold" v-on:click="close">关闭</view>
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '满减优惠'
			},
			item: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				fullprefer: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.fullprefer = this.item
		},
		methods: {
			confirm() {
				this.$emit('confirm', () => {
					this.popup.close()
				})
			},
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			}
		}
	}
</script>
<style scoped>
</style>
