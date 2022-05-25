<template>
	<view>
		<view class="uni-flex uni-column bgf">
			<!--修改昵称-->
			<view v-if="field == 'nickname'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">用户昵称</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="visitor.nickname" />
				<uni-icons v-show="visitor.nickname" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>
			
			<!--修改密码-->
			<view v-if="field == 'password'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">登录密码</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="visitor.password" />
				<uni-icons v-show="visitor.password" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>
			
			<!--修改邮箱-->
			<view v-if="field == 'email'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">您的邮箱</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="visitor.email" />
				<uni-icons v-show="visitor.email" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>
			
			<!--修改QQ-->
			<view v-if="field == 'im_qq'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">您的QQ</text>
				<input focus="true" class="f-15 pt5 pb5 width-surplus" v-model="visitor.im_qq" />
				<uni-icons v-show="visitor.im_qq" v-on:click="clearInput" type="closeempty" class="mr10" color="gray" size="40"></uni-icons>
			</view>

			<!--修改生日-->
			<view v-if="field == 'birthday'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">您的生日</text>
				<picker @change="birthdayChange" value="visitor.birthday" mode="date" class="f-15 pt5 pb5 width-surplus">{{visitor.birthday||''}}</picker>
			</view>
			
			<!--修改性别-->
			<view v-if="field == 'gander'" class="uni-flex uni-row ml10 mr10 pt10 pb10 flex-middle">
				<text class="f-15 mr10 pt5 pb5 f-gray">用户性别</text>
				<picker @change="birthdayChange" value="visitor.gander" mode="date" class="f-15 pt5 pb5 width-surplus">{{visitor.birthday||''}}</picker>
			</view>
		</view>
		<view class="f-white uni-center f-15 ml10 mr10 pt10">
			<view v-on:click="submit" class="mybutton mt10 f-15 uni-bold">保存</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './profile.js'
	export default {
		data() {
			return {
				field: '',
				visitor: {}
			}
		},
		methods: {
			clearInput: function() {
				this.visitor[this.field] = ''
			},
			birthdayChange: function(e) {
				this.visitor.birthday = e.target.value
			},
			submit: function() {
				model.profile(this)
			}
		},
		onLoad: function(options) {
			this.field = options.field
		},
		onShow: function() {
			if(util.verifyLogin(true, this.$mp.page.route)) {
				model.user(this)
			}
		}
	}
</script>
<style scoped>
</style>
