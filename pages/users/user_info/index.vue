<template>
	<view class="profile-page">
		<doctor-nav-bar title="个人介绍" />

		<!-- 头部卡片 -->
		<view class="header-card">
			<view class="avatar-wrap">
				<image class="avatar" :src="info.picture || '/static/images/f.png'" mode="aspectFill" />
			</view>
			<view class="header-info">
				<view class="name-row">
					<text class="name">{{ info.name || '未设置' }}</text>
					<text class="sex-tag" v-if="info.sex === 1">♂</text>
					<text class="sex-tag female" v-else-if="info.sex === 2">♀</text>
				</view>
				<view class="title-row" v-if="info.hospitalTitle || info.hospitalCareer">
					<text class="title-text">{{ info.hospitalTitle }}</text>
					<text class="divider" v-if="info.hospitalTitle && info.hospitalCareer">·</text>
					<text class="title-text">{{ info.hospitalCareer }}</text>
				</view>
				<view class="hospital-row" v-if="info.hospitalName">
					<text class="hospital-name">{{ info.hospitalName }}</text>
					<text class="hospital-level" v-if="info.hospitalLevel">{{ info.hospitalLevel }}</text>
				</view>
				<view class="dept-row" v-if="info.hospitalSub">
					<text class="dept-text">{{ info.hospitalSub }}</text>
				</view>
			</view>
		</view>

		<!-- 数据统计 -->
		<view class="stats-row">
			<view class="stat-item">
				<text class="stat-value">{{ info.score || '-' }}</text>
				<text class="stat-label">评分</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-value">{{ info.treatNum || 0 }}</text>
				<text class="stat-label">服务人数</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-value">{{ onlineText }}</text>
				<text class="stat-label">接诊状态</text>
			</view>
		</view>

		<!-- 擅长领域 -->
		<view class="section-card" v-if="info.hospitalDomain">
			<text class="section-title">擅长领域</text>
			<text class="section-content">{{ info.hospitalDomain }}</text>
		</view>

		<!-- 个人简介 -->
		<view class="section-card" v-if="info.selfInfo">
			<text class="section-title">个人简介</text>
			<text class="section-content">{{ info.selfInfo }}</text>
		</view>

		<!-- 基本信息 -->
		<view class="info-card">
			<text class="section-title">基本信息</text>
			<view class="info-row">
				<text class="info-label">手机号</text>
				<text class="info-value">{{ maskedPhone }}</text>
			</view>
			<view class="info-row" v-if="info.email">
				<text class="info-label">邮箱</text>
				<text class="info-value">{{ info.email }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">注册时间</text>
				<text class="info-value">{{ info.createTime || '-' }}</text>
			</view>
		</view>

		<!-- 底部空白 -->
		<view class="footer-spacer"></view>
	</view>
</template>

<script>
import { getDoctorInfo } from '@/api/doctor';

export default {
	name: 'DoctorProfile',
	data() {
		return {
			info: {}
		};
	},
	computed: {
		onlineText() {
			return this.info.onlineStatus === 1 ? '接诊中' : '离线';
		},
		maskedPhone() {
			const p = this.info.phone || '';
			if (p.length >= 11) {
				return p.slice(0, 3) + '****' + p.slice(7);
			}
			return p || '-';
		}
	},
	onLoad() {
		this.loadInfo();
	},
	onShow() {
		this.loadInfo();
	},
	methods: {
		loadInfo() {
			getDoctorInfo().then(res => {
				this.info = res.data || {};
			}).catch(() => {});
		}
	}
};
</script>

<style scoped lang="scss">
$primary: $theme-color;
$bg: #F5F6FA;
$text: #333;
$text2: #666;
$text3: #999;
$card: #fff;

.profile-page {
	min-height: 100vh;
	background: $bg;
}

.header-card {
	margin: 20rpx 24rpx 0;
	background: $card;
	border-radius: 20rpx;
	padding: 36rpx 32rpx;
	display: flex;
	align-items: flex-start;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.avatar-wrap {
	flex-shrink: 0;
	margin-right: 28rpx;

	.avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		background: #eee;
	}
}

.header-info {
	flex: 1;
	min-width: 0;
	padding-top: 4rpx;
}

.name-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;

	.name {
		font-size: 36rpx;
		font-weight: 600;
		color: $text;
		margin-right: 12rpx;
	}

	.sex-tag {
		font-size: 24rpx;
		color: #4A90D9;
		background: rgba(74, 144, 217, 0.1);
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		&.female {
			color: #E96B8A;
			background: rgba(233, 107, 138, 0.1);
		}
	}
}

.title-row {
	display: flex;
	align-items: center;
	margin-bottom: 6rpx;

	.title-text {
		font-size: 26rpx;
		color: $primary;
		font-weight: 500;
	}

	.divider {
		margin: 0 8rpx;
		color: #ccc;
		font-size: 22rpx;
	}
}

.hospital-row {
	display: flex;
	align-items: center;
	margin-bottom: 4rpx;

	.hospital-name {
		font-size: 26rpx;
		color: $text2;
		margin-right: 10rpx;
	}

	.hospital-level {
		font-size: 20rpx;
		color: $primary;
		background: rgba(86, 194, 184, 0.1);
		padding: 2rpx 10rpx;
		border-radius: 6rpx;
	}
}

.dept-row {
	.dept-text {
		font-size: 24rpx;
		color: $text3;
	}
}

.stats-row {
	margin: 20rpx 24rpx 0;
	background: $card;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;

	.stat-value {
		font-size: 34rpx;
		font-weight: 600;
		color: $text;
		margin-bottom: 6rpx;
	}

	.stat-label {
		font-size: 22rpx;
		color: $text3;
	}
}

.stat-divider {
	width: 1rpx;
	height: 56rpx;
	background: #EAEEF2;
}

.section-card {
	margin: 20rpx 24rpx 0;
	background: $card;
	border-radius: 16rpx;
	padding: 28rpx 32rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.section-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: $text;
	margin-bottom: 16rpx;
}

.section-content {
	display: block;
	font-size: 28rpx;
	color: $text2;
	line-height: 1.7;
}

.info-card {
	margin: 20rpx 24rpx 0;
	background: $card;
	border-radius: 16rpx;
	padding: 28rpx 32rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 0;
	border-bottom: 1rpx solid #F5F5F5;

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 28rpx;
	color: $text3;
	flex-shrink: 0;
}

.info-value {
	font-size: 28rpx;
	color: $text;
	text-align: right;
}

.footer-spacer {
	height: 60rpx;
}
</style>
