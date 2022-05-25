<script>
	import util from 'common/util.js'
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); // 锁定屏幕方向
			// #endif
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* uni全局CSS */
	@import url('@/common/uni.css');
	/* #endif*/

	/* 阿里巴巴矢量图 */
	@import url("@/static/iconfont/iconfont.css");

	/* 自定义全局CSS */
	@import url("@/common/main.css");

	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
</style>
