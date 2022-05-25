<template>
	<view>
		<my-swiper-indicator :class="['swiper relative', options.radius]" :info="swiper.list" :current="swiper.current"
			field="content" :mode="swiper.mode" :dotsStyles="swiper.dotsStyles"
			:style="{'--bgcolor':options.bgcolor, '--space': options.space + 'px'}">
			<swiper class="swiper-box" @change="change" :autoplay="true" :circular="true">
				<swiper-item class="item" v-for="(item ,index) in swiper.list" :key="index">
					<view v-on:click="util.redirectUrl(item.url, 'navigate')" class="edge">
						<image class="round-edge" :src="item.path" mode="widthFix" />
					</view>
				</swiper-item>
			</swiper>
			<view class="absolute bg"></view>
		</my-swiper-indicator>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		name: 'MyBlock',
		props: {
			options: {
				type: Object/String,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				util: util,
				swiper: {
					current: 0,
					list: [],
					dotsStyles: {},
					mode: "default"
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			change(e) {
				this.swiper.current = e.detail.current
			},
			init() {
				for (let index in this.options.images) {
					this.swiper.list.push({
						path: this.options.images[index].ad_image_url,
						url: util.formatUrl(this.options.images[index].ad_link_url)
					})
				}
			}
		}
	}
</script>
<style>
	.swiper {
		padding-top: var(--space);
	}

	.swiper .bg {
		top:0;
		left: 0;
		width: 100%;
		background-color: var(--bgcolor);
		border-radius: 0 0 50% 50%;
		height: 240rpx;
	}

	.swiper .swiper-box {
		width: 100%;
		height: 300rpx;
		z-index: 1;
	}

	.swiper .item image {
		width: 100%;
	}

	.swiper .item .edge {
		padding: 0 20rpx;
	}

	.swiper.square .item image {
		border-radius: 0;
	}

	.swiper.square .item .edge {
		padding: 0;
	}
</style>
