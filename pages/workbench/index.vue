<template>
	<view class="workbench">
		<!-- 顶部渐变区 -->
		<view class="top-gradient">
			<view class="top-bar">
				<view class="logo-area">
					<image class="logo-img" src="/static/images/logo.png" mode="aspectFit"></image>
				</view>
				<view class="msg-btn" @tap="toMessage">
					<image class="msg-icon" src="/static/images/icon-message.png" mode="aspectFit"></image>
				</view>
			</view>

			<view class="user-section">
				<image class="user-avatar" :src="doctorInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
				<view class="user-meta">
					<view class="name-row">
						<text class="user-phone">{{doctorInfo.phone || '医生'}}</text>
						<view class="cert-tag" :class="doctorInfo.certified ? 'ok' : 'warn'">
							<view class="dot"></view>
							<text>{{doctorInfo.certified ? '已认证' : '未认证'}}</text>
						</view>
						<view class="cert-tag warn">
							<view class="dot"></view>
							<text>未备案</text>
						</view>
					</view>
					<view class="sub-row">
						<view class="status-pill" :class="isOnline ? 'on' : 'off'" @tap="toggleStatus">
							<text>{{isOnline ? '接单中' : '休息中'}}</text>
						</view>
						<text class="welcome">欢迎使用医生端</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 双功能卡片 -->
		<view class="feature-cards">
			<view class="feature-card card-left" @tap="toPage('/pages/prescription/create')">
				<image class="card-icon" src="/static/images/icon-prescription.png" mode="aspectFit"></image>
				<view class="card-text">
					<text class="card-title">在线开方</text>
					<text class="card-sub">快速开方</text>
				</view>
			</view>
			<view class="feature-card card-right" @tap="toPage('/pages/patient/index')">
				<image class="card-icon" src="/static/images/icon-patient-manage.png" mode="aspectFit"></image>
				<view class="card-text">
					<text class="card-title">患者管理</text>
					<text class="card-sub">{{patientCount}}人</text>
				</view>
			</view>
		</view>

		<!-- 公告栏 -->
		<view class="announcement-bar" @tap="toPage('/pages/workbench/announcement')">
			<image class="announce-icon" src="/static/images/icon-announce.png" mode="aspectFit"></image>
			<text class="announce-label">公告：</text>
			<text class="announce-text">{{announcement || '暂无公告'}}</text>
		</view>

		<!-- 统计区 -->
		<view class="stats-card">
			<view class="stat-item" v-for="(s, i) in statList" :key="i" @tap="s.tap && s.tap()">
				<text class="stat-num">{{s.value}}</text>
				<text class="stat-label">{{s.label}}</text>
			</view>
		</view>

		<!-- 功能网格 -->
		<view class="func-grid">
			<view class="grid-item" v-for="(item, i) in gridItems" :key="i" @tap="toPage(item.url)">
				<view class="grid-icon-wrap">
					<image class="grid-icon" :src="item.icon" mode="aspectFit"></image>
				</view>
				<text class="grid-label">{{item.label}}</text>
			</view>
		</view>

		<!-- 专属顾问浮窗（暂时关闭）
		<view class="consultant-float" @tap="toConsultant">
			<image class="consultant-avatar" src="/static/images/icon-consultant.png" mode="aspectFit"></image>
			<text class="consultant-text">专属顾问</text>
		</view>
		-->
	</view>
</template>

<script>
export default {
	name: 'WorkbenchIndex',
	data() {
		return {
			isOnline: true,
			doctorInfo: {},
			patientCount: 0,
			announcement: '关于劳务个税代扣代缴相关事宜调整的通知',
			stats: { pending: 0, reply: 0, video: 0, prescription: 0 },
			gridItems: [
				{ icon: '/static/images/icon-create-patient.png', label: '创建患者', url: '/pages/patient/create' },
				{ icon: '/static/images/icon-invite-patient.png', label: '邀请患者', url: '/pages/patient/invite' },
				{ icon: '/static/images/icon-history-rx.png', label: '历史处方', url: '/pages/prescription/history' },
				{ icon: '/static/images/icon-inquiry-form.png', label: '问诊单', url: '/pages/mine/inquiry-form' },
				{ icon: '/static/images/icon-service-setting.png', label: '服务设置', url: '/pages/user/index' },
				{ icon: '/static/images/icon-announce-setting.png', label: '公告设置', url: '/pages/workbench/announcement' },
				{ icon: '/static/images/icon-card.png', label: '名片', url: '/pages/mine/card' },
				{ icon: '/static/images/icon-assistant.png', label: '医师助手', url: '/pages/mine/assistant' }
			]
		}
	},
	computed: {
		statList() {
			return [
				{ value: this.stats.pending, label: '待接诊', tap: () => this.toConsultation() },
				{ value: this.stats.reply, label: '待回复', tap: () => this.toConsultation() },
				{ value: this.stats.video, label: '待视频', tap: () => this.toConsultation() },
				{ value: this.stats.prescription, label: '待修改处方', tap: () => this.toPage('/pages/prescription/edit') }
			]
		}
	},
	onLoad() { this.loadData() },
	onPullDownRefresh() { this.loadData(() => uni.stopPullDownRefresh()) },
	methods: {
		loadData(cb) { cb && cb() },
		toggleStatus() {
			this.isOnline = !this.isOnline
			uni.showToast({ title: this.isOnline ? '已切换为接单中' : '已切换为休息中', icon: 'none' })
		},
		toPage(url) { uni.navigateTo({ url }) },
		toMessage() { uni.navigateTo({ url: '/pages/services/message' }) },
		toConsultation() { uni.switchTab({ url: '/pages/consultation/index' }) },
		toConsultant() { uni.showToast({ title: '专属顾问功能即将上线', icon: 'none' }) }
	}
}
</script>

