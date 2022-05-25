<template>
	<view>
		<view class="uni-popup-share bgf top-round-edge">
			<view v-if="title" class="uni-share-title"><text class="uni-share-title-text">{{title}}</text></view>
			<view class="uni-share-content">
				<view class="uni-share-content-box">
					<view class="uni-share-content-item flex-center" v-for="(item,index) in list" :key="index">

						<!-- #ifdef MP-->
						<button v-if="item.name=='weixin'" class="uni-flex uni-column" open-type="share">
							<image class="uni-share-image" :src="item.icon" mode="heightFix"></image>
							<text class="uni-share-text">{{item.text}}</text>
						</button>
						<view v-else class="uni-flex uni-column" @click.stop="confirm(item,index)">
							<image class="uni-share-image" :src="item.icon" mode="heightFix"></image>
							<text class="uni-share-text">{{item.text}}</text>
						</view>
						<!--#endif-->

						<!-- #ifndef MP-->
						<view class="uni-flex uni-column" @click.stop="confirm(item,index)">
							<image class="uni-share-image" :src="item.icon" mode="heightFix"></image>
							<text class="uni-share-text">{{item.text}}</text>
						</view>
						<!--#endif-->

					</view>
				</view>
			</view>
			<view class="uni-share-button-box">
				<button class="uni-share-button" @click="close">取消</button>
			</view>
			<view class="bottom-placeholder"></view>
		</view>

		<uni-popup v-show="qrcode" ref="poster" type="bottom" class="relative poster" style="z-index: 100;">
			<view class="uni-flex uni-column flex-middle flex-center wraper" :style="style">
				<view class="image relative">
					<uni-icons v-on:click="close" type="close" color="#ffffff" size="60" class="absolute close">
					</uni-icons>
					<image :src="qrcode" mode="scaleToFill"></image>
				</view>
				<view v-on:click="save" class="mybutton f-white f-18 mt10 uni-bold">保存图片</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import server from '@/common/server.js'
	import util from '@/common/util.js'
	export default {
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: ''
			},
			body: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		inject: ['popup'],
		data() {
			return {
				list: [{
						text: '微信好友',
						icon: '/static/images/weixin.png',
						name: 'weixin',
						scene: 'WXSceneSession'
					},
					//在小程序里无法通过点击页面按钮分享到朋友圈，
					//只能分享到好友，需要分享到朋友圈只能通过点原生胶囊按钮
					// #ifndef MP
					{
						text: '微信朋友圈',
						icon: '/static/images/weixinpengyou.png',
						name: 'weixin',
						scene: 'WXSenceTimeline'
					},
					// #endif
					{
						text: '生成海报',
						icon: '/static/images/poster.png',
						name: 'poster'
					}
				],
				qrcode: '',
				style: 'height: 1200rpx'
			}
		},
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false
			this.style = "height:" + (uni.getSystemInfoSync().screenHeight + 500) + "rpx"
		},
		methods: {
			confirm(item, index) {

				// 生成海报
				if (item.name == 'poster') {
					return this.poster(this, this.body)
				} else {

					// #ifdef APP-PLUS
					return this.share(this.body, item)
					// #endif

					// #ifdef H5
					if (util.isWechat()) {
						return this.jsshare(this.body, item)
					} else {
						uni.showToast({
							title: '请在微信中分享',
							icon: 'none'
						})
					}
					// #endif
				}
			},
			close() {
				this.$refs.poster.close()
				this.popup.close()
			},
			/**
			 * 微信公众号中的JS-SDK微信分享
			 * @href https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
			 * @param {Object} body
			 * @param {Object} item
			 */
			jsshare(body, item) {
				let that = this
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
							jsApiList: ['updateAppMessageShareData','updateTimelineShareData']
						});
						wx.ready(function() { 
							// 分享给微信好友
							if (item.scene == 'WXSceneSession') {
								wx.updateAppMessageShareData({
									title: body.title, // 分享标题
									desc: body.desc, // 分享描述
									link: util.H5WEBURL + body.path,
									imgUrl: body.imageUrl, // 分享图标
									success: function(res) {
										uni.showModal({
											title: '分享内容获取成功',
											content: '请点击微信右上角•••符号进行分享',
											showCancel: false,
											success(res) {
												that.close()
											}
										})
									}
								})
							}
							// 分享给微信朋友圈
							else if (item.scene == 'WXSenceTimeline') {
								wx.updateTimelineShareData({
									title: body.title, // 分享标题
									//desc: body.desc, // 分享描述
									link: util.H5WEBURL + body.path,
									imgUrl: body.imageUrl, // 分享图标
									success: function() {
										uni.showModal({
											title: '分享内容获取成功',
											content: '请点击微信右上角•••符号进行分享',
											showCancel: false,
											success(res) {
												that.close()
											}
										})
									}
								})
							}
						})
					}
				})
			},
			/**
			 * APP中分享
			 * 默认分享为小程序卡片，如果没有配置小程序原始ID，则分享为图文（点击后进入H5页面）
			 * @param {Object} body
			 * @param {Object} item
			 */
			async share(body, item) {
				let that = this
				let wxalink = ''

				// 拉起小程序链接（分享到微信朋友圈用到）
				if (item.scene == 'WXSenceTimeline') {
					wxalink = await server.promise('weixin/mpurl', {
						page: body.path
					})
				}

				uni.share(Object.assign(body, {
					provider: item.name,
					scene: item.scene ? item.scene : '',
					type: item.scene == 'WXSenceTimeline' ? 0 : (util.CONFIG.wxid ? 5 : (util
						.H5WEBURL ?
						0 : 2)), // 分享类型 0 = 图文, 2 = 纯图片, 5=小程序
					href: item.scene == 'WXSenceTimeline' ? wxalink : util.H5WEBURL + body.path,
					miniProgram: (item.scene != 'WXSenceTimeline' && util.CONFIG.wxid) ? {
						id: util.CONFIG.wxid, // 小程序原始ID
						path: body.path,
						type: 0, // 0-正式版； 1-测试版； 2-体验版。 默认值为0
						webUrl: util.H5WEBURL + body.path // 兼容低版本的网页链接
					} : null,

					// 取消、返回也是走success的，好像是微信分享SDK防止用户恶意分享，取消了判断是否分享成功的识别了
					success(res) {},
					fail(err) {
						//console.log("fail:" + JSON.stringify(err))
					},
					complete() {
						that.popup.close()
					}
				}))
			},
			// 生成海报
			poster(that, body) {
				uni.showLoading({
					title: '请稍后...'
				})
				that.$refs.poster.open()
				server.request(body.poster.route, Object.assign({
					page: body.path
				}, body.poster.params ? body.poster.params : {}), function(res) {
					if (res.code == 0) {
						that.qrcode = res.data.poster + '?random=' + new Date().getTime()
					} else if (res.message) {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			// 保存图片到本地
			save() {
				let that = this

				// #ifdef H5
				this.h5save()
				// #endif

				// #ifdef APP-PLUS || MP
				uni.downloadFile({ //下载
					url: that.qrcode, //图片下载地址
					success: res => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({ //保存图片到系统相册。
								filePath: res.tempFilePath, //图片文件路径
								success: function() {
									uni.showToast({
										title: '图片保存成功',
										success() {
											that.close()
										}
									})
								},
								fail: function(e) {
									uni.showToast({
										title: '图片保存失败',
										icon: 'none',
									})
								}
							})
						}
					}
				})
				// #endif
			},
			h5save() {

				// 部分浏览器可能不支持长按保存，在此忽略
				uni.showModal({
					content: '请长按图片后，选择保存图片',
					showCancel: false
				})
			}
		}
	}
