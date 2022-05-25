<template>
	<view>
		<view class="pb10">
			<view class="pb10 f-white profits">
				<view class="uni-flex uni-column">
					<view class="uni-flex uni-row width-between pd10 flex-middle">
						<view class="f-16">我的团队</view>
						<view class="uni-flex uni-row">
							<navigator url="/pages/deposit/record/record?bizIdentity=FX&flow=income&title=收益明细"
								hover-class="none" class="f-16">我的收益</navigator>
							<uni-icons type="arrowright" color="#ffffff"></uni-icons>
						</view>
					</view>
					<view class="uni-flex uni-row width-between pl10 pt10 pr10 pb10 flex-middle mt10">
						<view>
							<text class="uni-center f-25">{{teams.quantity||0}}</text>
							<text class="ml5">人</text>
						</view>
						<navigator url="/pages/deposit/drawal/drawal" hover-class="none" class="mybutton f-white f-15">提现
						</navigator>
					</view>
				</view>
			</view>
			<view v-if="gallery.list.length > 0">
				<view v-for="(item,index) in gallery.list" :key="index"
					class="uni-flex uni-row ml10 mr10 mt10 pd10 bgf round-edge width-between teams">
					<view class="image mr10">
						<image :src="item.portrait" mode="scaleToFill"></image>
					</view>
					<view v-on:click="galleryby(item)" class="uni-flex uni-row width-surplus width-between flex-middle">
						<view class="width-surplus mr10 relative">
							<view class="uni-bold f-18 absolute" style="top: -20rpx;">{{item.username}}</view>
							<view class="f-gray l-h20 mt10 pt10">已成功发展一级分销团队</view>
						</view>
						<view class="uni-flex uni-row">
							<text class="f-20 uni-bold">{{item.childcount||0}}</text>
							<uni-icons type="arrowright" size="42"></uni-icons>
						</view>
					</view>
				</view>
				<uni-load-more class="mb10 mt10" v-if="loadMore.show" @clickLoadMore="clickLoadMore"
					:status="loadMore.status" :showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
			</view>
			<view v-else class="uni-center">
				<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>
				<view class="uni-text-gray">暂无下级分销成员</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './list.js'
	export default {
		data() {
			return {
				teams: {
					quantity: 0,
					layer: 1
				},
				gallery: {
					parent: 0,
					list: [],
					page: 1
				},
				loadMore: {
					show: false
				}
			}
		},
		methods: {
			galleryby(item) {
				// 只允许查看往下三级
				if (item.childcount > 0 && this.teams.layer <= 2) {
					this.loadMore.show = false
					this.gallery.parent = item.userid
					model.gallery(this, 1)
				}
				this.teams.layer++
			},
			clickLoadMore() {
				model.gallery(this, this.gallery.page + 1)
			}
		},
		created() {
			model.showLoadMore(this)
		},
		onLoad(options) {
			if (options.id) {
				this.gallery.parent = options.id
			}
		},
		onShow() {
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.merchant(this)

				this.gallery.list = [] // 清空原先加载的数据
				model.gallery(this, 1)
			}
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		}
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
<style>
	page {
		/* 解决下拉后，顶部出现的白边 */
		/* #ifdef MP */
		background-color: transparent;
		/* #endif */
	}
</style>
