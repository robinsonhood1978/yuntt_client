<template>
	<view>
		<view class="uni-flex uni-row bgf pd10 width-between flex-middle">
			<view v-on:click="upload('portrait')" class="uni-flex uni-row width-surplus portait">
				<image v-if="visitor.portrait" :src="visitor.portrait+'?t='+random" mode="scaleToFill"></image>
				<image v-else src="@/static/images/default_user_portrait.gif" mode="scaleToFill"></image>
				<view class="uni-flex uni-column f-gray ml10 mt5 f-14">
					<view>点此设置用户头像</view>
					<text>用户名：{{visitor.username}}</text>
				</view>
			</view>
			<uni-icons type="arrowright"></uni-icons>
		</view>
		<navigator url="/pages/setting/profile?field=nickname" hover-class="none" class="uni-flex width-between bgf pd10 bt f-15">
			<text>修改昵称</text>
			<view class="uni-flex uni-row">
				<view class="f-15">{{visitor.nickname}}</view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</navigator>
		<navigator url="/pages/setting/profile?field=password" hover-class="none" class="uni-flex width-between bgf pd10 bt f-15">
			<text>修改密码</text>
			<uni-icons type="arrowright"></uni-icons>
		</navigator>
		<navigator url="/pages/address/list" hover-class="none" class="uni-flex width-between bgf pd10 bt f-15">
			<text>收货地址</text>
			<view class="uni-flex uni-row">
				<view class="f-15"></view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</navigator>
		<navigator url="/pages/setting/phone" hover-class="none" class="uni-flex width-between bgf pd10 bt mt10 f-15">
			<text>手机号码</text>
			<view class="uni-flex uni-row">
				<view class="f-15">{{visitor.phone_mob}}</view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</navigator>
		<navigator url="/pages/setting/profile?field=email" hover-class="none" class="uni-flex width-between bgf pd10 bt f-15">
			<text>电子邮箱</text>
			<view class="uni-flex uni-row">
				<view class="f-15">{{visitor.email}}</view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</navigator>
		<navigator url="/pages/setting/profile?field=im_qq" hover-class="none" class="uni-flex width-between bgf pd10 bt f-15">
			<text>QQ</text>
			<view class="uni-flex uni-row">
				<view class="f-15">{{visitor.im_qq||''}}</view>
				<view class="uni-flex uni-row">
					<view class="f-15"></view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
		</navigator>
		<navigator url="/pages/setting/profile?field=birthday" hover-class="none" class="uni-flex width-between bgf pd10 mt10 f-15">
			<text>生日</text>
			<view class="uni-flex uni-row">
				<view class="f-15">{{visitor.birthday||''}}</view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</navigator>
		<view v-on:click="gender" class="uni-flex width-between bgf pd10 bt f-15">
			<text>性别</text>
			<view class="uni-flex uni-row">
				<view class="f-15">{{visitor.gender == 1 ? '男' : (visitor.gender == 2 ? '女' : '保密')}}</view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</view>
		<view  v-on:click="cache" class="uni-flex width-between bgf pd10 mt10 f-15">
			<text>清理缓存</text>
			<view class="uni-flex uni-row">
				<view class="f-15"></view>
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</view>
		<view v-on:click="logout" class="uni-center bgf pd10 mt10 f-15">退出当前账户</view>
	</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './index.js'
	export default {
		data() {
			return {
				random: '',
				visitor: {},
				genders: ['女', '男', '保密']
			}
		},
		methods: {
			upload(field) {
				model.upload(this, field)
			},
			gender() {
				let that = this
				uni.showActionSheet({
					itemList: that.genders,
					success(res) {
						model.profile(that, 'gender', 2 - res.tapIndex)
					}
				})
			},
			logout() {
				model.logout(this)
			},
			cache() {
				model.cache(this)
			}
		},
		onShow() {
			this.random = new Date().getTime()
			if (util.verifyLogin(true, this.$mp.page.route)) {
				model.user(this)
			}
		}
	}
</script>
<style scoped>
	.portait image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
</style>
