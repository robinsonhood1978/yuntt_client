<template>
	<view>
		<view class="bgf pt5">
			<uni-icons type="closeempty" size="44" class="ml10 absolute pt5" color="gray" v-on:click="close"></uni-icons>
			<view class="uni-center f-16 pt10">{{title}}</view>
			<view class="f-gray f-13 uni-center pb10">充值限额以各平台为准</view>
			<scroll-view scroll-x="false" scroll-y="true" style="height: 600rpx;">
				<view v-on:click="confirm($event, item)" v-for="(item, index) in payments" :key="index" class="uni-flex uni-row ml10 mr10 pt10 pb10 bt flex-middle width-between">
					<view class="uni-flex uni-row flex-middle f-16">
						<text :class="['iconfont', item.code]" style="font-size: 60rpx;"></text>
						<text class="ml10">{{item.name}}</text>
					</view>
					<uni-icons v-show="selected.code == item.code" type="checkmarkempty" size="40" class="mr10" color="#fc2b34"></uni-icons>
				</view>
				<view class="bt pb10"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '充值方式'
			},
			beforeClose: {
				type: Boolean,
				default: false
			},
			payments: {
				type: Array,
				default: function() {
					return []
				}
			},
			selected: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				payment: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
		},
		methods: {
			confirm(e, payment) {
				this.payment = payment
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.payment)
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
