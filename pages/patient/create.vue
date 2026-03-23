<template>
	<view class="page">
		<view class="nav-bar">
			<view class="back-btn" @tap="$back"><text class="back-icon">‹</text></view>
			<text class="nav-title">创建患者</text>
		</view>
		<view class="content">
			<view class="placeholder"><text>创建患者 页面开发中...</text></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PatientCreate',
	data() { return {} },
	onLoad(options) { this.options = options },
	methods: { $back() { uni.navigateBack() } }
}
<\/script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #F5F6FA; }
.nav-bar {
	display: flex; align-items: center;
	padding: 88rpx 30rpx 20rpx; background: #fff;
	border-bottom: 1rpx solid #F0F0F0;
	.back-btn { padding: 10rpx 20rpx 10rpx 0; }
	.back-icon { font-size: 48rpx; color: #333; }
	.nav-title { font-size: 32rpx; font-weight: 600; color: #111; }
}
.content { display: flex; justify-content: center; align-items: center; padding: 160rpx 0; }
.placeholder { color: #999; font-size: 28rpx; }
</style>
