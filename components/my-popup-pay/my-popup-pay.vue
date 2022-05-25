<template>
	<view>
		<view class="uni-popup-dialog">
			<view class="uni-dialog-title">
				<text class="uni-dialog-title-text">{{title}}</text>
			</view>
			<view class="uni-dialog-content">
				<input class="uni-dialog-input" v-model="password" type="text" password="true" placeholder="支付密码">
				<uni-icons v-on:click="clearInput($event, 'password')" v-show="password" type="closeempty"
					class="ml10" color="gray" size="24"></uni-icons>
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
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '请输入'
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
			}
		},
		data() {
			return {
				password: ''
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false
		},
		methods: {
			/**
			 * 点击确认按钮
			 */
			confirm() {
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.password)
			},
			/**
			 * 点击取消按钮
			 */
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			},
			clearInput: function(e, field) {
				this.password = ''
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
		padding: 15rpx 30rpx 30rpx 30rpx;
	}

	.uni-dialog-content-text {
		font-size: 30rpx;
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
		font-size: 30rpx;
	}

	.uni-button-color {
		color: #007aff;
	}

	.uni-dialog-input{
		flex: 1;
		font-size: 30rpx;
	}
</style>
