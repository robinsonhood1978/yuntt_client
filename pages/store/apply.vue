<template>
	<view>
		<view class="applybg relative">
			<text class="edge absolute"></text>
			<view class="relative mt10 pt10 ml10 pl10 mr10 pr10">
				<view v-if="step == 1" class="uni-flex uni-column l-h20">
					<text class="uni-bold f-18 f-white mt10 pt10">请选择主体类型</text>
					<text class="f-white pt10">认证后无法修改，请选择符合要求的主体类型</text>
				</view>
				<view v-else class="uni-flex uni-column l-h20">
					<text class="uni-bold f-18 f-white mt10 pt10">填写经营者及店铺信息</text>
					<text class="f-white pt10">请确保填写的信息真实有效，平台将对信息进行审核</text>
				</view>
			</view>
		</view>
		<view v-if="step == 1">
			<view class="pd10 relative store-type fixtop">
				<view v-on:click="apply('company')" class="uni-flex uni-row round-edge bgf flex-middle pd10">
					<view class="iconfont iconqiye"></view>
					<view class="uni-flex uni-row width-between pd10 flex-middle ml10">
						<view class="uni-flex uni-column">
							<text class="f-15 uni-bold">企业开店</text>
							<text class="f-gray">需提供营业执照及法人身份证</text>
						</view>
						<uni-icons type="arrowright" size="40"></uni-icons>
					</view>
				</view>
				<view v-on:click="apply('personal')" class="uni-flex uni-row round-edge bgf flex-middle pd10 mt10">
					<view class="iconfont iconmoban"></view>
					<view class="uni-flex uni-row width-between pd10 flex-middle ml10">
						<view class="uni-flex uni-column">
							<text class="f-15 uni-bold">个人开店</text>
							<text class="f-gray">需提供本人身份证资料</text>
						</view>
						<uni-icons type="arrowright" size="40"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="pd10 relative fixtop">
				<view class="round-edge bgf">
					<view class="pd10 f-15 uni-bold"><text>店铺信息</text></view>
					<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt">
						<text>店铺名称</text>
						<input v-model="store.store_name" type="text" class="pl10 pr10 width-surplus" />
					</view>
					<view v-on:click="showPopup($event, 'sgrade')"
						class="uni-flex uni-row ml10 mr10 pt10 pb10 bt width-between">
						<text>店铺类型</text>
						<view class="pl10">
							<text>{{store.grade_name}}</text>
							<uni-icons type="arrowright"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<view v-show="store.stype == 'company'">
				<view class="pl10 pr10">
					<view class="round-edge bgf">
						<view class="pd10 f-15 uni-bold"><text>经营者信息</text></view>
						<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt">
							<text>企业名称</text>
							<input v-model="store.owner_name" type="text" class="pl10 pr10 width-surplus" />
						</view>
						<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt">
							<text>联系电话</text>
							<input v-model="store.tel" type="digit" class="pl10 pr10 width-surplus" />
						</view>
					</view>
				</view>
				<view class="pd10">
					<view class="round-edge bgf pb10">
						<view class="pd10 f-15 uni-bold"><text>营业证件信息</text></view>
						<view v-on:click="upload('business_license')" class="ml10 mr10 edgeblue mb10">
							<view v-if="!store.business_license"
								class="uni-flex uni-column flex-middle flex-center pd10 mt10 mb10">
								<uni-icons type="plusempty" color="#0086B3" size="60"></uni-icons>
								<text>企业营业执照</text>
							</view>
							<image v-else :src="store.business_license+'?t='+random" mode="widthFix"></image>
						</view>
						<view v-on:click="upload('identity_front')" class="ml10 mr10 edgeblue mb10">
							<view v-if="!store.identity_front"
								class="uni-flex uni-column flex-middle flex-center pd10 mt10 mb10">
								<uni-icons type="plusempty" color="#0086B3" size="60"></uni-icons>
								<text>法人身份证正面</text>
							</view>
							<image v-else :src="store.identity_front+'?t='+random" mode="widthFix"></image>
						</view>
						<view v-on:click="upload('identity_back')" class="ml10 mr10 edgeblue mb10">
							<view v-if="!store.identity_back"
								class="uni-flex uni-column flex-middle flex-center pd10 mt10 mb10">
								<uni-icons type="plusempty" color="#0086B3" size="60"></uni-icons>
								<text>法人身份证反面</text>
							</view>
							<image v-else :src="store.identity_back+'?t='+random" mode="widthFix"></image>
						</view>
						<view class="f-gray ml10">温馨提示：请上传清晰的证件图片，避免审核退回</view>
					</view>
				</view>
			</view>

			<view v-show="store.stype != 'company'">
				<view class="pl10 pr10">
					<view class="round-edge bgf">
						<view class="pd10 f-15 uni-bold"><text>经营者信息</text></view>
						<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt">
							<text>真实姓名</text>
							<input v-model="store.owner_name" type="text" class="pl10 pr10 width-surplus" />
						</view>
						<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt">
							<text>手机号码</text>
							<input v-model="store.tel" type="digit" class="pl10 pr10 width-surplus" />
						</view>
						<view class="uni-flex uni-row ml10 mr10 pt10 pb10 bt">
							<text>身份证号</text>
							<input v-model="store.identity_card" type="text" class="pl10 pr10 width-surplus" />
						</view>
					</view>
				</view>
				<view class="pd10">
					<view class="round-edge bgf pb10">
						<view class="pd10 f-15 uni-bold">
							<text v-if="store.stype == 'company'">营业证件信息</text>
							<text v-else>身份证件信息</text>
						</view>
						<view v-on:click="upload('identity_front')" class="ml10 mr10 edgeblue mb10">
							<view v-if="!store.identity_front"
								class="uni-flex uni-column flex-middle flex-center pd10 mt10 mb10">
								<uni-icons type="plusempty" color="#0086B3" size="60"></uni-icons>
								<text>本人身份证正面</text>
							</view>
							<image v-else :src="store.identity_front+'?t='+random" mode="widthFix"></image>
						</view>
						<view v-on:click="upload('identity_back')" class="ml10 mr10 edgeblue mb10">
							<view v-if="!store.identity_back"
								class="uni-flex uni-column flex-middle flex-center pd10 mt10 mb10">
								<uni-icons type="plusempty" color="#0086B3" size="60"></uni-icons>
								<text>本人身份证反面</text>
							</view>
							<image v-else :src="store.identity_back+'?t='+random" mode="widthFix"></image>
						</view>
						<view class="f-gray ml10">温馨提示：请上传清晰的证件图片，避免审核被拒</view>
					</view>
				</view>
			</view>
			
			<!--店铺等级弹窗-->
			<uni-popup ref="sgrade" type="bottom" class="relative" style="z-index: 100;">
				<my-popup-sgrade :grades="grades" :selected="store.sgrade" @close="close" @confirm="confirm"></my-popup-sgrade>
			</uni-popup>

			<view class="pl10 pr10 pb10">
				<view v-on:click="submit" class="mybutton f-white f-15">确认提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './apply.js'
	export default {
		data() {
			return {
				step: 1,
				mode:'',
				store: {
					stype: 'personal', // company
					business_license: '',
					identity_front: '',
					identity_back: '',
					identity_card: '',
					store_name: '',
					owner_name: '',
					tel: '',
					sgrade: 0,
					grade_name: ''
				},
				grades:[],
				random: ''
			}
		},
		methods: {
			showPopup: function(e, popup) {
				return this.$refs[popup].open()
			},
			closePopup: function(e, popup) {
				return this.$refs[popup].close()
			},
			close(done) {
				done()
			},
			confirm(done, grade) {
				this.store.grade_name = grade.grade_name
				this.store.sgrade = grade.grade_id
				done()
			},
			apply: function(stype) {
				this.step = 2
				this.store.stype = stype
			},
			sgrade: function() {
				model.changeGrade(this)
			},
			upload: function(field) {
				model.upload(this, field)
			},
			submit: function() {
				model.submit(this)
			}
		},
		onLoad: function(options) {
			this.mode = options.mode
			model.grades(this)
		},
		onShow() {
			if (util.verifySeller(true, false)) {
				uni.switchTab({
					url: '/pages/user/index'
				})
			} else {
				// 不是卖家，或店铺正在审核中
				model.verifyApply(this)
			}
		}
	}
</script>
<style scoped>
	@import url("./apply.css");
</style>
