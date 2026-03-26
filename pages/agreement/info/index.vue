<template>
	<view class="agreement-page">
		<doctor-nav-bar title="协议详情" />
		<view class="content">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			from: '',
			content: ''
		};
	},
	onLoad(option) {
		this.from = option.from || '';
		this.getInfo();
	},
	methods: {
		getInfo() {
			// TODO: 对接协议接口
		}
	}
};
</script>

<style scoped lang="scss">
.agreement-page {
	min-height: 100vh;
	background: #fff;
}
.content {
	padding: 30rpx;
}
</style>
