<template>
	<view class="about-page">
		<doctor-nav-bar title="关于我们" />

		<view class="content">
			<view class="logo-shading">
				<image class="logo-img" :src="siteLogoUrl" mode="aspectFit" />
			</view>
			<text class="app-name">医生端</text>
			<text class="version-text">版本 {{ versionName }}</text>
			<text class="copyright">本平台仅用于医生服务与管理</text>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'MineAbout',
	computed: {
		...mapGetters(['siteLogoUrl']),
		versionName() {
			// #ifdef APP-PLUS
			return plus.runtime.version || '1.0.0';
			// #endif
			// #ifndef APP-PLUS
			return '1.0.0';
			// #endif
		}
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
$bg: #f7f8fa;
$text: #333;
$text2: #666;
$text3: #999;

.about-page {
	min-height: 100vh;
	background: $bg;
}

.content {
	padding: 48rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.logo-shading {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-bottom: 24rpx;

	.logo-img {
		height: 180rpx;
		width: 480rpx;
		max-width: 100%;
	}
}

.app-name {
	font-size: 34rpx;
	font-weight: 600;
	color: $text;
	margin-bottom: 12rpx;
}

.version-text {
	font-size: 26rpx;
	color: $text2;
	margin-bottom: 48rpx;
}

.copyright {
	font-size: 24rpx;
	color: $text3;
	text-align: center;
	line-height: 1.6;
}
</style>
