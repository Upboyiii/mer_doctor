<template>
	<view class="page">
		<doctor-nav-bar title="数据看板" />
		<view class="content">
			<view class="placeholder"><text>数据看板功能开发中...</text></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'WorkbenchBoard'
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #F5F6FA; }
.content { display: flex; justify-content: center; padding: 100rpx 0; }
.placeholder { color: #999; font-size: 28rpx; }
</style>