<style lang="scss" scoped>
$primary: #56C2B8;
$primary-soft: rgba(86, 194, 184, 0.08);
$text: #333;
$text2: #666;
$text3: #999;
$bg: #F5F5F5;

.workbench {
	min-height: 100vh;
	background: $bg;
	padding-bottom: 30rpx;
}

.top-gradient {
	background: linear-gradient(180deg, #EDF8F6 0%, #F0FAF8 40%, $bg 100%);
	padding-bottom: 10rpx;
}

.top-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 70rpx 30rpx 10rpx;

	.logo-img { height: 56rpx; width: 200rpx; }

	.msg-btn {
		width: 56rpx; height: 56rpx;
		display: flex; align-items: center; justify-content: center;
		.msg-icon { width: 44rpx; height: 44rpx; }
	}
}

.user-section {
	display: flex;
	align-items: center;
	padding: 16rpx 30rpx 20rpx;

	.user-avatar {
		width: 88rpx; height: 88rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		background: #e8e8e8;
	}

	.user-meta { flex: 1; }

	.name-row {
		display: flex; align-items: center; flex-wrap: wrap; gap: 10rpx;
		.user-phone { font-size: 34rpx; font-weight: 700; color: $text; }
	}

	.cert-tag {
		display: inline-flex; align-items: center;
		font-size: 20rpx; padding: 2rpx 12rpx; border-radius: 20rpx;
		.dot { width: 10rpx; height: 10rpx; border-radius: 50%; margin-right: 6rpx; }
		&.ok   { color: $primary; background: $primary-soft; .dot { background: $primary; } }
		&.warn { color: #FAAD14; background: rgba(250, 173, 20, 0.08); .dot { background: #FAAD14; } }
	}

	.sub-row { display: flex; align-items: center; margin-top: 10rpx; }

	.status-pill {
		font-size: 20rpx; color: #fff; padding: 4rpx 16rpx;
		border-radius: 20rpx; margin-right: 12rpx;
		&.on  { background: $primary; }
		&.off { background: #bfbfbf; }
	}

	.welcome { font-size: 24rpx; color: $text3; }
}

.feature-cards {
	display: flex; gap: 20rpx; padding: 10rpx 30rpx 0;

	.feature-card {
		flex: 1; border-radius: 20rpx; padding: 30rpx 24rpx;
		display: flex; align-items: center;

		.card-icon { width: 56rpx; height: 56rpx; margin-right: 14rpx; }
		.card-title { display: block; font-size: 30rpx; font-weight: 600; color: #fff; }
		.card-sub   { display: block; font-size: 22rpx; color: rgba(255,255,255,0.75); margin-top: 4rpx; }
		&.card-left  { background: linear-gradient(135deg, #7DD4C8, #56C2B8); }
		&.card-right { background: linear-gradient(135deg, #64C7BC, #44B4AA); }
	}
}

.announcement-bar {
	display: flex; align-items: center;
	background: #fff; margin: 20rpx 30rpx 0;
	border-radius: 14rpx; padding: 20rpx 24rpx;

	.announce-icon { width: 36rpx; height: 36rpx; margin-right: 10rpx; flex-shrink: 0; }
	.announce-label { font-size: 26rpx; color: $text; font-weight: 500; flex-shrink: 0; }
	.announce-text  { font-size: 26rpx; color: $text2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
}

.stats-card {
	display: flex; background: #fff;
	margin: 20rpx 30rpx; border-radius: 14rpx; padding: 28rpx 0;

	.stat-item {
		flex: 1; display: flex; flex-direction: column; align-items: center;
		border-right: 1rpx solid #F0F0F0;
		&:last-child { border-right: none; }
		.stat-num   { font-size: 42rpx; font-weight: 700; color: $text; }
		.stat-label { font-size: 22rpx; color: $text3; margin-top: 8rpx; }
	}
}

.func-grid {
	display: grid; grid-template-columns: repeat(4, 1fr);
	background: #fff; margin: 0 30rpx;
	border-radius: 14rpx; padding: 30rpx 10rpx; row-gap: 30rpx;

	.grid-item {
		display: flex; flex-direction: column; align-items: center;

		.grid-icon-wrap {
			width: 88rpx; height: 88rpx; border-radius: 20rpx;
			background: $primary-soft;
			display: flex; align-items: center; justify-content: center;
			margin-bottom: 12rpx;
		}

		.grid-icon { width: 48rpx; height: 48rpx; }
		.grid-label { font-size: 24rpx; color: $text2; }
	}
}

.consultant-float {
	position: fixed; right: 20rpx; bottom: 200rpx;
	display: flex; flex-direction: column; align-items: center; z-index: 999;

	.consultant-avatar {
		width: 80rpx; height: 80rpx; border-radius: 50%;
		box-shadow: 0 6rpx 20rpx rgba(86,194,184,0.35);
	}

	.consultant-text {
		font-size: 18rpx; color: #fff; background: $primary;
		padding: 4rpx 12rpx; border-radius: 0 0 12rpx 12rpx; margin-top: -4rpx;
	}
}
</style>
