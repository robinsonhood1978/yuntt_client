<template>
	<view>
		<view :class="['uni-flex uni-row pl5 pr5 relative flex-middle search-box', options.boxstyle]"
			:style="{'--bgcolor': options.bgcolor || '#fc2b34', '--boxcolor': options.boxcolor || '#ffffff', '--txtcolor': options.txtcolor || '#999999', '--space': options.space +'px', '--position': options.position}">
			<uni-icons v-if="options.iconhide == 0" v-on:click="scan" type="scan" :color="options.iconcolor||'#ffffff'"
				class="uni-bold mr5 ml10" size="44"></uni-icons>
			<navigator hover-class="none" url="/pages/search/index"
				class="uni-flex uni-row bgf ml5 mr5 width-surplus f-gray input">
				<uni-icons type="search" size="38" class="ml10 icon" :color="options.txtcolor||'#999999'">
				</uni-icons>
				<text class="pl5 pr5 f-15 line-clamp-1">{{options.keyword}}</text>
			</navigator>
			<uni-icons v-if="options.iconhide == 0" v-on:click="chat" type="chat" :color="options.iconcolor||'#ffffff'"
				class="uni-bold mr10 ml5" size="44"></uni-icons>
		</view>
	</view>
</template>

<script>
	import server from '@/common/server.js'
	import util from '@/common/util.js'
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
				swiper: {
					current: 0,
					list: [],
					dotsStyles: {},
					mode: "default"
				}
			}
		},
		methods: {
			scan() {
				// #ifdef APP-PLUS || MP
				return util.scanCode()
				// #endif

				if (util.isWechat()) {
					var wx = require('jweixin-module')

					// 必须获取本地网址进行签名，要不签名会不正确
					let url = location.href.split('#')[0]
					server.request('weixin/signature', {
						url: url
					}, function(res) {
						if (res.code == 0 && res.data) {
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: res.data.appId, // 必填，公众号的唯一标识
								timestamp: res.data.timestamp, // 必填，生成签名的时间戳
								nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
								signature: res.data.signature, // 必填，签名
								jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
							});
							wx.ready(function() {
								wx.scanQRCode({
									needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
									scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
									success: function(res) {
										let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
										console.log(res)
										if (result.path) {
											util.redirectUrl(result.path)
										} else if (result.result) {
											uni.showModal({
												title: '扫码结果',
												content: result.result
											})
										}
									}
								});
							})
						}
					})
				} else {
					uni.showModal({
						content: '仅支持在APP、微信中扫码',
						showCancel: false
					})
				}
			},
			chat() {
				uni.showModal({
					title: '提示',
					content: '客服联系QQ: 561223725',
					showCancel: false
				})
			}
		}
	}
</script>
<style>
	.search-box {
		border-radius: 0;
		background-color: var(--bgcolor);
		padding-top: var(--space);
		padding-bottom: var(--space);
	}

	.search-box .input {
		height: 64rpx;
		line-height: 64rpx;
		overflow: hidden;
		background-color: var(--boxcolor);
		color: var(--txtcolor);
		justify-content: var(--position);
	}

	.search-box.round .input {
		border-radius: 80rpx;
	}
</style>
