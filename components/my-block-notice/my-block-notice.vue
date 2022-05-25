<template>
	<view>
		<view class="notice" :style="{'--bgcolor': options.bgcolor||'#ffffff', '--space': options.space + 'px'}">
			<view :class="['uni-flex uni-row bgf pd10 ml10 mr10 wraper flex-middle', 'style'+options.style]">
				<image v-if="options.style == 2" src="/static/images/notice_style2.png" mode="heightFix"></image>
				<image v-else src="/static/images/notice_style1.png" mode="heightFix"></image>
				<view class="content ml10 pl10 width-surplus">
					<swiper class="swiper" :vertical="true" :autoplay="true" :duration="500" :current="0">
						<swiper-item v-for="(item, index) in gallery" :key="index" class="uni-flex uni-row width-between">
							<navigator :url="'/pages/article/view?id='+item.article_id" hover-class="none" class="line-clamp-1 f-c55 width-surplus">
								{{item.title}}</navigator>
							<uni-icons type="arrowright" color="#555555" size="28"></uni-icons>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import server from '@/common/server.js'
	export default {
		name: 'MyBlock',
		props: {
			options: {
				type: Object / String,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				gallery: {}
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				let that = this
				let params = {
					page_size: that.options.quantity
				}
				if (that.options.source == 'category') {
					params.cate_id = that.options.cate_id
				} else if (that.options.source == 'choice') {
					params.items = that.options.items
					if (params.items) {
						params.page_size = (params.items).split(',').length
					}
				}
				server.request('article/list', params, function(res) {
					if (res.code == 0) {
						that.gallery = res.data.list
					}
				})
			}
		}
	}
</script>
<style>
	.notice {
		width: 100%;
		margin-top: var(--space);
		margin-bottom: var(--space);
	}

	.notice .wraper {
		background-color: var(--bgcolor);
		padding: 30rpx 20rpx;
		border-radius: 10px;
	}

	.notice image {
		height: 32rpx;
		display: block;
	}

	.notice .content {
		border-left: 1px #f1f1f1 solid;
	}

	.notice .style2 image {
		height: 38rpx;
	}

	.notice .swiper {
		height: 38rpx;
		line-height: 38rpx;
	}
</style>
