<template>
	<view class="page">
		<doctor-nav-bar title="评价管理" />
		<view class="content">
			<view class="placeholder"><text>评价管理 页面开发中...</text></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'MineEvaluation',
	data() { return {} },
	onLoad(options) { this.options = options }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #F5F6FA; }
.content { display: flex; justify-content: center; align-items: center; padding: 160rpx 0; }
.placeholder { color: #999; font-size: 28rpx; }
</style>
