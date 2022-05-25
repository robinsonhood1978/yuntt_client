<template>
	<view class="pd10 ml10 mr10 mt10 mb10">
		<view>
			<mp-html :content="article.description" class="detail-info" />
		</view>
	</view>
</template>

<script>
	import model from './view.js'
	export default {
		data() {
			return {
				id: 0,
				article: {}
			}
		},
		onLoad: function(options) {
			this.id = options.id
			model.article(this)
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	/* 消除描述中图片上下间距 */
	/deep/ .detail-info img {
		display: block;
	}
</style>
