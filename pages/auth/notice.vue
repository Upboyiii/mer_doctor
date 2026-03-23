<template>
	<view class="notice-page">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @tap="$back">
				<text class="iconfont icon-ic_leftarrow"></text>
			</view>
			<text class="nav-title">资质须知</text>
		</view>

		<!-- 顶部Banner -->
		<view class="banner">
			<view class="banner-left">
				<text class="banner-title">在线完成</text>
				<text class="banner-title">医生身份认证</text>
				<view class="banner-checks">
					<view class="check-item" v-for="item in checkItems" :key="item">
						<text class="check-icon">✓</text>
						<text class="check-text">{{item}}</text>
					</view>
				</view>
			</view>
			<image class="banner-img" src="/static/images/icon-cert-doc.png" mode="aspectFit"></image>
		</view>

		<!-- 准备材料 -->
		<view class="prepare-header">
			<text>认证前请准备以下材料</text>
		</view>

		<view class="materials-card">
			<view class="material-item" v-for="(m, i) in materials" :key="i">
				<view class="material-icon-wrap">
					<image class="material-icon" :src="m.icon" mode="aspectFit"></image>
				</view>
				<view class="material-info">
					<text class="material-title">{{m.title}}</text>
					<text class="material-desc">{{m.desc}}</text>
				</view>
			</view>
		</view>

		<!-- 说明文字 -->
		<view class="tips-wrap">
			<text class="tips-text">根据国家卫健委相关规定，医师在开展互联网诊疗活动及开具电子处方时，需进行资质认证并上传以下证件。平台将保护您的隐私安全。</text>
			<text class="tips-text mt20">平台将会在 1~3 个工作日完成审核，请耐心等待，如需帮助请联系客服：<text class="tips-phone">400-021-2018</text></text>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-btn-wrap">
			<view class="bottom-btn" @tap="goCert">已准备，去认证</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'AuthNotice',
	data() {
		return {
			checkItems: ['实名校验', '基础信息', '上传证件'],
			materials: [
				{
					icon: '/static/images/icon-cert-avatar.png',
					title: '01.头像',
					desc: '免冠证件照'
				},
				{
					icon: '/static/images/icon-cert-idcard.png',
					title: '02.身份证',
					desc: '正反面'
				},
				{
					icon: '/static/images/icon-cert-license.png',
					title: '03.执业证、资格证、职称证',
					desc: '执业证和资格证必填，职称证可上传工牌等证明'
				}
			]
		};
	},
	methods: {
		$back() { uni.navigateBack(); },
		goCert() {
			uni.navigateTo({ url: '/pages/auth/qualification' });
		}
	}
};
</script>

<style scoped lang="scss">
$primary: #56C2B8;

.notice-page {
	min-height: 100vh;
	background: #F0F7F8;
	padding-bottom: 160rpx;
}

.nav-bar {
	display: flex;
	align-items: center;
	padding: 88rpx 30rpx 20rpx;
	background: transparent;
	position: relative;

	.back-btn {
		padding: 10rpx 20rpx 10rpx 0;
		font-size: 36rpx;
		color: #333;
	}

	.nav-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 32rpx;
		font-weight: 600;
		color: #111;
	}
}

.banner {
	margin: 16rpx 24rpx 0;
	background: linear-gradient(135deg, #E1F4F2 0%, #C8EAE7 100%);
	border-radius: 20rpx;
	padding: 36rpx 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 200rpx;

	.banner-left { flex: 1; }

	.banner-title {
		display: block;
		font-size: 36rpx;
		font-weight: 800;
		color: #1D6E6A;
		line-height: 1.5;
	}

	.banner-checks { margin-top: 16rpx; }

	.check-item {
		display: flex;
		align-items: center;
		margin-bottom: 6rpx;

		.check-icon {
			font-size: 22rpx;
			color: $primary;
			margin-right: 8rpx;
		}

		.check-text {
			font-size: 24rpx;
			color: #3A8B87;
		}
	}

	.banner-img {
		width: 160rpx;
		height: 160rpx;
		margin-left: 16rpx;
	}
}

.prepare-header {
	margin: 28rpx 24rpx 0;
	background: $primary;
	border-radius: 12rpx;
	padding: 22rpx 28rpx;
	text {
		font-size: 28rpx;
		font-weight: 600;
		color: #fff;
	}
}

.materials-card {
	margin: 0 24rpx;
	background: #fff;
	border-radius: 0 0 16rpx 16rpx;
	padding: 8rpx 0;
}

.material-item {
	display: flex;
	align-items: flex-start;
	padding: 28rpx 28rpx;
	border-bottom: 1rpx solid #F5F5F5;

	&:last-child { border-bottom: none; }

	.material-icon-wrap {
		width: 72rpx;
		height: 72rpx;
		background: rgba(86, 194, 184, 0.1);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.material-icon { width: 40rpx; height: 40rpx; }

	.material-info {
		flex: 1;
		padding-top: 4rpx;

		.material-title {
			display: block;
			font-size: 28rpx;
			font-weight: 600;
			color: #222;
			margin-bottom: 8rpx;
		}

		.material-desc {
			display: block;
			font-size: 24rpx;
			color: #999;
			line-height: 1.6;
		}
	}
}

.tips-wrap {
	margin: 24rpx 24rpx 0;
	padding: 0 4rpx;

	.tips-text {
		display: block;
		font-size: 22rpx;
		color: #999;
		line-height: 1.8;

		&.mt20 { margin-top: 16rpx; }
	}

	.tips-phone { color: $primary; }
}

.bottom-btn-wrap {
	position: fixed;
	bottom: 0; left: 0; right: 0;
	padding: 20rpx 40rpx;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #F0F7F8;

	.bottom-btn {
		width: 100%;
		height: 96rpx;
		background: $primary;
		border-radius: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
