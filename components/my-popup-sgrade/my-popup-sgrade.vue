<template>
	<view>
		<view class="bgf pt5">
			<uni-icons type="closeempty" size="44" class="ml10 absolute pt5" color="gray" v-on:click="close">
			</uni-icons>
			<view :class="['uni-center f-16 pt10 pb10']">{{title}}</view>
			<scroll-view scroll-x="false" scroll-y="true" style="height: 700rpx;">
				<view v-on:click="confirm($event, item)" v-for="(item, index) in grades" :key="index"
					class="uni-flex uni-row ml10 mr10 pt10 pb10 bt flex-middle width-between">
					<view class="uni-flex uni-column mr10">
						<text class="f-15 uni-bold">{{item.grade_name}}</text>
						<view class="f-gray f-14">
							<text v-if="item.charge && item.charge != 0">服务费{{item.charge}}</text>
							<text v-else>免费开通</text>
							<text v-if="item.need_confirm == 1">，审核后开通</text>
							<text v-else>，无需审核</text>
							<text>，可发布商品数</text>
							<text v-if="item.goods_limit">{{item.goods_limit}}件</text>
							<text v-else>无限制</text>
							<text>，可用图片存储空间</text>
							<text v-if="item.space_limit">{{item.space_limit}}M</text>
							<text v-else>无限制</text>
						</view>
					</view>
					<view class="uni-center" style="width: 90rpx;">
						<uni-icons v-show="selected == item.grade_id" type="checkmarkempty" size="40" color="#fc2b34">
						</uni-icons>
					</view>
				</view>
			</scroll-view>
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
				default: '店铺类型'
			},
			beforeClose: {
				type: Boolean,
				default: false
			},
			grades: {
				type: Array,
				default: function() {
					return []
				}
			},
			selected: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				result: {}
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩可点击
			this.popup.mkclick = true
			if (this.grades.length == 0) {
				this.getGrades(this)
			}
		},
		methods: {
			confirm(e, grade) {
				this.result = grade
				this.$emit('confirm', () => {
					this.popup.close()
				}, this.result)
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
			getGrades(that) {
				server.request('store/grades', {
					page_size: 6
				}, function(res) {
					if (res.code == 0) {
						that.grades = res.data ? res.data.list : []
					}
				})
			}
		}
	}
</script>
<style scoped>
</style>
