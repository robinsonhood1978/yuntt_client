<template>
	<view>
		<view class="textbox"
			:style="{'--bgcolor': options.bgcolor, '--txtcolor': options.txtcolor||'#333333',  '--fontsize': options.fontsize + 'px', '--txtbold': options.txtbold == 1 ? 'bold' : 'normal', '--space': options.space + 'px'}">
			<view class="uni-center pd10"><text class="inline-block f-14">{{options.label}}</text></view>
		</view>
	</view>
</template>

<script>
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
			return {}
		}
	}
</script>
<style>
	.textbox {
		background-color: var(--bgcolor);
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-top: var(--space);
		padding-bottom: var(--space);
	}

	.textbox text {
		color: var(--txtcolor);
		font-weight: var(--txtbold);
		font-size: var(--fontsize);
	}
</style>
