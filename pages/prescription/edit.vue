<template>
	<view class="page">
		<doctor-nav-bar title="修改处方" />
		<view class="content">
			<view class="placeholder"><text>修改处方 页面开发中...</text></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PrescriptionEdit',
	data() { return {} },
	onLoad(options) { this.options = options }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #F5F6FA; }
.content { display: flex; justify-content: center; align-items: center; padding: 160rpx 0; }
.placeholder { color: #999; font-size: 28rpx; }
</style>
