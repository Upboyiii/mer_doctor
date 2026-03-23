<template>
	<view class="board-page">
		<view class="nav-bar">
			<view class="back-btn" @tap="$back">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">数据看板</text>
		</view>
		<view class="content">
			<view class="tip"><text>数据看板功能开发中...</text></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'WorkbenchBoard',
	methods: {
		$back() { uni.navigateBack() }
	}
}
</script>

<style lang="scss" scoped>
.board-page { min-height: 100vh; background: #F5F6FA; }
.nav-bar {
	display: flex; align-items: center;
	padding: 88rpx 30rpx 20rpx;
	background: #fff;
	.back-btn { padding: 10rpx 20rpx 10rpx 0; }
	.back-icon { font-size: 48rpx; color: #333; }
	.nav-title { font-size: 32rpx; font-weight: 600; color: #111; }
}
.content { display: flex; justify-content: center; padding: 100rpx 0; }
.tip { color: #999; font-size: 28rpx; }
</style>
