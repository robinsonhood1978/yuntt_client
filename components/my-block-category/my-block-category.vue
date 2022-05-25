<template>
	<view>
		<view class="pl5 pr5 scroller"
			:style="{'--bgcolor': options.bgcolor||'#fc2b34', '--txtcolor': options.txtcolor||'#ffffff', '--selcolor': options.selcolor||'#ffffff', '--txtbold': options.txtbold > 0 ? 'bold' : 'normal', '--space': options.space + 'px'}">
			<view class="uni-flex uni-row wraper">
				<scroll-view class="list flex-middle" :show-scrollbar="false" :scroll-x="true" :scroll-y="false">
					<navigator v-if="options.homehide == 0" hover-class="none" class="item pl10 pr10 selected" url="/pages/index/index"
						open-type="switchTab"><text class="f-white f-16">首页</text></navigator>
					<navigator :url="'/pages/search/goods?cate_id='+item.cate_id" hover-class="selected"
						v-for="(item, index) in gallery" :key="index"
						:class="['item pl10 pr10', (options.homehide == 1 && index == 0) ? 'selected' : '']">
						<text class="f-white f-16">{{item.cate_name}}</text>
					</navigator>
				</scroll-view>
				<view v-if="options.morehide == 0" class="uni-flex uni-row pl10 pr10 filter">
					<uni-icons type="list" :color="options.txtcolor||'#ffffff'" size="44"></uni-icons>
					<navigator url="/pages/category/list" open-type="switchTab" hover-class="none"
						class="f-15 mr5 ml5 f-white" :style="{'color': options.txtcolor||'#ffffff'}">分类
					</navigator>
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
				type: Object/String,
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
				let gallery = uni.getStorageSync('category-index') || {}
				if (gallery.length > 0) {
					that.gallery = gallery
				} else {
					server.request('category/list', {
						parent_id: 0,
						store_id: 0,
						if_show: 1
					}, function(res) {
						if (res.code == 0) {
							if (res.data.list.length > 0) {
								that.gallery = res.data.list
								uni.setStorage({
									key: 'category-index',
									data: res.data.list
								})
							}
						}
					})
				}
			}
		}
	}
</script>
<style>
	.scroller {
		white-space: nowrap;
		padding-top: 6rpx;
		padding-right: 30rpx;
		/* margin-bottom: -27rpx; */
		height: 88rpx;
		position: relative;
		overflow-y: hidden;
		overflow-x: scroll;
		background-color: var(--bgcolor);
		margin-top: var(--space);
		margin-bottom: var(--space);
	}

	.scroller::-webkit-scrollbar {
		display: none;
	}

	.scroller .filter {
		line-height: 40rpx;
		height: 40rpx;
		margin-top: 30rpx;
		box-shadow: -6px 0 4px -4px rgba(0, 0, 0, .4);
		position: absolute;
		top: calc(50% - 50rpx);
		right: 0rpx;
		background-color: var(--bgcolor);
	}

	.scroller .item {
		padding-top: 14rpx;
		display: inline-block;
		flex-wrap: nowrap;

	}

	.scroller .item text {
		color: var(--txtcolor);
	}

	.scroller .item.selected text {
		display: inline-block;
		border-bottom: 4rpx #FFFFFF solid;
		font-size: 34rpx;
		font-weight: var(--txtbold);
		padding-bottom: 14rpx;
		color: var(--selcolor);
		border-bottom-color: var(--selcolor);
	}
</style>
