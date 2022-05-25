<template>
	<view class="fixed-top">
		<view v-if="gcategory.list.length > 0" class="uni-flex uni-row pt10" :style="style">
			<scroll-view scroll-x="false" scroll-y="true" class="pt5 scroller">
				<view v-on:click="change($event, 0)"
					:class="['uni-center pl10 pr10 uni-ellipsis f-15 item', gallery.selected ? '' : 'f-red uni-bold selected']">
					热门推荐
				</view>
				<view v-for="(item, index) in gcategory.list" :key="index">
					<view v-on:click="change($event, item)"
						:class="['uni-center pl10 pr10 uni-ellipsis f-15 item', item.cate_id == gallery.selected ? 'f-red uni-bold selected' : '']">
						{{item.cate_name}}
					</view>
				</view>
				<view class="pb10 pt10"></view>
			</scroll-view>
			<scroll-view scroll-x="false" scroll-y="true" class="uni-flex uni-column width-surplus" :style="style">
				<view v-if="gallery.list.length > 0" style="min-width: 510rpx;">
					<view class="gallery pl10 pr10 pt10 round-edge ml10 mr10 bgf">
						<view v-for="(item,index) in gallery.list" :key="index" class="uni-flex uni-row item">
							<navigator :url="'/pages/community/goods/index?id='+item.goods_id"
								class="image mb5 relative" hover-class="none">
								<text v-show="item.promotion && item.promotion.type == 'limitbuy'"
									class="absolute uni-center f-white skill f-12 uni-bold">秒杀</text>
								<image :src="item.default_image" mode="widthFix"></image>
							</navigator>
							<view :class="[index == 0 ? '' : 'bt', 'rb mb5 width-surplus']">
								<view class="line-clamp-2 ml10 mr10 l-h20 uni-bold">{{item.goods_name}}</view>
								<view class="f-13 f-gray mr10 ml10 mt5">附近有{{item.sales||0}}人已买</view>
								<view class="uni-flex uni-row mt5 pb5 flex-middle width-between">
									<view class="width-surplus ml10">
										<view class="del f-gray f-14 l-h20">
											<text v-if="item.promotion">{{item.price|currency}}</text>
											<text v-else-if="item.mkprice > 0">{{item.mkprice|currency}}</text>
										</view>
										<view class="f-red f-14 l-h20">
											<text v-if="item.promotion">{{item.promotion.price|currency}}</text>
											<text v-else>{{item.price|currency}}</text>
										</view>
									</view>
									<view v-if="item.spec_qty == 0" class="uni-flex uni-row flex-middle"
										style="justify-content: flex-end;">
										<uni-icons v-if="cart.quantity[item.goods_id] > 0"
											v-on:click="changeQty(item, 'minus')" type="minus-filled" size="50"
											color="#cccccc"></uni-icons>
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
					<view class="bottom-placeholder"></view>
				</view>
			</scroll-view>
			<view class="uni-flex uni-column">
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
			</view>
		</view>
		<view v-else class="iconfont iconmeiyoudingdan-01 f-gray flex-center empty-icons"></view>

		<!-- 选择规格弹窗-->
		<uni-popup ref="specs" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-specs @close="close" @confirm="confirm" :item="popup"></my-popup-specs>
		</uni-popup>

		<!-- 购物车商品弹窗-->
		<uni-popup ref="cart" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-shopcart :data="cart" @confirm="submit" @change="changeQty"></my-popup-shopcart>
		</uni-popup>

	</view>
</template>


<script>
	import model from './list.js'
	import shopcart from '@/common/guideshopcart.js'
	export default {
		data() {
			return {
				gcategory: {
					list: []
				},
				gallery: {
					selected: 0,
					list: [],
					page: 1
				},
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
				style: ''
			}
		},
		methods: {
			change: function(e, item) {
				this.gallery.selected = item.cate_id
				model.gallery(this, 1)
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
			model.showLoadMore(this)
		},
		onLoad: function(options) {
			if(options.id) {
				this.gallery.selected = options.id
			}
			model.gcategory(this)
			model.gallery(this, 1)
		},
		onShow: function() {
			shopcart.buildQty(this)
			this.style = "height:" + (uni.getSystemInfoSync().screenHeight - 120) + "px"
		},
		onReachBottom() {
			model.gallery(this, this.gallery.page + 1)
		},
	}
</script>
<style scoped>
	@import url("./list.css");
</style>
