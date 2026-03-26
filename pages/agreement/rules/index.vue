<template>
	<view class="agreement-page">
		<doctor-nav-bar title="隐私协议" />
		<view class="content">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			content: ''
		};
	},
	onLoad() {
		this.getAgreement();
	},
	methods: {
		getAgreement() {
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