</script>
<style scoped>
	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
		padding: 30rpx 0 0 0;
	}

	.uni-share-title-text {
		font-size: 32rpx;
		color: #666;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding: 30rpx 10rpx 30rpx 10rpx;
	}

	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
	}

	.uni-share-content-item {
		width: 320rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 20rpx 10rpx 40rpx 10rpx;
		align-items: center;
	}

	.uni-share-content-item:active {
		background-color: #F1F1F1;
		border-radius: 20rpx;
	}

	.uni-share-content-item button,
	.uni-share-content-item button::after {
		background: none;
		border-radius: 0;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.uni-share-image {
		width: 120rpx;
		height: 120rpx;
		margin: 0 auto;
		-webkit-touch-callout: default;
	}

	.uni-share-text {
		margin-top: 30rpx;
		font-size: 30rpx;
		color: #3B4144;
	}

	.uni-share-button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		background-color: #f4f4f4;
	}

	.uni-share-button {
		flex: 1;
		color: #666;
		font-size: 34rpx;
		padding: 15rpx 0;
		border: 0;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.uni-share-button::after {
		border: 0;
	}

	.poster .wraper .image,
	.poster .wraper image {
		width: 500rpx;
		margin: 0 auto;
		padding: 0;
	}

	.poster .wraper image {
		height: 820rpx;
		border-radius: 30rpx;
		background: rgba(0, 0, 0, 0.7);
	}

	.poster .wraper .mybutton {
		width: 300rpx;
		padding: 10rpx 0;
	}

	.poster .wraper .close {
		left: 220rpx;
		bottom: -214rpx;
		opacity: 0.8;
	}
</style>
