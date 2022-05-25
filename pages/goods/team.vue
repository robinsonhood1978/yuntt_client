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
					<text class="f-17 f-white" v-show="transparent.titleShow" style="padding-left: 90rpx;">商品详情</text>
				</view>
				<view class="uni-flex uni-row">
					<navigator url="/pages/cart/index" open-type="switchTab" hover-class="none"
						class="round uni-center mr10" :style="transparent.btnBackground">
						<uni-icons type="cart" :color="transparent.iconColor" size="40"></uni-icons>
					</navigator>
					<view class="round uni-center mr10" :style="transparent.btnBackground">
						<uni-icons v-on:click="showPopup($event, 'morenav')" type="more-filled"
							:color="transparent.iconColor" size="40"></uni-icons>
						<uni-popup ref="morenav" type="dialog">
							<my-popup-morenav></my-popup-morenav>
						</uni-popup>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>

		<!--商品价格-->
		<view class="goods-detail">
			<view class="uni-flex uni-row">
				<view class="price">
					<view v-if="promotion" class="uni-flex uni-row pt5 flex-middle">
						<view class="f-white ml10" style="font-size: 50rpx;">{{teambuy.price|currency}}</view>
						<text class="f-white del ml10 f-15">{{promotion.price|currency}}</text>
					</view>
					<view v-else class="uni-flex uni-row pt5 flex-middle">
						<view class="f-white ml10" style="font-size: 50rpx;">{{teambuy.price|currency}}</view>
						<text class="f-white del ml10 f-15">{{goods.price|currency}}</text>
					</view>
				</view>
				<view class="promote">
					<view style="padding-top: 8rpx;">
						<view class="f-red f-17 pl10 pr10 uni-bold uni-center">{{teambuy.people||2}}人团</view>
						<text class="flex-center f-red f-12" style="margin-top: -8rpx;">拼着买更优惠</text>
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

		<view v-if="teambuylogs.total > 0" class="bgf mt10 pd10 round-edge ml10 mr10 mt10">
			<view class="uni-flex uni-column pb5 teambuylog">
				<view class="uni-flex uni-row width-between">
					<text class="f-15 uni-bold">{{teambuylogs.total}}人正在拼单，可直接参与</text>
					<view class="uni-flex uni-row">
						<navigator url="/pages/teambuy/list" class="f-14" hover-class="none">更多拼团</navigator>
						<uni-icons type="arrowright" size="30"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-x="false" scroll-y="true" class="pt5 pb5" style="max-height: 200rpx;">
					<view v-for="(item, index) in teambuylogs.list" :key="index" class="uni-flex uni-row mt5 mb5">
						<view class="uni-flex uni-row flex-middle portrait">
							<image :src="item.portrait" mode="scaleToFill"></image>
							<text class="ml10 line-clamp-1">{{item.nickname||item.username}}</text>
						</view>
						<view class="uni-flex uni-row flex-middle width-between">
							<view class="uni-flex uni-column mt10" style="line-height: 20rpx;">
								<text class="f-gray">还差 {{item.surplus||1}} 人成团</text>
								<view class="uni-flex uni-row">
									<text>剩余</text>
									<my-countdown :showDay="false" :timestamp="item.timestamp">
									</my-countdown>
								</view>
							</view>
							<view v-on:click="buttonClick('team', goods.spec_qty > 0, item.teamid)"
								class="mybutton f-white">去拼单</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="bgf mt10 pd10 round-edge ml10 mr10 mt10">
			<view class="uni-flex uni-column teamrule">
				<text class="f-15 uni-bold">拼团规则</text>
				<view class="uni-flex uni-row rule-box mt10 mb10 pt10 f-gray">
					<view class="uni-flex uni-column uni-center box-flex relative">
						<text class="number">1</text>
						<view class="mt5 mb5">选择商品</view>
						<view class="line absolute"></view>
					</view>
					<view class="uni-flex uni-column uni-center box-flex relative">
						<text class="number">2</text>
						<view class="mt5 mb5">开团/参团</view>
						<view class="line absolute"></view>
					</view>
					<view class="uni-flex uni-column uni-center box-flex relative">
						<text class="number">3</text>
						<view class="mt5 mb5">邀请好友</view>
						<view class="line absolute"></view>
					</view>
					<view class="uni-flex uni-column uni-center box-flex relative">
						<text class="number">4</text>
						<view class="mt5 mb5">人满成团</view>
					</view>
				</view>
				<view v-on:click="showPopup($event, 'teamrule')" class="flex-center">
					<uni-icons size="34" type="arrowdown"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 选择规格弹窗-->
		<uni-popup v-if="specs.list" ref="specs" type="bottom" class="relative" style="z-index: 100;">
			<view class="bgf pt10 top-round-edge goods-specs">
				<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="closePopup($event, 'specs')">
				</uni-icons>
				<view class="uni-bold uni-center f-16 pt5 pb10">选择规格</view>
				<view class="uni-flex uni-row width-between info">
					<view class="uni-flex uni-row pd10">
						<image :src="goods.default_image" mode="widthFix"></image>
						<view class="uni-flex uni-column ml10">
							<view v-if="promotion" class="uni-flex uni-row">
								<text class="f-red f-17">{{cart.rfprice|currency}}</text>
								<view class="f-white pl10 pr10 ml10"
									style="height: 50rpx; border-radius: 30rpx; background-color: #F50C04;">
									<text v-if="buytype == 'team'">拼团价{{teambuy.price|currency}}</text>
									<text v-else>优惠价{{cart.price|currency}}</text>
								</view>
							</view>
							<view v-else>
								<text class="f-red f-17">{{cart.price|currency}}</text>
							</view>
							<text class="f-gray f-13">库存：{{cart.stock||0}}件</text>
							<text class="mt5 f-13">
								您已选择：{{specs.selected.spec_1||''}} {{specs.selected.spec_2||''}}
							</text>
						</view>
					</view>
				</view>
				<scroll-view scroll-x="false" scroll-y="true" class="pd10"
					style="max-height: 650rpx; min-height: 500rpx;">
					<view v-if="goods.spec_name_1" class="uni-flex uni-column">
						<text class="mr10 uni-bold f-15 f-c55">{{goods.spec_name_1}}</text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<view
								:class="['bgf mr10 mt10 item', specs.disabled[item.spec_1] ? 'disabled' : '', specs.selected.spec_1 == item.spec_1 ? 'selected': '']"
								v-for="(item, index) in specs.spec_1" :key="index">
								<text v-if="specs.disabled[item.spec_1]"
									:class="['pl10 pr10', specs.destroy[item.spec_1] ? 'destroy' : '']">{{item.spec_1}}</text>
								<text v-else v-on:click="changeSpec(item, 'spec_1', 'spec_2')">{{item.spec_1}}</text>
							</view>
						</view>
					</view>
					<view v-if="goods.spec_name_2" class="uni-flex uni-column mt10 pt10">
						<text class="mr10 uni-bold f-15 f-c55">{{goods.spec_name_2}}</text>
						<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
							<view
								:class="['bgf mr10 mt10 item', specs.disabled[item.spec_2] ? 'disabled' : '', specs.selected.spec_2 == item.spec_2 ? 'selected': '']"
								v-for="(item, index) in specs.spec_2" :key="index">
								<text v-if="specs.disabled[item.spec_2]"
									:class="['pl10 pr10', specs.destroy[item.spec_2] ? 'destroy' : '']">{{item.spec_2}}</text>
								<text v-else v-on:click="changeSpec(item, 'spec_2', 'spec_1')">{{item.spec_2}}</text>
							</view>
						</view>
					</view>
					<view class="uni-flex uni-row width-between mt10 mb10 pt10 mr10 pr10" style="margin-top: 40rpx;">
						<text class="mt5 uni-bold f-15 f-c55">购买数量</text>
						<view class="uni-flex uni-row popup-quantity">
							<text v-on:click="changeQty($event, 'minus')" class="minus uni-center flex-middle">-</text>
							<input maxlength="5" type="number" class="uni-center f-13 flex-middle" @blur="changeQty"
								v-model="cart.quantity" />
							<text v-on:click="changeQty($event, 'plus')" class="plus uni-center flex-middle">+</text>
						</view>
					</view>
				</scroll-view>
				<view class="uni-flex uni-row width-surplus bottom-nav">
					<view class="uni-flex uni-row flex-middle buttons pd5">
						<text class="uni-center f-white uni-bold f-15 mybutton"
							v-on:click="buttonClick(buytype, false, teambuy.teamid)">确定</text>
					</view>
				</view>
			</view>
		</uni-popup>

		<!--领取优惠券弹窗-->
		<uni-popup ref="coupons" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-coupons :store_id="goods.store_id"></my-popup-coupons>
		</uni-popup>

		<!-- 分享到弹窗-->
		<uni-popup ref="share" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-share :body="share.body"></my-popup-share>
		</uni-popup>

		<!--拼团规则弹窗-->
		<uni-popup ref="teamrule" type="bottom" class="relative" style="z-index: 100;">
			<view class="bgf pd10">
				<view class="f-16 uni-center pb10 uni-bold">拼团规则</view>
				<view class="uni-flex uni-column bt pt10 pb10 ml10 mr10 f-gray">
					<text class="mb10">1.开团：在商城内选择喜欢的商品，点击“发起拼单”，付款成功后即为开团成功。</text>
					<text class="mb10">2.参团：进入朋友分享的页面，点击“去拼单”，付款后即为参团成功，若多人同时支付，按先支付成功的用户获得参团资格，参团订单未支付不计入参团数量。</text>
					<text class="mb10">3.邀请成团：在开团或参团之后,可以点击“分享”，在有效时间凑齐成团人数即拼团成功。</text>
					<text>4.自动成团：在有效时间内未凑齐人数，系统会在到期后自动成团。</text>
				</view>
			</view>
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
					<navigator :url="'/pages/goods/index?id='+item.goods_id" class="round-edge bgf mg5">
						<image :src="item.default_image" mode="widthFix"></image>
						<view class="line-clamp-2 ml10 mr10 l-h20">{{item.goods_name}}</view>
						<view class="uni-flex uni-row uni-common-pb mt10 width-between">
							<view class="f-red uni-bold ml10">{{item.price|currency}}</view>
							<view class="f-13 f-gray mr10">{{item.sales||0}}人已买</view>
						</view>
					</navigator>
				</view>
			</view>
			<view v-if="recommend.length > 0" class="pd10 uni-text-gray uni-center">—— 没有更多了 ——</view>
		</view>

		<!--单独购买/拼团购买按钮-->
		<view class="box-shadow-top">
			<view class="fixed-bottom">
				<view class="uni-flex uni-row width-surplus bottom-nav">
					<view class="uni-flex uni-row labels">
						<view class="uni-flex uni-column uni-center" v-on:click="labelClick('store')">
							<uni-icons type="shop" size="40" color="#fc2b34"></uni-icons>
							<text class="uni-center f-gray">店铺</text>
						</view>
						<view v-if="!goods.becollected" class="uni-flex uni-column ml10 uni-center"
							v-on:click="labelClick('collect')" style="width: 104rpx;">
							<uni-icons type="star" size="40" color="gray"></uni-icons>
							<text class="uni-center f-gray">收藏</text>
						</view>
						<view v-if="goods.becollected" class="uni-flex uni-column ml10 uni-center"
							v-on:click="labelClick('collect', 'remove')">
							<uni-icons type="star-filled" size="40" color="#fc2b34"></uni-icons>
							<text class="uni-center f-gray">已收藏</text>
						</view>
					</view>
					<view class="uni-flex uni-row flex-middle buttons ml10">
						<view class="uni-flex uni-column each uni-center f-white lb"
							v-on:click="buttonClick('buy', goods.spec_qty > 0)">
							<text class="f-13">单独购买</text><text class="uni-bold">{{cart.price|currency}}</text>
						</view>
						<view class="uni-flex uni-column each uni-center f-white rb"
							v-on:click="buttonClick('team', goods.spec_qty > 0)">
							<text class="f-13">发起拼单</text><text class="uni-bold">{{teambuy.price|currency}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="fixed-space"></view>
		</view>
		<!-- #ifdef H5-->
		<view class="morenavh5" v-on:click="showPopup($event, 'morenavh5')">
			<view class="pl5 pr5 pt10 pb10 absolute f-white">快<br>捷<br>导<br>航</view>
			<uni-popup ref="morenavh5" type="dialog">
				<my-popup-morenav position="leftbottom"></my-popup-morenav>
			</uni-popup>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './index.js'
	export default {
		data() {
			return {
				id: 0,
				swiper: {},
				videoplay: false,
				goods: {},
				cart: {
					selected: 0,
					price: 0,
					quantity: 1,
					stock: 0
				},
				buytype: 'team',
				teambuy: {
					teamid: ''
				},
				teambuylogs: {
					list: [],
					total: 0
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
				coupons: [],
				share: {
					body: {}
				},
				isAppBrowser: false,
				transparent: {}
			}
		},
		methods: {
			slide: function(e) {
				this.swiper.current = e.detail.current
			},
			labelClick: function(type, action) {
				if (type == 'store') {
					uni.navigateTo({
						url: '/pages/store/index?id=' + this.goods.store_id
					})
				} else if (type == 'collect') {
					model.collect(this, action == 'remove' ? true : false)
				}
			},
			buttonClick: function(type, dialog, extraId = '') {
				this.buytype = type
				this.teambuy.teamid = extraId
				if (dialog) {
					return this.$refs['specs'].open()
				}
				if (type == 'team') {
					return model.addTeambuy(this)
				}
				model.addCart(this, type == 'cart' ? false : true)
			},
			changeSpec: function(item, field, thefield) {
				model.changeSpec(this, item, field, thefield)
			},
			changeQty: function(e, type) {
				model.changeQty(this, e.detail.value, type)
			},
			showPopup: function(e, popup) {
				if (popup == 'share') {
					this.share.body = model.shareBody(this)
				}
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			},
			compareText: function(value) {
				return value == 'low' ? '低' : (value == 'equal' ? '平' : '高')
			},
			dynamicValue: function(value) {
				return Number(value).toFixed(1)
			},
			favorite: function() {
				model.favorite(this)
			},
			pageback: function() {
				uni.navigateBack()
			},
			vplay(action) {
				this.videoplay = action ? true : false
			}
		},
		onLoad: function(options) {
			this.id = options.id
			model.swiper(this)
			model.detail(this)
			model.specs(this)
			model.teambuylogs(this)
			model.recommend(this)
			// #ifndef MP
			model.transparent(this, 0)
			// #endif
		},
		onShow() {
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false
		},
		onPageScroll: function(e) {
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
	@import url("./team.css");
</style>
