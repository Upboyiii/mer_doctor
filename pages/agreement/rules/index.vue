<template>
	<view class="agreement-page">
		<view class="nav-bar">
			<view class="back" @tap="goBack">
				<text class="iconfont icon-ic_leftarrow"></text>
			</view>
			<text class="title">隐私协议</text>
		</view>
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
		goBack() {
			uni.navigateBack();
		},
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
.nav-bar {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding: 0 30rpx;
	background: #fff;
	position: relative;
	.back {
		position: absolute;
		left: 30rpx;
		font-size: 36rpx;
	}
	.title {
		flex: 1;
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
	}
}
.content {
	padding: 30rpx;
}
</style>
