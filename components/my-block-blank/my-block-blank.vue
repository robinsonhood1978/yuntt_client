<template>
	<view>
		<view class="blankbox" :style="{'--bgcolor': options.bgcolor, '--height': options.height + 'px'}"></view>
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
	.blankbox {
		background-color: var(--bgcolor);
		width: 100%;
		height: var(--height);
	}
</style>
