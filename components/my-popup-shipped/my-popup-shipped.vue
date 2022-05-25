<template>
	<view class="uni-popup-dialog">
		<view class="uni-dialog-title">
			<text class="uni-dialog-title-text">{{title}}</text>
		</view>
		<view class="pd10 ml10">
			<view v-if="companys.length > 0" class="uni-flex uni-row pb10">
				<text>物流公司</text>
				<picker @change="picker" class="ml10 width-surplus" mode="selector" range-key="name" :range="companys" :value="selected">
					<view>{{companys[selected].name}}</view>
				</picker>
				<uni-icons type="arrowright" class="mr10"></uni-icons>
			</view>
			<view class="uni-flex uni-row bt pt10">
				<text>物流单号</text>
				<input v-model="express_no" class="ml10 width-surplus mr10 pr10" maxlength="20" placeholder="填写物流单号" />
				<text class="uni-icon mr10" v-if="express_no" @click="clearIcon">&#xe434;</text>
			</view>
		</view>
		<view class="uni-dialog-button-group">
			<view class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text">{{closeText}}</text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="confirm">
				<text class="uni-dialog-button-text uni-button-color">{{confimText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import server from '@/common/server.js'
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '发货'
			},
			confimText: {
				type: String,
				default: '确定'
			},
			closeText: {
				type: String,
				default: '取消'
			},
			beforeClose: {
				type: Boolean,
				default: false
			},
			order: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				selected: 0,
				companys: [],
				express_no: this.order.express_no
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false
			this.getCompanys()
		},
		methods: {
			confirm() {
				this.$emit('confirm', () => {
					this.popup.close()
				}, {
					'express_comkey': this.companys.length > 0 ? this.companys[this.selected].code : '',
					'express_no': this.express_no
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
			},
			clearIcon: function() {
				this.express_no = ''
			},
			picker: function(e) {
				this.selected = e.target.value
			},
			getCompanys: function() {
				let that = this
				server.request('delivery/company', {
					page_size: 50
				}, function(res) {
					if (res.code == 0) {
						that.companys = res.data.list
						for (let index in that.companys) {
							if (that.companys[index].code == that.order.express_comkey) {
								that.selected = index
							}
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.uni-popup-dialog {
		width: 600rpx;
		border-radius: 30rpx;
		background-color: #fff;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 30rpx;
		padding-bottom: 10rpx;
	}

	.uni-dialog-title-text {
		font-size: 32rpx;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10rpx 30rpx 30rpx 30rpx;
	}

	.uni-dialog-content-text {
		font-size: 28rpx;
		color: #6e6e6e;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 2rpx;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 90rpx;
	}

	.uni-border-left {
		border-left-color: #f0f0f0;
		border-left-style: solid;
		border-left-width: 2rpx;
	}

	.uni-dialog-button-text {
		font-size: 28rpx;
	}

	.uni-button-color {
		color: #007aff;
	}
</style>
