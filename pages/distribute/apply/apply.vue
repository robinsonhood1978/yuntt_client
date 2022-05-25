<template>
	<view>
		<view v-if="!merchant.userid">
			<view class="pd10 mt10 uni-center">
				<text class="title">一键入驻分销商</text>
			</view>
			<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10 pl10 pr10">
				<view class="uni-flex uni-row pd10 flex-middle f-16">
					<text class="mr10 f-16">分销店名</text>
					<input v-model="merchant.name" class="width-surplus" placeholder="分销店名" />
					<uni-icons v-on:click="clearInput($event, 'name')" v-show="merchant.name"
						type="closeempty" class="ml10" color="gray"></uni-icons>
				</view>
				<view class="uni-flex uni-row bt pd10 flex-middle f-16">
					<text class="mr10 f-16">联系手机</text>
					<input v-model="merchant.phone_mob" class="width-surplus" placeholder="手机号码" type="number" />
					<uni-icons v-on:click="clearInput($event, 'phone_mob')" v-show="merchant.phone_mob"
						type="closeempty" class="ml10" color="gray"></uni-icons>
				</view>
			</view>
			<view class="pd10">
				<view v-on:click="submit" class="mybutton f-white f-16 mt10">立即入驻</view>
			</view>
		</view>
		<view class="mt10 ml10 mb10 pb10 rules">
			<view class="f-16 f-gray mb10">分销规则</view>
			<view class="mr10 pd10 round-edge bgf pt10 mb10">
				<view class="uni-flex uni-row flex-middle">
					<view class="mr10"><text class="iconfont iconshanghupiliangruzhu"></text></view>
					<view class="uni-flex uni-column">
						<view class="uni-bold f-16">入驻为分销商</view>
						<view class="f-gray l-h20 mb10">成为分销商，无需货源，无需发货，无需售后，轻松赚取销售佣金</view>
					</view>
				</view>
				<view class="uni-flex uni-row bt pt10 flex-middle">
					<view class="mr10"><text class="iconfont icontuandui"></text></view>
					<view class="uni-flex uni-column">
						<view class="uni-bold f-16">发展分销团队</view>
						<view class="f-gray l-h20 mb10">您发展的下级分销团队消费也有佣金，支持最多三级返佣</view>
					</view>
				</view>
				<view class="uni-flex uni-row bt pt10 flex-middle">
					<view class="mr10"><text class="iconfont iconjifen"></text></view>
					<view class="uni-flex uni-column">
						<view class="uni-bold f-16">直接赚佣金</view>
						<view class="f-gray l-h20 mb10">直接推广分销商品，由供货商统一发货，赚取一级佣金</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="merchant.userid" class="ml10 mr10">
			<view v-on:click="showPopup($event, 'share')" class="mybutton f-white f-16">
				您已是分销商，立即发展团队</view>
			<navigator url="/pages/distribute/goods/list" open-type="redirect" class="mybutton outside f-16 f-red mt10">
				或直接推广商品，赚取佣金</navigator>
		</view>

		<!-- 分享到弹窗-->
		<uni-popup ref="share" type="bottom" class="relative" style="z-index: 100;">
			<my-popup-share :body="share.body"></my-popup-share>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './apply.js'
	export default {
		data() {
			return {
				merchant: {
					userid: 0,
					name: '',
					phone_mob: ''
				},
				share: {
					body: {}
				}
			}
		},
		methods: {
			submit() {
				model.submit(this)
			},
			clearInput(e, field) {
				this.merchant[field] = ''
			},
			showPopup: function(e, popup) {
				if (popup == 'share') {
					this.share.body = model.shareBody(this)
				}
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			}
		},
		onLoad(options) {
			if(options.invite) {
				// 记录三级分销邀请码
				uni.setStorageSync('distributeInviteRegisterCode', options.invite)
			}
		},
		onShow() {
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.merchant(this)
			}
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
	.title {
		font-size: 54rpx;
	}

	.rules .iconfont {
		color: #ffc619;
		font-size: 90rpx;
	}

	.mybutton {
		border-radius: 20rpx;
	}
</style>
