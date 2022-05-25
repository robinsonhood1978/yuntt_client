<template>
	<view>
		<view class="bgf top-round-edge pt5 goods-attrs">
			<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="close"></uni-icons>
			<view v-if="title" class="uni-bold uni-center f-16 pt5 pb10">{{title}}</view>
			<view class="pd10">
				<view v-for="(item,index) in category" :key="index">
					<view class="uni-flex uni-row bt item f-16 width-between">
						<text>属性{{index+1}}</text>
						<input class="width-surplus ml10" v-model="item.name" maxlength="20" placeholder="输入属性名" />
					</view>
				</view>
			</view>
		</view>
		<view class="pd10 bgf">
			<view class="uni-center f-white uni-bold f-15 mybutton" @click="confirm">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "uniPopupDialog",
		props: {
			title: {
				type: String,
				default: '修改属性'
			},
			data: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				category: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			this.category = this.data
		},
		methods: {
			confirm() {
				console.log(this.category)
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.category)
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
	input {
		text-align: right;
	}

	.top-round-edge {
		min-height: 600rpx;
	}
	.goods-attrs .item {
		padding: 40rpx 0;
	}
</style>
