<template>
	<view>
		<view class="horzline"
			:style="{'--color': options.color||'#0d6fb8', '--line': options.line||'solid', '--padding': options.padding + 'px', '--space': options.space + 'px'}">
			<view class="content"></view>
		</view>
	</view>
</template>

<script>
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
			return {}
		}
	}
</script>
<style>
	.horzline {
		padding-top: var(--space);
		padding-bottom: var(--space);
		padding-left: var(--padding);
		padding-right: var(--padding);
	}

	.horzline .content {
		border-top-width: 2rpx;
		border-top-style: var(--line);
		border-top-color: var(--color);
	}
</style>
