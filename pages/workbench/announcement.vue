<template>
	<view class="page">
		<doctor-nav-bar :title="id ? '公告详情' : '公告列表'" />
		<view class="content">
			<view class="placeholder"><text>公告功能开发中...</text></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'WorkbenchAnnouncement',
	data() { return { id: '' } },
	onLoad(options) { this.id = options.id || '' }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #F5F6FA; }
.content { display: flex; justify-content: center; padding: 100rpx 0; }
.placeholder { color: #999; font-size: 28rpx; }
</style>
