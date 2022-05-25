<template>
	<view>
		<!--商品图片轮播-->
		<view class="swiper relative">
			<my-swiper-dot :info="swiper.list" :current="swiper.current">
				<swiper class="swiper-box" @change="slide" :autoplay="false" :circular="true">
					<swiper-item v-for="(item ,index) in swiper.list" :key="index">
						<text v-if="index == 0 && goods.video" v-on:click="vplay(true)" class="iconfont iconbofang2 absolute" ></text>
						<image class="swiper-item" :src="item.url" mode="widthFix" />
					</swiper-item>
				</swiper>
			</my-swiper-dot>
			
			<!-- 视频播放模块-->
			<view v-if="videoplay" class="absolute videoplay">
				<video :src="goods.video" :show-mute-btn="true" :poster="goods.default_image" :autoplay="true" :muted="false" @ended="vplay(false)"></video>
			</view>
			
			<!-- #ifndef MP -->
			<view v-show="!isAppBrowser" class="uni-flex uni-row fixed-top flex-middle navbar" :style="transparent.background">
				<view v-on:click="pageback" class="round uni-center ml10" :style="transparent.btnBackground">
					<uni-icons type="arrowleft" :color="transparent.iconColor" size="40"></uni-icons>
				</view>
				<view class="flex-middle width-surplus flex-center">
					<text class="f-17 f-white" v-show="transparent.titleShow" >商品详情</text>
				</view>
				<view class="uni-flex uni-row">
					<navigator url="/pages/community/cart/index" hover-class="none" class="round uni-center mr10" :style="transparent.btnBackground">
						<uni-icons type="cart" :color="transparent.iconColor" size="40"></uni-icons>
					</navigator>
				</view>
			</view>
			<!-- #endif -->
		</view>

		<!--商品价格-->
		<view class="goods-detail">
			<view class="uni-flex uni-row">
				<view class="price">
					<view v-if="promotion" class="uni-flex uni-row pt5 flex-middle">
						<view class="f-white ml10 f-25">{{promotion.price|currency}}</view>
						<text class="f-white del ml10 f-15">{{promotion.rfprice|currency}}</text>
					</view>
					<view v-else class="uni-flex uni-row pt5 flex-middle">
						<view class="f-white ml10 f-25">{{goods.price|currency}}</view>
						<text v-if="goods.mkprice > 0" class="f-white del ml10 f-15">{{goods.mkprice|currency}}</text>
						<text v-else class="f-white del ml10 f-15">{{goods.price|currency}}</text>
					</view>
				</view>
				<view class="promote">
					<view v-if="promotion">
						<view v-if="promotion.type == 'limitbuy'" style="padding-top: 5rpx;">
							<view class="f-red f-12 pl10 pr10 uni-ellipsis uni-center">{{promotion.name}}剩余</view>
							<view class="flex-center">
								<my-countdown backgroundColor="#ffa200" color="#ffffff" :showDay="false"
									:day="promotion.lefttime.d" :hour="promotion.lefttime.h"
									:minute="promotion.lefttime.m" :second="promotion.lefttime.s"></my-countdown>
							</view>
						</view>
						<view v-else-if="promotion.type == 'exclusive'" style="padding-top: 8rpx;">
							<view class="f-red f-17 pl10 pr10 uni-bold uni-center">{{promotion.name}}</view>
							<text class="flex-center f-red f-12" style="margin-top: -8rpx;">优惠多多享不停</text>
						</view>
					</view>
					<view v-else v-on:click="favorite" style="padding-top: 8rpx;">
						<view class="f-red f-17 pl10 pr10 uni-bold uni-center">关注店铺</view>
						<text class="flex-center f-red f-12" style="margin-top: -8rpx;">获取最新促销</text>
					</view>
				</view>
			</view>
			<view class="bgf pl10 pr10 pb10 round-edge ml10 mr10 mt10">
				<view v-on:click="showPopup($event, 'coupons')" v-if="coupons.length > 0"
					class="uni-flex uni-row pt5 coupons">
					<view class="uni-flex uni-row mt10 mb5"
						style="-webkit-flex: 1;flex: 1;-webkit-flex-wrap: wrap;flex-wrap: wrap;">
						<view v-if="index < 2" v-for="(item, index) in coupons" :key="index">
							<view class="f-13 item mr5">
								优惠券满{{item.min_amount|currency('', 0)}}减{{item.coupon_value|currency('', 0)}}</view>
						</view>
					</view>
					<view class="mt10 f-13 f-white pl10 receive">领券<uni-icons type="arrowright" size="26"
							color="#FFFFFF"></uni-icons>
					</view>
				</view>

				<view class="uni-flex uni-row width-between flex-middle mb5 mt10 pt10">
					<text class="f-white f-12 pl5 pr5 store-type">自营</text>
					<text class="f-gray f-14 mr5">月销 {{goods.sales||0}}</text>
				</view>

				<view class="uni-flex uni-column">
					<view class="flex-item line-clamp-2 uni-bold f-15 l-h20">{{goods.goods_name}}</view>
					<view v-show="goods.tags" class="f-gray f-13 mt5 l-h20">{{goods.tags}}</view>
				</view>

				<view class="uni-flex uni-row width-between goods-attrs pt10">
					<view class="uni-center f-gray f-13 ml10 item">
						<uni-icons type="hand-thumbsup" color="gray"></uni-icons>
						<text class="ml5">推荐</text>
					</view>
					<view class="uni-center f-gray f-13 item">
						<uni-icons type="map" color="gray"></uni-icons>
						<text class="ml5">积分购</text>
					</view>
					<view v-on:click="showPopup($event, 'share')"
						class="uni-flex uni-row uni-center f-gray f-13 mr10 item">
						<uni-icons type="redo" color="gray"></uni-icons>
						<text class="ml5 share">分享</text>
					</view>
				</view>
			</view>
		</view>

		<view class="bgf mt10 pd10 goods-params round-edge ml10 mr10 mt10">
			<!--店铺满减-->
			<view v-if="fullprefer.decrease > 0" class="uni-flex uni-row width-between mt10"
				v-on:click="showPopup($event, 'fullprefer')">
				<view class="uni-flex uni-row">
					<view class="mr10 f-gray name">优惠</view>
					<view class="line-clamp-2">
						单笔订单购满{{fullprefer.amount}}元，可立减{{fullprefer.decrease}}元
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>
			<!--商品积分-->
			<view v-if="goods.integral.exchange_money > 0" class="uni-flex uni-row width-between mt10"
				v-on:click="showPopup($event, 'integral')">
				<view class="uni-flex uni-row">
					<view class="mr10 f-gray name">积分</view>
					<view class="line-clamp-2">
						该商品使用{{goods.integral.exchange_integral}}积分，可抵扣{{goods.integral.exchange_money||0}}元
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>

			<!--商品规格-->
			<view v-if="goods.spec_name_1 || goods.spec_name_2" v-on:click="showPopup($event, 'specs')"
				class="uni-flex uni-row width-between mt10 pb5">
				<view>
					<view v-if="specs.selected.spec_1 || specs.selected.spec_2" class="uni-flex uni-row">
						<view class="mr10 f-gray name">规格</view>
						<view class="line-clamp-2">
							<text>已选：</text>
							<text class="mr10" v-if="specs.selected.spec_1">
								{{goods.spec_name_1}} “{{specs.selected.spec_1}}”
							</text>
							<text class="mr10" v-if="specs.selected.spec_2">
								{{goods.spec_name_2}} “{{specs.selected.spec_2}}”
							</text>
						</view>
					</view>
					<view v-else class="uni-flex uni-row">
						<text class="mr10 f-gray name">规格</text>
						<text class="mr10 line-clamp-2">{{goods.spec_name_1}} {{goods.spec_name_2}}</text>
					</view>
					<view class="uni-flex uni-row ml10"
						style="-webkit-flex: 1;flex: 1;-webkit-flex-wrap: wrap;flex-wrap: wrap;">
						<view v-if="specs.spec_1 && index < 2" v-for="(item, index) in Object.values(specs.spec_1)"
							:key="index" class="mt5">
							<text class="f-gray pl10 pr10 f-12 round-edge mr5 pt5 pb5 bgp">{{item.spec_1}}</text>
						</view>
						<view class="mt5">
							<text
								class="f-gray pl10 pr10 f-12 round-edge mr5 pt5 pb5 bgp">共{{Object.keys(specs.spec_1).length}}种可选</text>
						</view>
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>

			<!--商品参数-->
			<view v-if="attributes.length > 0" class="uni-flex uni-row width-between mt10" v-on:click="showPopup($event, 'attributes')">
				<view class="uni-flex uni-row">
					<text class="mr10 f-gray name">参数</text>
					<view class="mr10 line-clamp-2" v-if="index < 3" v-for="(item, index) in attributes" :key="index">
						<text>{{item.name}}</text>
					</view>...
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>
			
			<!--商品服务-->
			<view class="uni-flex uni-row width-between mt10">
				<view class="uni-flex uni-row">
					<text class="mr10 f-gray name">服务</text>
					<view class="mr10 line-clamp-2">
						<text class="mr10">今日下单，次日16:00前自提</text>
					</view>
				</view>
			</view>
		</view>

		<!--领取优惠券弹窗-->
		<uni-popup ref="coupons" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-coupons :store_id="goods.store_id"></my-popup-coupons>
		</uni-popup>

		<!--点击积分弹窗-->
		<uni-popup v-if="goods.integral.enabled" ref="integral" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-integral :item="goods"></my-popup-integral>
		</uni-popup>

		<!--点击满优惠弹窗-->
		<uni-popup v-if="fullprefer" ref="fullprefer" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-fullprefer :item="fullprefer"></my-popup-fullprefer>
		</uni-popup>

		<!-- 分享到弹窗-->
		<uni-popup ref="share" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-share :body="share.body"></my-popup-share>
		</uni-popup>

		<!--产品参数弹窗-->
		<uni-popup v-if="attributes" ref="attributes" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-attributes :item="attributes"></my-popup-attributes>
		</uni-popup>

		<!--商品详情-->
		<view class="goods-description">
			<view class="uni-center pd10 flex-middle flex-center"><text class="uni-text-gray mr10">——</text><text
					class="f-gray">商品详情</text><text class="uni-text-gray ml10">——</text></view>
			<mp-html :content="goods.description" class="detail-info"></mp-html>
			<view class="pricenotice">
				<image src="/static/images/pricenotice.jpg" mode="widthFix"></image>
			</view>
		</view>
		<view class="gallery mg5">
			<view class="uni-center mb10 uni-text-gray pt5">—— <text class="f-16 uni-bold ml10 mr10 f-gray">猜你喜欢</text>
				——</view>
			<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item, index) in recommend" :key="index" class="item">
					<navigator open-type="redirect" :url="'/pages/community/goods/index?id='+item.goods_id"
						class="round-edge bgf mg5">
						<image :src="item.default_image" mode="widthFix"></image>
						<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
						<view class="uni-flex uni-row mt5 pb5 width-between">
							<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
							<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
						</view>
					</navigator>
				</view>
			</view>
			<view v-if="recommend.length > 0" class="pd10 uni-text-gray uni-center">—— 没有更多了 ——</view>
		</view>
		
		<!-- 选择规格弹窗-->
		<uni-popup ref="specs" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-specs @close="close" @confirm="confirm" :item="goods"></my-popup-specs>
		</uni-popup>
		
		<!-- 购物车商品弹窗-->
		<uni-popup ref="cart" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-shopcart :data="cart" @confirm="submit" @change="changeQty"></my-popup-shopcart>
		</uni-popup>

		<!-- 底部按钮 -->
		<view class="uni-flex">
			<view class="fixed-bottom bgf">
				<view class="uni-flex uni-row width-between pd10 paybill">
					<view v-on:click="showPopup($event, 'cart')" class="uni-flex uni-row flex-middle relative">
						<uni-icons type="cart" size="50"></uni-icons>
						<text class="badge f-13 absolute uni-center uni-bold">{{cart.total||0}}</text>
					</view>
					<view class="uni-flex uni-row width-between">
						<view v-on:click="showPopup($event, 'specs', goods)" class="f-17 f-white flex-middle flex-center mybutton lb">加入购物车</view>
						<view v-on:click="submit"
							class="uni-flex uni-row f-white flex-middle flex-center mybutton rb width-surplus"><text
								class="f-17 line-clamp-1 l-h20">去支付</text>
							<uni-icons type="arrowright" color="#ffffff" size="30"></uni-icons>
						</view>
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
				id: 0,
				swiper: {},
				videoplay: false,
				goods: {
					integral: {}
				},
				cart: {
					list: {},
					quantity: {},
					total: 0,
					paymoney: 0
				},
				specs: {
					list: {},
					spec_1: {},
					spec_2: {},
					selected: {},
					disabled: {},
					destroy: {}
				},
				recommend: [],
				historys: [],
				promotion: false,
				fullprefer: false,
				coupons: [],
				attributes: [],
				share: {
					body: {}
				},
				isAppBrowser: false,
				transparent: {}
			}
		},
		methods: {
			slide(e) {
				this.swiper.current = e.detail.current
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
				} else if(popup == 'share') {
					this.share.body = model.shareBody(this)
				}
				return this.$refs[popup].open()
			},
			closePopup(e, popup) {
				return this.$refs[popup].close()
			},
			confirm(done, item) {
				this.specs.selected.spec_1 = item.spec_1
				this.specs.selected.spec_2 = item.spec_2
				shopcart.addCart(this, item)
				done()
			},
			close(done) {
				done()
			},
			changeQty(item, type) {
				if (item.default_spec) {
					item.spec_id = item.default_spec // 字段兼容处理
				}
				shopcart.changeQty(this, item, type)
			},
			favorite() {
				model.favorite(this)
			},
			pageback() {
				uni.navigateBack()
			},
			vplay(action) {
				this.videoplay = action ? true : false
			}
		},
		onLoad(options) {
			// 说明是从海报扫码进入
			if (options.scene) {
				uni.redirectTo({
					url: '/pages/community/goods/index?' + options.scene
				})
				return false
			}
			this.id = options.id
			model.swiper(this)
			model.detail(this)
			model.specs(this)
			model.attributes(this)
			model.recommend(this)
			// model.historys(this.id)
			// #ifndef MP
			model.transparent(this, 0)
			// #endif
		},
		onShow() {
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false
			shopcart.buildQty(this)
		},
		onPageScroll(e) {
			// #ifndef MP
			let value = e.scrollTop / 200
			model.transparent(this, value)
			// #endif
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
