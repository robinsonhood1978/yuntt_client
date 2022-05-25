<template>
	<view>
		<view class="uni-flex uni-row guideshop pt10 pr10 pb5 width-between fixed-top">
			<view class="uni-flex uni-row ml10 mr10 f-white">
				<text>自提点：</text>
				<text v-if="guideshop.name"
					class="width-surplus line-clamp-1">{{guideshop.address}}{{guideshop.name}}</text>
				<text v-else>请选择提货点</text>
				<text class="qh"></text>
				<navigator :url="'/pages/guider/shop/list?shopid='+guideshop.id" hover-class="none">
					<text>切换</text>
					<uni-icons type="arrowright" size="24" color="#ffffff"></uni-icons>
				</navigator>
			</view>
			<view class="uni-flex uni-row ml10 pl10 mr10 share f-white">
				<text class="iconfont iconicon_share"></text>
				<text v-on:click="showPopup($event, 'share')" size="24" color="#ffffff">分享</text>
			</view>
		</view>

		<view class="uni-flex uni-row bgf pl10 pr10 pt5 pb5 width-between flex-middle" style="margin-top: 84rpx;">
			<view class="uni-flex uni-row flex-middle">
				<uni-icons type="checkbox-filled" color="#007AFF"></uni-icons>
				<text class="ml5 uni-bold">便宜有好货</text>
			</view>
			<text class="f-gray">品质保证 · 极速退款 · 次日自提</text>
		</view>

		<!--拖拽式模块-->
		<view v-for="(block, index) in floors" :key="index">
			<view v-if="block.name == 'df_searchbox'">
				<my-block-searchbox :options="block.options"></my-block-searchbox>
			</view>
			<view v-if="block.name == 'df_category'">
				<my-block-category :options="block.options"></my-block-category>
			</view>
			<view v-if="block.name == 'df_swiper'">
				<my-block-swiper :options="block.options"></my-block-swiper>
			</view>
			<view v-if="block.name == 'df_mainnav'">
				<my-block-mainnav :options="block.options"></my-block-mainnav>
			</view>
			<view v-if="block.name == 'df_titlebar'">
				<my-block-titlebar :options="block.options"></my-block-titlebar>
			</view>
			<view v-if="block.name == 'df_imagead'">
				<my-block-imagead :options="block.options"></my-block-imagead>
			</view>
			<view v-if="block.name == 'df_goodslist'">
				<my-block-goodslist :options="block.options" ref="goods"></my-block-goodslist>
			</view>
			<view v-if="block.name == 'df_coupon'">
				<my-block-coupon :options="block.options"></my-block-coupon>
			</view>
			<view v-if="block.name == 'df_limitbuy'">
				<my-block-limitbuy :options="block.options"></my-block-limitbuy>
			</view>
			<view v-if="block.name == 'df_teambuy'">
				<my-block-teambuy :options="block.options"></my-block-teambuy>
			</view>
			<view v-if="block.name == 'df_notice'">
				<my-block-notice :options="block.options"></my-block-notice>
			</view>
			<view v-if="block.name == 'df_textbox'">
				<my-block-textbox :options="block.options"></my-block-textbox>
			</view>
			<view v-if="block.name == 'df_blank'">
				<my-block-blank :options="block.options"></my-block-blank>
			</view>
			<view v-if="block.name == 'df_horzline'">
				<my-block-horzline :options="block.options"></my-block-horzline>
			</view>
		</view>

		<view v-if="limitbuys.length > 0" class="ml10 mr10 pd10 round-edge scroller limitbuy">
			<view class="uni-flex uni-row title mb10 ml5 pt5 pb5 flex-middle width-between">
				<image src="/static/images/limitbuylabel.png" mode="heightFix"></image>
				<view class="uni-flex uni-row">
					<text class="ml10 f-15">距离结束：</text>
					<my-countdown class="countdown" backgroundColor="#ff9437" color="#ffffff" :showDay="false"
						:timestamp="limitbuys[0].promotion.timestamp"></my-countdown>
				</view>
			</view>
			<scroll-view class="uni-flex uni-row round-edge bgf" :show-scrollbar="false" :scroll-x="true"
				:scroll-y="false">
				<view v-for="(item,index) in limitbuys" :key="index" :class="['pl5 pr5 uni-center item']">
					<navigator hover-class="none" :url="'/pages/community/goods/index?id='+item.goods_id"
						class="image mb10">
						<image :src="item.goods_image" mode="scaleToFill"></image>
					</navigator>
					<view class="uni-flex uni-column f-15 mb10 l-h20">
						<!-- <text class="del f-12 f-gray">{{item.price|currency}}</text> -->
						<text class="f-red uni-bold">{{item.promotion.price|currency}}</text>
					</view>
					<view v-on:click="showPopup($event, 'specs', item)" class="mybutton f-12 f-white relative">
						<text>立即抢购</text>
						<text v-if="cart.quantity[item.goods_id] > 0"
							class="badge f-c55 uni-bold absolute uni-center">{{cart.quantity[item.goods_id]}}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="uni-flex uni-row pl10 mr10 pr10 scroller gcategory">
			<scroll-view class="list" :show-scrollbar="false" :scroll-x="true" :scroll-y="false">
				<view v-on:click="search(0)"
					:class="['ml5 mr10 uni-center pt10 pb10 uni-bold f-16 item', gallery.cid ? '' : 'f-red']">
					<text>推荐</text>
				</view>
				<view v-on:click="search(item.cate_id)" v-for="(item, index) in gcategory" :key="index"
					:class="['ml10 mr10 uni-center pt10 pb10 uni-bold f-16 item', gallery.cid == item.cate_id ? 'f-red' : '']">
					<text>{{item.cate_name}}</text>
				</view>
			</scroll-view>
		</view>

		<view v-if="gallery.list.length > 0">
			<view class="gallery pl10 pr10 pt10 round-edge ml10 mr10 bgf">
				<view v-for="(item,index) in gallery.list" :key="index" class="uni-flex uni-row item">
					<navigator :url="'/pages/community/goods/index?id='+item.goods_id" class="image mb5 relative"
						hover-class="none">
						<text v-show="item.promotion && item.promotion.type == 'limitbuy'"
							class="absolute uni-center f-white skill f-12 uni-bold">秒杀</text>
						<image :src="item.default_image" mode="widthFix"></image>
					</navigator>
					<view :class="[index == 0 ? '' : 'bt', 'rb mb5 width-surplus']">
						<view class="line-clamp-2 ml10 mr10 l-h20 uni-bold f-15">{{item.goods_name}}</view>
						<view class="f-13 f-gray mr10 ml10 mt5">附近有{{item.sales||0}}人已买</view>
						<view class="promote ml10"></view>
						<view class="uni-flex uni-row mt5 pb5 flex-middle width-between">
							<view class="width-surplus ml10">
								<view class="del f-gray f-16 l-h20">
									<text v-if="item.promotion">{{item.price|currency}}</text>
									<text v-else-if="item.mkprice > 0">{{item.mkprice|currency}}</text>
								</view>
								<view class="f-red f-16 l-h20">
									<text v-if="item.promotion">{{item.promotion.price|currency}}</text>
									<text v-else>{{item.price|currency}}</text>
								</view>
							</view>
							<view v-if="item.spec_qty == 0" class="uni-flex uni-row flex-middle"
								style="justify-content: flex-end;">
								<uni-icons v-if="cart.quantity[item.goods_id] > 0" v-on:click="changeQty(item, 'minus')"
									type="minus-filled" size="50" color="#cccccc"></uni-icons>
								<text v-if="cart.quantity[item.goods_id] > 0"
									class="quantity uni-center">{{cart.quantity[item.goods_id]}}</text>
								<uni-icons v-on:click="changeQty(item, 'plus')" type="plus-filled" size="50"
									color="#ff660e"></uni-icons>
							</view>
							<view v-else v-on:click="showPopup($event, 'specs', item)" class="mybutton relative"
								style="justify-content: flex-end;">
								<text class="f-white f-12">选规格</text>
								<text v-if="cart.quantity[item.goods_id] > 0"
									class="badge f-c55 uni-bold absolute uni-center">{{cart.quantity[item.goods_id]}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="loadMore.show" @clickLoadMore="clickLoadMore" :status="loadMore.status"
				:showIcon="true" :contentText="loadMore.contentText"></uni-load-more>
		</view>
		<view v-else class="uni-center" style="padding-bottom: 120rpx;">
			<view class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons" style="padding-top: 60rpx;"></view>
			<view class="uni-text-gray">暂无商品</view>
		</view>

		<!-- 选择规格弹窗-->
		<uni-popup ref="specs" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-specs @close="close" @confirm="confirm" :item="popup"></my-popup-specs>
		</uni-popup>

		<!-- 购物车商品弹窗-->
		<uni-popup ref="cart" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-shopcart :data="cart" @confirm="submit" @change="changeQty"></my-popup-shopcart>
		</uni-popup>

		<!-- 分享到弹窗-->
		<uni-popup ref="share" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-share :body="share.body"></my-popup-share>
		</uni-popup>

		<view class="uni-flex">
			<view class="fixed-bottom bgf box-shadow-top">
				<view class="uni-flex uni-row width-between pd10 paybill">
					<view v-on:click="showPopup($event, 'cart')" class="uni-flex uni-row flex-middle relative">
						<uni-icons type="cart" size="50"></uni-icons>
						<text class="badge f-13 absolute uni-center uni-bold">{{cart.total}}</text>
					</view>
					<view v-on:click="submit"
						class="uni-flex uni-row f-white flex-middle flex-center mybutton width-surplus"><text
							class="f-17 line-clamp-1 l-h20">{{cart.paymoney|currency}} 去支付</text>
						<uni-icons type="arrowright" color="#ffffff" size="30"></uni-icons>
					</view>
				</view>
			</view>
			<view class="bottom-placeholder"></view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import shopcart from '@/common/guideshopcart.js'
	import model from './index.js'
	export default {
		data() {
			return {
				util: util,
				floors: [],
				swiper: {
					"current": 0,
					"mode": "default",
					"list": []
				},
				guideshop: {},
				gcategory: [],
				gallery: {
					cid: 0,
					list: [],
					page: 1
				},
				limitbuys: [],
				cart: {
					list: {},
					quantity: {},
					total: 0,
					paymoney: 0
				},
				popup: {},
				loadMore: {
					show: false
				},
				share: {
					body: {}
				}
			}
		},
		methods: {
			slide(e) {
				this.swiper.current = e.detail.current
			},
			search(cid) {
				//this.gallery.cid = cid ? cid : ''
				//model.gallery(this, 1)
				if (cid > 0) {
					uni.navigateTo({
						url: '/pages/community/category/list?id=' + cid
					})
				}
			},
			submit(done, cart) { // 兼容两处“去支付”按钮
				if (cart) {
					this.cart = cart
					done()
				}
				shopcart.submit(this)
			},
			showPopup(e, popup, item) {
				if (popup == 'specs') {
					this.popup = item
				} else if (popup == 'cart') { // 显示购物车商品
					if (this.cart.total <= 0) return false
				} else if (popup == 'share') {
					if (!this.guideshop.id) {
						uni.showToast({
							title: '请先设置提货点',
							icon: 'none'
						})
						return false
					}
					this.share.body = model.shareBody(this)
				}
				return this.$refs[popup].open()
			},
			closePopup(e, popup) {
				return this.$refs[popup].close()
			},
			close(done) {
				done()
			},
			confirm(done, item) {
				shopcart.addCart(this, item)
				done()
			},
			changeQty(item, type) {
				if (item.default_spec) {
					item.spec_id = item.default_spec // 字段兼容处理
				}
				shopcart.changeQty(this, item, type)
			},
			clickLoadMore() {
				model.gallery(this, this.gallery.page + 1)
			}
		},
		created() {
			model.gcategory(this)
			model.swiper(this)
			model.floors(this)
			model.showLoadMore(this)
		},
		onLoad(options) {
			if (options.shopid) {
				uni.setStorageSync('guideshopid', options.shopid)
			}
			if (options.cate_id) {
				this.gallery.cid = Number(options.cate_id)
			}
			this.gallery.list = [] // 清空原先加载的数据
			model.gallery(this, 1)
			model.limitbuys(this)
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		},
		onShow() {
			util.reomveStorage('redirect', true)
			model.guideshop(this, false)
			shopcart.buildQty(this)
		},
		onShareAppMessage(res) {
			return model.shareBody(this)
		},
		onShareTimeline(res) {
			return model.shareBody(this)
		}
	}
</script>

<style scoped>
	@import url("./index.css");
</style>
