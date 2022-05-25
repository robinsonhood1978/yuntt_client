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
			<view v-show="!isAppBrowser" class="uni-flex uni-row fixed-top flex-middle navbar"
				:style="transparent.background">
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
			<!--批发价模式-->
			<scroll-view v-if="batchbuy.list.length > 0" scroll-x="true" scroll-y="false" class="batchbuy">
				<view class="uni-flex uni-row pd10">
					<view v-for="(item, index) in batchbuy.list" :key="index">
						<view class="uni-flex uni-row flex-middle item"
							:class="[batchbuy.list.length > 2 ? 'item-3' : '']">
							<view class="uni-flex uni-column f-white mr10 mt5 l-h20">
								<text style="font-size: 44rpx;">{{item.price|currency}}</text>
								<text v-if="item.max > 0" class="ml5 f-12">{{item.min}}-{{item.max}} 件</text>
								<text v-else class="ml5 f-12">≥{{item.min}} 件</text>
							</view>
							<uni-icons v-show="index < batchbuy.list.length-1" type="arrowright" color="#ffffff"
								class="flex-center"></uni-icons>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 普通价模式-->
			<view v-else class="uni-flex uni-row">
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
			<!--是否参与拼团-->
			<navigator v-if="teambuy.status == 1" :url="'/pages/goods/team?id='+goods.goods_id" hover-class="none"
				class="uni-flex uni-row width-between mt10">
				<view class="uni-flex uni-row">
					<view class="mr10 f-gray name">拼团</view>
					<view class="line-clamp-2">该商品参与<text class="teambuy f-12 ml5 mr5 f-white">拼团</text>活动，拼着买更优惠
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</navigator>

			<!--是否参与搭配购-->
			<navigator v-if="mealbuy.status == 1" :url="'/pages/meal/list?goods_id='+goods.goods_id" hover-class="none"
				class="uni-flex uni-row width-between mt10">
				<view class="uni-flex uni-row">
					<view class="mr10 f-gray name">搭配</view>
					<view class="line-clamp-2">该商品参与<text class="meal f-12 ml5 mr5 f-white">搭配购</text>活动，搭配买更划算
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</navigator>

			<!--是否参与阶梯价-->
			<view v-if="batchbuy.list.length > 0" v-on:click="buttonClick('cart', true, 'batchbuy')"
				class="uni-flex uni-row width-between mt10">
				<view class="uni-flex uni-row">
					<view class="mr10 f-gray name">批发</view>
					<view class="line-clamp-2">该商品支持<text class="batchbuy f-12 ml5 mr5 f-white">阶梯价</text>购买，一键批发拿货
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>

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
							<text class="f-gray pl10 pr10 f-12 round-edge mr5 pt5 pb5 bgp line-clamp-1">{{item.spec_1}}</text>
						</view>
						<view class="mt5">
							<text
								class="f-gray pl10 pr10 f-12 round-edge mr5 pt5 pb5 bgp">共{{Object.keys(specs.spec_1).length}}种可选</text>
						</view>
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>

			<!--物流信息-->
			<view class="uni-flex uni-row width-between mt10" v-on:click="showPopup($event, 'addresses')">
				<view>
					<view class="uni-flex uni-row">
						<text class="mr10 f-gray name">发货</text>
						<view class="uni-flex uni-row mr10">
							<text>{{store.province||'中国'}}</text>
							<text v-if="store.province">{{store.city}}</text>
							<text class="ml10 mr10 uni-text-gray">|</text>
							<view>{{delivery.name||'快递'}}
								<text class="ml5" v-if="delivery.freight > 0">{{delivery.freight|currency}}</text>
								<text class="ml5" v-else>免运费</text>
							</view>
						</view>
					</view>
					<view v-if="delivery.shipping.province" class="f-gray ml10 f-13">
						配送至：{{delivery.shipping.province}}{{delivery.shipping.city}}{{delivery.shipping.district||''}}{{delivery.shipping.address}}
					</view>
				</view>
				<uni-icons type="arrowright" color="gray"></uni-icons>
			</view>

			<!--商品参数-->
			<view v-if="attributes.length > 0" class="uni-flex uni-row width-between mt10 pt5"
				v-on:click="showPopup($event, 'attributes')">
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
						<text class="mr10">七天无理由退换</text>
					</view>
				</view>
			</view>
		</view>

		<!--店铺信息-->
		<view v-if="store.dynamiceval" class="bgf mt10 pb10 round-edge ml10 mr10 mt10 storeinfo">
			<view class="uni-flex uni-row pd10">
				<view class="store_logo">
					<image :src="store.store_logo" mode="scaleToFill" />
				</view>
				<view class="uni-flex uni-column ml10 mt10 width-surplus">
					<text class="l-h20 line-clamp-2 f-17">{{store.store_name}}</text>
					<!-- #ifndef MP-TOUTIAO -->
					<image class="mt5 credit_image" :src="store.credit_image" mode="heightFix" />
					<!-- #endif -->
				</view>
				<navigator :url="'/pages/store/index?id='+store.store_id" hover-class="none"
					class="f-white f-13 pl10 pr10 uni-center ml10 mt10 button">进店逛逛</navigator>
			</view>
			<view class="uni-flex uni-row dynamiceval f-gray pd10">
				<view class="uni-flex uni-row flex-middle flex-center">
					<text class="f-12">宝贝描述</text>
					<view :class="['f-12 ml5', store.dynamiceval.goods.compare.name]">
						<text>{{dynamicValue(store.dynamiceval.goods.value)}}</text>
						<text class="ml5 compare">{{compareText(store.dynamiceval.goods.compare.name)}}</text>
					</view>
				</view>
				<view class="uni-flex uni-row flex-middle flex-center">
					<text class="f-12">卖家服务</text>
					<view :class="['f-12 ml5', store.dynamiceval.service.compare.name]">
						<text>{{dynamicValue(store.dynamiceval.service.value)}}</text>
						<text class="ml5 compare">{{compareText(store.dynamiceval.service.compare.name)}}</text>
					</view>
				</view>
				<view class="uni-flex uni-row flex-middle flex-center">
					<text class="f-12">物流服务</text>
					<view :class="['f-12 ml5', store.dynamiceval.shipped.compare.name]">
						<text>{{dynamicValue(store.dynamiceval.shipped.value)}}</text>
						<text class="ml5 compare">{{compareText(store.dynamiceval.shipped.compare.name)}}</text>
					</view>
				</view>
			</view>
		</view>

		<!--批发进货弹窗-->
		<uni-popup v-if="specs.list" ref="batchbuy" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-batchbuy :item="goods" :mode="batchbuy.mode"></my-popup-batchbuy>
		</uni-popup>

		<!-- 选择规格弹窗-->
		<uni-popup v-if="specs.list" ref="specs" type="bottom" class="relative" style="z-index: 100;">
			<view class="bgf pt10 top-round-edge goods-specs">
				<uni-icons type="closeempty" size="44" class="ml10 absolute" v-on:click="closePopup($event, 'specs')">
				</uni-icons>
				<view class="uni-bold uni-center f-16 pt5 pb10">选择规格</view>
				<view class="uni-flex uni-row width-between info">
					<view class="uni-flex uni-row pd10">
						<view class="image">
							<image :src="goods.default_image" mode="widthFix"></image>
						</view>
						<view class="uni-flex uni-column ml10">
							<view v-if="promotion" class="uni-flex uni-row">
								<text class="f-red f-17">{{cart.rfprice|currency}}</text>
								<text class="f-white pl10 pr10 ml10"
									style="height: 50rpx; border-radius: 30rpx; background-color: #F50C04;">优惠价{{cart.price|currency}}</text>
							</view>
							<view v-else>
								<text class="f-red f-17">{{cart.price|currency}}</text>
							</view>
							<text class="f-gray f-13">销量：{{goods.sales||0}}件</text>
							<text class="mt5 f-13 l-h20">
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
						<view class="mt5 uni-flex uni-row"><text class="uni-bold f-15 f-c55">购买数量</text><text
								class="f-gray ml10">库存{{cart.stock||0}}件</text></view>
						<view class="uni-flex uni-row popup-quantity">
							<text v-on:click="changeQty($event, 'minus')" class="minus uni-center flex-middle">-</text>
							<input maxlength="3" type="number" class="uni-center f-13 flex-middle" @blur="changeQty"
								v-model="cart.quantity" />
							<text v-on:click="changeQty($event, 'plus')" class="plus uni-center flex-middle">+</text>
						</view>
					</view>
				</scroll-view>
				<view class="uni-flex uni-row width-surplus bottom-nav">
					<view class="uni-flex uni-row flex-middle buttons pd5">
						<text class="each uni-center f-white lb uni-bold" v-on:click="buttonClick('cart')">加入购物车</text>
						<text class="each uni-center f-white rb uni-bold" v-on:click="buttonClick('buy')">立即购买</text>
					</view>
				</view>
			</view>
		</uni-popup>

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

		<!--选择收货地址弹窗-->
		<uni-popup ref="addresses" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-address redirect="yes" :addresses="delivery.addresses" @confirm="shipping">
			</my-popup-address>
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
					<navigator open-type="redirect" :url="'/pages/goods/index?id='+item.goods_id"
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

		<!--底部加入购物车/购买按钮-->
		<view class="box-shadow-top">
			<view class="fixed-bottom">
				<view class="uni-flex uni-row width-surplus bottom-nav">
					<view class="uni-flex uni-row labels">
						<view class="uni-flex uni-column uni-center" v-on:click="labelClick('store')">
							<uni-icons type="shop" size="40" color="#fc2b34"></uni-icons>
							<text class="uni-center f-gray">店铺</text>
						</view>
						<!-- #ifndef MP-->
						<view class="uni-flex uni-column ml10 uni-center" v-on:click="labelClick('contact')">
							<uni-icons type="chatbubble" size="40" color="gray"></uni-icons>
							<text class="uni-center f-gray">客服</text>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-->
						<view class="uni-flex uni-column ml10 uni-center" v-on:click="labelClick('cart')">
							<uni-icons type="cart" size="40" color="gray"></uni-icons>
							<text class="uni-center f-gray">购物车</text>
						</view>
						<!-- #endif -->
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
						<text class="each uni-center f-white lb uni-bold"
							v-on:click="buttonClick('cart', goods.spec_qty > 0)">加入购物车</text>
						<text class="each uni-center f-white rb uni-bold"
							v-on:click="buttonClick('buy', goods.spec_qty > 0)">立即购买</text>
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
				goods: {
					integral: {}
				},
				store: {},
				cart: {
					selected: 0,
					price: 0,
					quantity: 1,
					stock: 0
				},
				// 拼团
				teambuy: {
					teamid: ''
				},
				// 搭配购
				mealbuy: {},
				// 批量下单（阶梯价）
				batchbuy: {
					mode: 'cart',
					list: []
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
				delivery: {
					name: '',
					freight: 0,
					addresses: [],
					shipping: {}
				},
				attributes: [],
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
					uni.redirectTo({
						url: '/pages/store/index?id=' + this.store.store_id
					})
				} else if (type == 'contact') {
					// #ifdef APP-PLUS
					let qq = this.store.im_qq ? this.store.im_qq : '561223725'
					plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin=' + qq + '&version=1&src_type=web')
					// #endif
					// #ifndef APP-PLUS
					uni.showModal({
						title: '客服电话',
						content: this.store.tel ? this.store.tel : '18999999999',
						showCancel: false
					})
					// #endif
				} else if (type == 'collect') {
					model.collect(this, action == 'remove' ? true : false)
				} else if (type == 'cart') {
					uni.switchTab({
						url: '/pages/cart/index'
					})
				}
			},
			buttonClick: function(type, dialog, popup = 'specs') {
				if (dialog) {
					this.batchbuy.mode = type
					return this.$refs[popup].open()
				}
				model.addCart(this, type == 'cart' ? false : true)
			},
			changeSpec: function(item, field, thefield) {
				model.changeSpec(this, item, field, thefield)
			},
			shipping: function(done, address) {
				done()
				model.logistics(this, address)
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

			if (options.invite) {
				// 记录三级分销邀请码
				uni.setStorageSync('distributeInviteGoodsCode', options.invite)
			}

			model.swiper(this)
			model.detail(this)
			model.specs(this)
			model.attributes(this)
			model.delivery(this)
			model.recommend(this)
			model.historys(this.id)
			// #ifndef MP
			model.transparent(this, 0)
			// #endif
		},
		onShow() {
			this.isAppBrowser = (util.isWechat() || util.isAlipay() || util.isQqbrowser()) ? true : false
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
