<template>
	<view>
		<view v-if="form.otype != 'guidebuy'">
			<view v-if="addresses.list.length <= 0"
				class="uni-flex uni-row bgf mt10 ml10 mr10 mb10 pd10 round-edge flex-middle">
				<uni-icons type="location"></uni-icons>
				<navigator url="/pages/order/address?redirect=yes" hover-class="none" class="ml10 width-surplus uni-bold f-15">请选择收货地址
				</navigator>
				<uni-icons type="arrowright"></uni-icons>
			</view>
			<navigator v-if="addr_id == form.addr_id" :url="'/pages/order/address?redirect=yes&addr_id='+item.addr_id"
				hover-class="none" v-for="(item, addr_id, index) in addresses.list" :key="addr_id"
				class="uni-flex uni-row bgf mt10 ml10 mr10 mb10 pd10 round-edge flex-middle">
				<uni-icons type="location"></uni-icons>
				<view class="uni-flex uni-column ml10 width-surplus">
					<text class="uni-bold f-15 mr10">{{item.consignee}} {{item.phone_mob}}</text>
					<text
						class="f-gray">{{item.province||''}}{{item.city||''}}{{item.district||''}}{{item.address}}</text>
				</view>
				<uni-icons type="arrowright"></uni-icons>
			</navigator>
		</view>
		<view v-else>
			<view v-if="!guideshop || !guideshop.id"
				class="uni-flex uni-row bgf mt10 ml10 mr10 mb10 pd10 round-edge flex-middle">
				<uni-icons type="location"></uni-icons>
				<navigator url="/pages/guider/shop/list?redirect=yes" hover-class="none"
					class="ml10 width-surplus uni-bold f-15">请选择提货点
				</navigator>
				<uni-icons type="arrowright"></uni-icons>
			</view>

			<view v-else class="uni-flex uni-column round-edge bgf mt10 ml10 mr10 mb10 pd10 guideshop">
				<view class="uni-flex uni-row width-between flex-middle">
					<text class="uni-bold f-16">提货人：{{form.consignee}} {{form.phone_mob}}</text>
					<view v-on:click="showPopup($event, 'shipper')" class="f-c60 f-15" style="min-width: 100rpx;">
						<text v-if="form.consignee && form.phone_mob">修改</text>
						<text v-else>请添加提货人</text>
						<uni-icons type="arrowright" color="#ff6600"></uni-icons>
					</view>
				</view>
				<view class="uni-flex uni-row width-between pt10 mt10 flex-middle bt">
					<text class="uni-bold f-16">自提点：{{guideshop.name}}</text>
					<navigator :url="'/pages/guider/shop/list?redirect=yes&shopid='+form.extraParams.shopid"
						hover-class="none" style="min-width: 100rpx;"><text class="f-c60 f-15">切换</text>
						<uni-icons type="arrowright" color="#ff6600"></uni-icons>
					</navigator>
				</view>
				<view class="uni-flex uni-column mt5">
					<view class="uni-flex uni-row width-between flex-middle">
						<text
							class="f-gray mr10 l-h20 width-surplus">{{guideshop.province||''}}{{guideshop.city||''}}{{guideshop.district||''}}{{guideshop.address}}</text>
						<view v-if="guideshop.latitude && guideshop.longitude" v-on:click="openLocation(guideshop)" class="f-c60 mr10"><text class="iconfont iconnavigation_line f-13"></text><text>导航</text>
						</view>
					</view>
					<view class="uni-flex uni-column pl10 pr10 pt10 pb10 mt10 tip f-13">
						<view class="uni-flex uni-row l-h20"><text
								class="iconfont iconanquanzhuye f-13 mr5"></text><text>下单后如有问题，可联系团长为您解决。</text>
						</view>
						<view class="uni-flex uni-row l-h20"><text
								class="iconfont icongouwudai1 f-13 mr5"></text><text>建议自备购物袋提货，共同助力环保~</text></view>
					</view>
				</view>
				<!-- 添加提货人弹窗-->
				<uni-popup ref="shipper" type="dialog">
					<my-popup-shipper @confirm="confirm" :data="shipper"></my-popup-shipper>
				</uni-popup>
			</view>
		</view>

		<view class="ml10 mr10 gallery">
			<view class="round-edge pd10 mb10 bgf list" v-for="(store, store_id) in orders.orderList" :key="store_id">
				<view v-if="form.otype != 'guidebuy'" class="uni-flex uni-row mb10">
					<navigator open-type="redirect" hover-class="none" class="f-16"
						:url="'/pages/store/index?id='+store.store_id">
						{{store.store_name}}
					</navigator>
					<uni-icons type="arrowright"></uni-icons>
				</view>
				<view v-else class="f-16 mb10">
					<text class="iconfont iconlishi- mr5"></text>
					<text>{{pickuptime}}</text>
				</view>

				<view v-on:click="redirect(goods.goods_id)" v-for="(goods, id, index) in store.items" :key="id"
					class="uni-flex uni-row width-between pt10 item">
					<view>
						<image class="image" :src="goods.goods_image" mode="widthFix" />
					</view>
					<view :class="['uni-flex uni-row width-between width-surplus ml10 pt10', index > 0 ? 'bt' : '']"
						style="margin-top: -20rpx;">
						<view class="uni-flex uni-column mr10">
							<view class="line-clamp-2 l-h20">{{goods.goods_name}}</view>
							<view class="f-gray">{{goods.specification}}</view>
						</view>
						<view class="uni-flex uni-column">
							<view>{{goods.price||0.00}}</view>
							<view class="f-gray" style="text-align: right;">x{{goods.quantity||1}}</view>
						</view>
					</view>
				</view>
				<view v-if="form.otype != 'guidebuy' && shippings[store_id]"
					class="uni-flex uni-row mt10 pt10 f-15 flex-middle width-between">
					<text class="mr10 f-15">配送费</text>
					<view class="uni-flex uni-row" v-on:click="delivery($event, store_id)">
						<view class="f-15" v-if="type == form.delivery_type[store_id]"
							v-for="(shipping, type, index) in shippings[store_id][form.region_id]" :key="type">
							<text class="mr10">{{shipping.name}}</text>
							<text class="f-red">{{shipping.logistic_fees|currency}}</text>
						</view>
						<uni-icons type="arrowright" size="30" color="gray"></uni-icons>
					</view>
				</view>
				<view v-if="store.allow_coupon == 1 && store.coupon_list.length > 0"
					class="uni-flex uni-row mt10 f-15 flex-middle width-between">
					<text class="mr10 f-15">优惠券</text>
					<view class="uni-flex uni-row" v-on:click="coupon($event, store_id)">
						<view v-if="coupon.coupon_sn == form.coupon_sn[store_id]"
							v-for="(coupon, index) in store.coupon_list" :key="index">
							<text class="mr10">{{coupon.coupon_name}}</text>
							<text class="f-red">-{{coupon.coupon_value|currency}}</text>
						</view>
						<view v-if="form.coupon_sn[store_id] == 0">不使用优惠券</view>
						<uni-icons type="arrowright" size="30" color="gray"></uni-icons>
					</view>
				</view>
				<view v-if="store.fullprefer.price > 0" class="uni-flex uni-row mt10 f-15 flex-middle width-between">
					<text class="mr10 f-15">商家优惠</text>
					<view class="f-red mr5">-{{store.fullprefer.price|currency}}</view>
				</view>
				<view class="uni-flex uni-row mt10 f-15 flex-middle">
					<view class="mr10 f-15">备注</view>
					<view class="uni-flex uni-row flex-middle">
						<input v-model="form.postscript[store_id]" class="width-surplus" type="text" placeholder="选填"
							placeholder-class="placeholder" />
						<uni-icons v-show="form.postscript[store_id]" size="30" color="gray"
							v-on:click="clearInput($event, store_id)" type="closeempty" class="ml10"></uni-icons>
					</view>
				</view>
				<view class="uni-flex uni-row mt10 pb5 pt5 f-15 width-between">
					<text class="mr10 f-15">小计</text>
					<view class="f-red mr5 uni-bold">{{store.paymoney|currency}}</view>
				</view>
			</view>

			<view class="round-edge bgf pb10 mb10">
				<view v-if="orders.allow_integral == 1"
					class="uni-flex uni-row f-15 pl10 pb5 pt10 pr10 flex-middle width-between">
					<text class="mr10 f-15">积分抵扣</text>
					<view v-on:click="integral" class="f-15">
						<text v-if="form.exchange_integral > 0"
							class="f-red">-{{integralExchange.money|currency}}</text>
						<text v-else class="f-gray">不使用积分</text>
						<uni-icons size="30" color="gray" type="arrowright"></uni-icons>
					</view>
				</view>
				<view class="uni-flex uni-row f-15 pl10 pt5 flex-middle width-between">
					<text class="mr10 f-15">匿名购买</text>
					<switch v-on:change="anonymous" color="#F0AD4E"></switch>
				</view>
			</view>
		</view>
		<view class="fixed-bottom box-shadow-top bgf paybill">
			<view class="mg5">
				<view class="uni-flex uni-row width-between pt5 pb5 pl10 pr10 flex-middle">
					<view class="uni-item uni-flex mr10 f-16"><text>合计(含运费)：</text><text
							class="f-red uni-bold">{{orders.paymoney|currency}}</text></view>
					<view class="uni-item uni-center f-white uni-bold f-15 mybutton" v-on:click="submit">立即支付</view>
				</view>
			</view>
		</view>
		<view class="fixed-space"></view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './normal.js'
	export default {
		data() {
			return {
				orders: {},
				addresses: {
					list: []
				},
				shippings: [],
				guideshop: {},
				shipper: {},
				pickuptime: '',
				allowsubmit: true,
				integralExchange: {
					points: 0,
					money: 0,
				},
				form: {
					otype: 'normal',
					addr_id: 0,
					region_id: 0,
					consignee: '',
					phone_mob: '',
					delivery_type: {},
					postscript: {},
					coupon_sn: {},
					exchange_integral: 0,
					anonymous: {},
					specs: [],
					extraParams: {}
				},
				redirectParams: {}
			}
		},
		methods: {
			clearInput: function(e, store_id) {
				this.form.postscript[store_id] = ''
			},
			submit: function(e) {
				model.submit(this)
			},
			delivery: function(e, store_id) {
				model.delivery(this, store_id)
			},
			coupon: function(e, store_id) {
				model.coupon(this, store_id)
			},
			integral: function() {
				model.integral(this)
			},
			anonymous: function(e) {
				model.anonymous(this, e.detail.value)
			},
			redirect: function(id) {
				// #ifndef MP
				wx.navigateTo({
					url: '/pages/goods/index?id=' + id
				})
				// #endif
			},
			showPopup(e, popup) {
				this.shipper = {
					consignee: this.form.consignee,
					phone_mob: this.form.phone_mob
				}
				return this.$refs[popup].open()
			},
			confirm(done, shipper) {
				// 存到缓存，避免切换页面丢失
				uni.setStorageSync('guideshopshipper', shipper)
				Object.assign(this.form, shipper)
				done()
			},
			openLocation(item) {
				uni.openLocation({
					latitude: Number(item.latitude),
					longitude: Number(item.longitude)
				})
			}
		},
		onLoad: function(options) {
			let that = this;

			['addr_id', 'otype', 'specs'].forEach(function(item, index) {
				if (options[item]) {
					that.redirectParams[item] = options[item]
					that.form[item] = options[item]
					delete(options[item])
				}
			})
			that.form.extraParams = options

			// 读取订单信息
			model.order(that)

			// 获取自提时间
			model.getPickupTime(that)
		},
		onShow: function() {
			// 保存回跳地址
			util.storageRedirectUrl('/pages/order/normal', Object.assign(this.redirectParams, this.form.extraParams))
			util.verifyLogin(true)
		}
	}
</script>
<style scoped>
	@import url("./normal.css");
</style>
