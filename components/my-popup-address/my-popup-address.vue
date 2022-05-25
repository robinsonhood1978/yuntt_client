<template>
	<view>
		<view class="bgf top-round-edge pt5">
			<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons>
			<view class="uni-bold uni-center f-16 pt10 pb10">{{title}}</view>
			<scroll-view scroll-x="false" scroll-y="true" style="height: 800rpx;">
				<view v-on:click="confirm($event, item)" :class="['pd10 ml10 mr10', index > 0 ? 'bt' : '']" v-for="(item, index) in addresses"
				 :key="index">
					<view class="uni-flex uni-row flex-middle">
						<text class="uni-bold f-15 mr10">{{item.consignee}}</text>
						<text>{{item.phone_mob}}</text>
					</view>
					<view class="f-gray">{{item.province}}{{item.city}}{{item.district||''}}{{item.address}}</view>
				</view>
			</scroll-view>
			<view class="uni-center pd10">
				<navigator hover-class="none" class="mybutton uni-center f-white uni-bold f-15" :url="'/pages/address/build?redirect='+redirect">添加其他地址</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '配送至'
			},
			beforeClose: {
				type: Boolean,
				default: false
			},
			redirect: {
				type: String,
				default: ''
			},
			addresses: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				address: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
		},
		methods: {
			confirm(e, address) {
				this.address = address
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.address)
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
