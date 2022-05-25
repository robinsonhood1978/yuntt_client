<template>
	<view>
		<web-view :src="href"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: ''
			}
		},
		onLoad: function(options) {
			this.href = options.href
		}
	}
</script>
