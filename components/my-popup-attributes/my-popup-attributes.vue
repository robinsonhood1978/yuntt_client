<template>
	<view class="pd10 bgf top-round-edge">
		<!-- <uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons> -->
		<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
		<scroll-view :scroll-x="false" :scroll-y="true" style="height: 800rpx;">
			<view :class="['uni-flex uni-row pd10', index > 0 ? 'bt' : '']"
				v-for="(item, index) in attributes" :key="index">
				<text class="f-gray mr10 l-h20" style="min-width: 120rpx;">{{item.name}}</text>
				<text class="ml10 line-clamp-2 l-h20">{{item.value}}</text>
			</view>
		</scroll-view>
		<view class="mybutton uni-center f-white f-15 uni-bold" v-on:click="close">完成</view>
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '产品参数'
			},
			item: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				attributes: []
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.attributes = this.item
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
