<template>
	<view>
		<view class="mainnav"
			:style="{'--bgcolor': options.bgcolor||'#ffffff', '--txtcolor': options.txtcolor, '--space': options.space + 'px'}">
			<view
				:class="['uni-flex uni-row flex-wrap pt5 pb5 ml10 mr10 round-edge wraper', options.radius, 'col'+options.column]">
				<view v-for="(item,index) in options.images" :key="index" class="mb10 mt10 item">
					<view v-on:click="util.redirectUrl(item.link, 'navigate')" class="uni-flex uni-column uni-center">
						<image :src="item.url" mode="scaleToFill"></image>
						<text v-if="item.txthide != 0" class="f-12">{{item.title}}</text>
					</view>
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
				type: Object / String,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				util: util
			}
		}
	}
</script>
<style>
	.mainnav {
		margin-top: var(--space);
		margin-bottom: var(--space);
	}

	.mainnav .wraper {
		background-color: var(--bgcolor);
	}

	.mainnav .square {
		border-radius: 0;
		margin: 0;
	}

	.mainnav .item {
		width: 25%;
	}

	.mainnav .col3 .item {
		width: 33.333%;
	}

	.mainnav .col5 .item {
		width: 20%;
	}

	.mainnav .item image {
		width: 92rpx;
		height: 92rpx;
		margin: 0 auto;
	}

	.mainnav .item text {
		display: inline-block;
		margin-top: 10rpx;
		color: var(--txtcolor)
	}
</style>
