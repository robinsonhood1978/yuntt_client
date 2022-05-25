<template>
	<view>
		<view class="round-edge bgf ml10 mr10 mt10 mb10 pl10 pt5 pr10 pb10 form">
			<view class="uni-flex uni-row pd10 flex-middle f-16">
				<label>收 件 人</label>
				<input v-model.trim="address.consignee" class="width-surplus" maxlength="30" placeholder="收件人名字" />
				<uni-icons v-on:click="clearInput($event, 'consignee')" v-show="address.consignee" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row bt pd10 flex-middle f-16">
				<label>联系方式</label>
				<input v-model.number="address.phone_mob" class="width-surplus" maxlength="11" type="number"
					placeholder="11位手机号" />
				<uni-icons v-on:click="clearInput($event, 'phone_mob')" v-show="address.phone_mob" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view v-if="addr_type==0" class="uni-flex uni-row bt pd10 flex-middle f-16">
				<label>选择地区</label>
				<picker mode="multiSelector" @columnchange="columnchange" range-key="region_name" :value="multiIndex"
					:range="regions" class="width-surplus">{{selected}}</picker>
			</view>
			<view class="uni-flex uni-row bt pd10 flex-middle f-16">
				<label>详细地址</label>
				<input v-if="addr_type==0" v-model="address.address" class="width-surplus" placeholder="街道门牌信息" />
				<str-autocomplete v-else :stringList="stringList" :importvalue="title" @select="selectOne"  @change="textChange" highlightColor="#FF0000" v-model="title"></str-autocomplete>
				<uni-icons v-on:click="clearInput($event, 'address')" v-show="address.address" type="closeempty"
					class="ml10" color="gray"></uni-icons>
			</view>
			<view class="uni-flex uni-row bt pd10 flex-middle f-16 width-between">
				<label>默认地址</label>
				<switch v-model="address.defaddr" v-on:change="change" :checked="address.defaddr == 1"
					color="#fc2b34" />
			</view>
			<view class="uni-center f-white mybutton ml10 mr10 mb10 f-16 uni-bold" v-on:click="save"
				style="margin-top:60rpx">保存</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import model from './build.js'
	import server from '@/common/server.js'
	import strAutocomplete from '@/components/str-autocomplete/str-autocomplete.vue'
	export default {
		components: {
			strAutocomplete
		},
		data() {
			return {
				addr_type: 0,
				addr_id: 0,
				address: {},
				regions: [],
				multiIndex: [0, 0, 0],
				selected: '请选择',
				title: '',
				stringList: []
			}
		},
		watch: {
			address(val) {
				// console.log('val:', val)
				// console.log('addr:', this.address)
				this.title = this.address.address;
			}
		},
		methods: {
			selectOne(opt) {
				this.title = opt
				this.address.address = opt
				console.log(opt)
			},
			textChange(opt) {
				// console.log("textchange:" + opt)
				this.stringList = []
				if(opt.length>5){
					server.request('article/autocomplete', {'value': opt}, function(resp) {
						if (resp.code == 0) {
							//this.stringList = JSON.parse(resp.data)
							// console.log('Robin server autocomplete data:', resp.data)
							uni.setStorageSync('auto_complete', resp.data)
						}
					})
					if(uni.getStorageSync('auto_complete')){
						this.stringList = JSON.parse(uni.getStorageSync('auto_complete')) || []
						// console.log('auto:', this.stringList)
					}
				}
			},
			changeTitle(text) {
				this.title = text
				this.address.address = text
			},
			columnchange: function(e) {
				this.multiIndex[e.detail.column] = e.detail.value
				if (e.detail.column == 0) {
					this.multiIndex = [e.detail.value, 0, 0]
				} else if (e.detail.column == 1) {
					this.multiIndex[2] = 0
				}
				model.regions(this, 0)
			},
			change: function(e) {
				this.address.defaddr = e.detail.value ? true : false
			},
			save: function(e) {
				model.save(this)
			},
			clearInput: function(e, field) {
				console.log('address:', this.address)
				if(field=='address'){
					console.log('yes')
					this.title = ''
					this.address.address = ''
					this.stringList = []
				} else {
					console.log('no')
					this.address[field] = ''
				}
				
			}
		},
		onLoad: function(options) {
			uni.removeStorageSync('auto_complete')
			let address_type = uni.getStorageSync('address_type') || false
			if (!address_type) {
				server.request('article/currency', {}, function(res) {
					if (res.code == 0) {
						console.log('address_type:', res.data.address_type)
						uni.setStorageSync('address_type', res.data.address_type)
						address_type = res.data.address_type
					}
				})
			}
			if(address_type){
				this.addr_type = address_type
			}
			// 编辑模式
			if (options.id > 0) {
				console.log('options.id:', options.id)
				this.addr_id = options.id
				uni.setNavigationBarTitle({
					title: "编辑收货地址"
				})
				this.title = this.address.address
			}
			// 不需要回跳，移除缓存
			util.reomveStorage('redirect', options.redirect != 'yes')
			model.regions(this, this.addr_id)
		},
		onShow: function() {
			util.verifyLogin(true, false, true)
		}
	}
</script>
<style scoped>
	@import url("./build.css");
</style>
