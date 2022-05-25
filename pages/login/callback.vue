<template>
	<view></view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './login.js'
	export default {
		data() {
			return {
				logintype: '',
				redirect: ''
			}
		},
		/**
		 * 该页面适用于在H5端的微信登录、支付宝登录的回调地址
		 * 为了方便，通过code的变量名为区别是支付宝登录，还是微信登录
		 * @param {Object} options
		 */
		onLoad: function(options) {
			if (options.code) {
				this.logintype = 'weixin'
			} else if (options.auth_code) {
				this.logintype = 'alipay'
			}
			if (this.logintype) {
				model.login(Object.assign(options, {
					logintype: this.logintype
				}))
			}
			if (options.redirect) {
				this.redirect = options.redirect
			}
		},
		onShow() {
			uni.showToast({
				title: '登录中...',
				icon: 'loading',
				duration: 200000,
				complete() {
					setTimeout(function() {
						if (this.redirect) {
							util.redirectUrl(this.redirect)
						} else {
							uni.redirectTo({
								url: '/pages/login/login'
							})
						}
					}, 200000)
				}
			})
		}
	}
</script>
