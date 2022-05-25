<template>
	<view class="pd10 bgf top-round-edge">
		<!-- <uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons> -->
		<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
		<scroll-view :scroll-x="false" :scroll-y="true" style="height: 800rpx;">
			<view>
				<uni-icons type="checkbox" color="#fc2b34" class="mr10"></uni-icons>购物使用积分
			</view>
			<view class="f-gray f-13 mb10 ml10">
				预计可使用{{goods.integral.exchange_integral}}积分，抵扣货款{{goods.integral.exchange_money|currency}}元
			</view>
			<view>
				<uni-icons type="checkbox" color="#fc2b34" class="mr10"></uni-icons>购物获得积分
			</view>
			<view class="f-gray f-13 mb10 ml10">
				购买该商品预计可获得{{goods.integral.give_integral}}个积分，获得的积分可用于下次购买其他积分商品</view>
			<view>
				<uni-icons type="checkbox" color="#fc2b34" class="mr10"></uni-icons>积分抵扣比率
			</view>
			<view class="f-gray f-13 mb10 ml10">{{goods.integral.exchange_rate}}</view>
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
				default: '积分说明'
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
				goods: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.goods = this.item
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
