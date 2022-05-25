<template>
	<view>
		<view class="bgf pt5">
			<uni-icons type="closeempty" size="44" class="ml10 absolute pt5" color="gray" v-on:click="close"></uni-icons>
			<view :class="['uni-center f-16 pt10', desc ? '' : 'pb10']">{{title}}</view>
			<view v-if="desc" class="f-gray f-13 uni-center pb10">{{desc}}</view>
			<scroll-view scroll-x="false" scroll-y="true" style="height: 700rpx;">
				<view v-on:click="confirm($event, item)" v-for="(item, index) in banks" :key="index" class="uni-flex uni-row ml10 mr10 pt10 pb10 bt flex-middle width-between">
					<view class="uni-flex uni-row flex-middle f-16">
						<text :class="['iconfont', item.short_name]" style="font-size: 60rpx;"></text>
						<text class="mr10 ml10">{{item.bank_name}}</text>
						<text v-if="item.num">({{item.num}})</text>
					</view>
					<uni-icons v-show="selected.short_name == item.short_name" type="checkmarkempty" size="40" class="mr10" color="#fc2b34"></uni-icons>
				</view>
				<navigator v-if="showAdd" url='/pages/bank/build' hover-class="none" class="pd10 bt mg5">
					<view class="uni-flex uni-row flex-middle f-16 pd5">使用新卡提现</view>
				</navigator>
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
				default: '到账银行卡'
			},
			desc: {
				type: String,
				default: '到账时间以各银行处理为准'
			},
			beforeClose: {
				type: Boolean,
				default: false
			},
			banks: {
				type: Array,
				default: function() {
					return []
				}
			},
			showAdd: {
				type: Boolean,
				default: true
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
				bank: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
		},
		methods: {
			confirm(e, bank) {
				this.bank = bank
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.bank)
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
