<template>
	<view>
		<view class="uni-flex uni-column bgf round-edge ml10 mr10 mt10">
			<view class="uni-flex uni-row pd10 flex-middle f-16">
				<text class="mr10">团长姓名</text>
				<input v-model="guideshop.owner" class="width-surplus" />
				<uni-icons v-on:click="clearInput($event, 'owner')" v-show="guideshop.owner" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row bt pd10 flex-middle f-16">
				<text class="mr10">团长电话</text>
				<input v-model="guideshop.phone_mob" class="width-surplus" placeholder="手机号码" type="number" />
				<uni-icons v-on:click="clearInput($event, 'phone_mob')" v-show="guideshop.phone_mob" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
		</view>
		<view class="ml10 mr10 mt10">
			<view class="mt10 ml5 mb10 pt10"><text class="f-16 f-gray">门店地址/自提点</text></view>
			<view class="uni-flex uni-column bgf round-edge ">
				<view class="uni-flex uni-row bt pd10 flex-middle f-16">
					<text class="mr10">门店名称</text>
					<input v-model="guideshop.name" class="width-surplus" placeholder="小店名称" />
					<uni-icons v-on:click="clearInput($event, 'name')" v-show="guideshop.name" type="closeempty"
						class="ml10" color="gray"></uni-icons>
				</view>
				<view class="uni-flex uni-row bt pd10 flex-middle f-16">
					<text class="mr10">所在地区</text>
					<picker mode="multiSelector" @columnchange="columnchange" range-key="region_name"
						:value="multiIndex" :range="regions" class="width-surplus">{{selected}}</picker>
					<uni-icons type="arrowright"></uni-icons>
				</view>
				<view class="uni-flex uni-row bt pd10 flex-middle f-16">
					<text class="mr10">详细地址</text>
					<input v-model="guideshop.address" class="width-surplus" placeholder="街道门牌信息" />
					<uni-icons v-on:click="clearInput($event, 'address')" v-show="guideshop.address" type="closeempty"
						class="ml10" color="gray"></uni-icons>
				</view>
				<view v-on:click="location" class="uni-flex uni-row bt pd10 flex-middle width-between">
					<text class="mr10 f-16">地理坐标</text>
					<view class="uni-flex uni-row f-16 mr5">
						<text v-if="guideshop.latitude && guideshop.longitude"
							class="width-surplus f-c55">更改位置经纬度</text>
						<text v-else class="width-surplus f-c55">设置位置经纬度</text>
						<uni-icons type="arrowright"></uni-icons>
					</view>
				</view>
			</view>
			<view class="mt10 ml5 mb10 pt10"><text class="f-16 f-gray">店面门头照</text></view>
			<view class="round-edge bgf pt10 pb5">
				<view class="uni-flex uni-row">
					<view v-on:click="upload('banner')" class="ml10 mr10 edgeblue mt5 mb10">
						<view v-if="!guideshop.banner"
							class="uni-flex uni-column flex-middle flex-center pd10 mt10 mb10">
							<uni-icons type="plusempty" color="#0086B3" size="80" class="mt5"></uni-icons>
						</view>
						<view v-else class="image">
							<image :src="guideshop.banner+'?t='+random" mode="scaleToFill"></image>
						</view>
					</view>
					<text class="f-gray ml10 mr10 width-surplus">温馨提示：请上传清晰的店面门头照，能准确识别招牌，避免审核被拒</text>
				</view>
			</view>
		</view>
		<view class="pd10">
			<view v-on:click="submit" class="mybutton f-white f-16 mt10">保存提交</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './apply.js'
	export default {
		data() {
			return {
				action: '',
				guideshop: {},
				regions: [],
				multiIndex: [0, 0, 0],
				selected: '请选择',
				random: ''
			}
		},
		methods: {
			columnchange(e) {
				this.multiIndex[e.detail.column] = e.detail.value
				if (e.detail.column == 0) {
					this.multiIndex = [e.detail.value, 0, 0]
				} else if (e.detail.column == 1) {
					this.multiIndex[2] = 0
				}
				model.regions(this)
			},
			upload(field) {
				model.upload(this, field)
			},
			location() {
				model.location(this)
			},
			submit() {
				model.submit(this)
			},
			clearInput(e, field) {
				this.guideshop[field] = ''
			}
		},
		onLoad(options) {
			this.action = options.action
		},
		onShow() {
			util.verifyLogin(true, this.$mp.page.route)
			model.verifyApply(this)
		}
	}
</script>

<style scoped>
	.edgeblue {
		border: 2rpx #007BD3 dashed;
		background-color: #f3f8ff;
		border-radius: 20rpx;
		color: #0086B3;
		width: 160rpx;
		height: 160rpx;
	}

	.edgeblue>view {
		line-height: 60rpx;
	}
	
	.edgeblue .image,
	.edgeblue image {
		border-radius: 20rpx;
		display: block;
		width: 160rpx;
		height: 160rpx;
	}

	.mybutton {
		border-radius: 20rpx;
	}
</style>
