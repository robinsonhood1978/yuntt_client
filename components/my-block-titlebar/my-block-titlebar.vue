<template>
	<view>
		<view class="titlebar"
			:style="{'--bgcolor': options.bgcolor, '--txtcolor': options.txtcolor||'#FF8000', '--txthide': options.txthide == 1 ? 0 : 1, '--fontsize': options.fontsize + 'px', '--txtbold': options.txtbold == 1 ? 'bold' : 'normal', '--linecolor': options.linecolor, '--space': options.space + 'px', 'background': options.image ? 'url('+options.image+') center center no-repeat' : '', 'background-size': '100%'}">
			<view :class="['uni-center content', options.theme]">
				<view class="relative inline-block">
					<text class="lp"></text>
					<text class="text inline-block f-14">{{options.label}}</text>
					<text class="rp"></text>
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
	.titlebar {
		background-color: var(--bgcolor);
		padding-top: var(--space);
		padding-bottom: var(--space);
	}

	.titlebar .content {
		padding: 20rpx 20rpx;
		opacity: var(--txthide);
	}

	.titlebar .content .text {
		padding: 0 20rpx;
		color: var(--txtcolor);
		font-size: var(--fontsize);
		font-weight: var(--txtbold);
	}

	.titlebar .content .lp,
	.titlebar .content .rp {
		position: absolute;
		display: inline-block;
		height: 2rpx;
		width: 56rpx;
		overflow: hidden;
		background-color: var(--linecolor);
		top: 50%;
	}

	.titlebar .content .lp {
		left: 0;
		margin-left: -56rpx;
	}

	.titlebar .content .rp {
		right: 0;
		margin-right: -56rpx;
	}

	.titlebar .content.square .text {
		padding: 8rpx 20rpx;
		border: 2rpx #FF8000 solid;
		border-color: var(--linecolor);
	}

	.titlebar .content.square .lp,
	.titlebar .content.square .rp {
		top: 46%;
		height: 6rpx;
	}

	.titlebar .content.leftline .lp,
	.titlebar .content.leftline .rp {
		display: none;
	}

	.titlebar .content.leftline {
		text-align: left;
	}

	.titlebar .content.leftline .text {
		border-left: 8rpx #FF8000 solid;
		border-left-color: var(--linecolor);
	}
</style>
