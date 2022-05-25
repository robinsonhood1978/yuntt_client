<template>
	<view>
		<view class="gallery"
			:style="{'--bgcolor': options.bgcolor, '--txtcolor': options.txtcolor||'#fc2b34', '--space': options.space + 'px'}">
			<view :class="['wraper pl5 pr5 pt10 pb10 bgf round-edge ml10 mr10']">
				<view :class="['title pb10', options.direction == 'horizontal' ? 'uni-flex uni-row' : 'uni-center']">

					<view v-if="options.direction == 'horizontal'" class="mt10">
						<image mode="heightFix" src="/static/images/limitbuylabel.png"></image>
					</view>
					<view v-else class="text">——<text class="uni-bold f-16 f-red ml10 mr10">秒杀专区</text>——</view>

					<view v-if="countdown.timestamp"
						:class="['uni-flex uni-row f-gray mt5 mb5 flex-middle countdown', options.direction == 'horizontal' ? 'flex-end' : 'flex-center']">
						<text class="f-12 f-gray">距离结束：</text>
						<my-countdown :showDay="false" backgroundColor="#000" splitorColor="#999" color="#ffffff"
							:timestamp="countdown.timestamp">
						</my-countdown>
					</view>
				</view>

				<view v-for="(item, index) in gallery" :key="index" class="round-edge bgf mt10 pb10 item">
					<navigator hover-class="none" :url="'/pages/goods/index?id='+item.goods_id"
						:class="['uni-flex uni-row']">
						<image :src="item.goods_image" mode="widthFix"></image>
						<view class="extra width-surplus">
							<view class="line-clamp-2 ml10 l-h20">{{item.goods_name}}</view>
							<view class="uni-flex uni-row ml10 mt10 progress">
								<view class="width-surplus relative mt5"><text class="absolute"
										:style="{'width': item.progress||'0'}"></text></view>
								<text class="f-12 ml10 f-gray">已抢{{item.progress||'0%'}}</text>
							</view>
							<view class="uni-flex uni-row mt10 pt10 flex-middle width-between">
								<view class="flex-middle">
									<text class="f-red f-16 uni-bold ml10">{{item.promotion.price|currency}}</text>
									<text class="del ml5 f-gray f-12">{{item.price|currency}}</text>
								</view>
								<view class="f-12 f-white mybutton">立即抢购</view>
							</view>
						</view>
					</navigator>
				</view>
				<view class="uni-center f-gray mt10">
					<navigator url="/pages/limitbuy/list" hover-class="none"><text class="f-13">更多秒杀</text>
						<uni-icons type="arrowright" color="#999999" size="26"></uni-icons>
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
				type: Object / String,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				gallery: {},
				countdown: {
					timestamp: 0
				}
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				let that = this
				let params = {
					page_size: that.options.quantity
				}
				if (that.options.source == 'choice') {
					params.items = that.options.items
					if (params.items) {
						params.page_size = (params.items).split(',').length
					}
				}
				server.request('limitbuy/list', params, function(res) {
					if (res.code == 0) {
						that.gallery = res.data.list || []
						if (that.gallery.length > 0) {
							that.countdown = res.data.list[0].promotion
						}
					}
				})
			}
		}
	}
</script>
<style>
	.gallery {
		background-color: var(--bgcolor);
		padding-top: var(--space);
		padding-bottom: var(--space);
	}

	.gallery .title text,
	.gallery .title .text {
		color: var(--txtcolor);
	}

	.gallery .title image {

		height: 40rpx;
	}

	.gallery .item {
		margin-left: 10rpx;
		margin-right: 10rpx;
		width: calc(50% - 20rpx);
	}

	.gallery .item image {
		width: 100%;
		height: 350rpx;
		display: block;
		border-radius: 20rpx 20rpx 0 0;
	}

	.gallery .item .mybutton {
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		border-radius: 8rpx;
	}

	.gallery .item .progress .relative,
	.gallery .item .progress .relative .absolute {
		height: 20rpx;
		border-radius: 20rpx;
		background-color: #FCECD7;
	}

	.gallery .item .progress .relative .absolute {
		background-color: #FDBE6C;
	}

	.gallery .wraper {
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.gallery .item {
		margin-left: 0;
		width: calc(100%);
		border-radius: 0rpx;
	}

	.gallery .item image {
		width: 250rpx;
		border-radius: 8rpx;
	}

	/deep/ .countdown .uni-countdown__number {
		border-radius: 6rpx;
	}
</style>
