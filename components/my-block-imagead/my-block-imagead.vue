<template>
	<view>
		<view class="imagead" :style="{'--bgcolor': options.bgcolor, '--space': options.space + 'px'}">
			<view :class="['uni-flex uni-row wraper', 'col'+options.column, options.radius]">
				<view v-for="(item,index) in gallery" :key="index" class="item">
					<navigator :url="item.link" hover-class="none">
						<image :src="item.url" mode="widthFix"></image>
					</navigator>
				</view>
			</view>
		</view>
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
				gallery: []
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				for (let index in this.options.ad_image_url) {
					if (this.options.ad_image_url[index]) {
						this.gallery.push({
							url: this.options.ad_image_url[index],
							link: util.formatUrl(this.options.ad_link_url[index])
						})
					}
				}
			}
		}
	}
</script>
<style>
	.imagead {
		padding-top: var(--space);
		padding-bottom: var(--space);
		background-color: var(--bgcolor);
	}

	.imagead .item,
	.imagead .item image {
		width: 100%;
		display: block;
	}

	.imagead .round {
		padding: 0 10rpx;
	}

	.imagead .round image {
		border-radius: 20rpx;
	}

	.imagead .round .item {
		padding: 0 10rpx;
	}

	.imagead .col2 .item {
		width: 50%;
	}

	.imagead .col2 .item:last-child {
		display: none;
	}

	.imagead .col3 .item {
		width: 33.333%;
	}
</style>
