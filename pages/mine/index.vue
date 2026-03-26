<template>
	<view class="mine-page">
		<!-- 资质认证弹窗 -->
		<cert-popup :show.sync="showCertPopup"></cert-popup>

		<!-- 状态切换确认弹窗 -->
		<view class="status-mask" v-if="showStatusSheet" @tap.self="showStatusSheet = false">
			<view class="status-action-wrap" @tap.stop>
				<view class="status-action-card">
					<text class="status-sheet-title">确认切换状态</text>
					<text class="status-sheet-desc">{{isOnline ? '切换后将暂停接收新的问诊订单' : '切换后将开始接收新的问诊订单'}}</text>
					<view class="status-btn-row">
						<view class="status-btn cancel" @tap="showStatusSheet = false"><text>取消</text></view>
						<view class="status-btn confirm" @tap="confirmToggleStatus"><text>{{isOnline ? '切换为休息中' : '切换为接单中'}}</text></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 联系客服：底部双块操作表（致电 / 取消） -->
		<view class="customer-mask" v-if="showCustomerSheet" @tap.self="closeCustomerSheet">
			<view class="customer-action-wrap" @tap.stop>
				<view class="customer-action-card" @tap="dialCustomer">
					<view class="customer-call-row">
						<text class="iconfont icon-ic_phone customer-call-icon"></text>
						<text class="customer-call-text">致电 400 021 2018</text>
					</view>
				</view>
				<view class="customer-action-card customer-cancel-card" @tap="closeCustomerSheet">
					<text class="customer-cancel-text">取消</text>
				</view>
			</view>
		</view>
		<!-- 顶部渐变区 -->
		<view class="user-header">
			<view class="msg-btn" @tap="toMessage">
				<image class="msg-icon" src="/static/images/icon-message.png" mode="aspectFit"></image>
			</view>

			<!-- <view class="mine-logo-shading">
				<image class="mine-logo-img" :src="siteLogoUrl" mode="aspectFit" />
			</view> -->

			<view class="user-row">
				<image class="user-avatar" :src="doctorInfo.picture || '/static/images/default-avatar.png'" mode="aspectFill"></image>
				<view class="user-meta">
					<view class="name-row">
						<text class="user-phone">{{doctorInfo.phone || '医生'}}</text>
						<view class="cert-tag" :class="doctorInfo.auditStatus === 1 ? 'ok' : 'warn'">
							<view class="dot"></view>
							<text>{{doctorInfo.auditStatus === 1 ? '已认证' : (doctorInfo.auditStatus === 2 ? '审核中' : '未认证')}}</text>
						</view>
						<view class="cert-tag" :class="doctorInfo.mchId ? 'ok' : 'warn'">
							<view class="dot"></view>
							<text>{{doctorInfo.mchId ? '已备案' : '未备案'}}</text>
						</view>
					</view>
					<view class="sub-row">
						<view class="status-pill" :class="isOnline ? 'on' : 'off'">
							<text>{{isOnline ? '接单中' : '休息中'}}</text>
						</view>
						<text class="welcome">欢迎使用医生端</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 结算卡片 -->
		<view class="settle-card">
			<view class="settle-top-row">
				<view class="settle-left">
					<text class="settle-title">当前可结算金额 (元)</text>
					<view class="eye-btn" @tap="toggleAmount">
						<image class="eye-icon" :src="showAmount ? '/static/images/icon-eye-open.png' : '/static/images/icon-eye-close.png'" mode="aspectFit"></image>
					</view>
				</view>
				<view class="apply-btn" @tap="toApplySettle">
					<text>去申请</text>
				</view>
			</view>
			<text class="settle-amount">{{showAmount ? settlementAmount : '*****'}}</text>
			<view class="settle-bottom-row">
				<view class="settle-info">
					<image class="info-icon" src="/static/images/icon-pending-settle.png" mode="aspectFit"></image>
					<text>{{showAmount ? pendingAmount : '*******'}}元待结算</text>
				</view>
				<view class="settle-line"></view>
				<view class="settle-info">
					<image class="info-icon" src="/static/images/icon-settling.png" mode="aspectFit"></image>
					<text>{{showAmount ? settlingAmount : '******'}}元结算中</text>
				</view>
			</view>
		</view>

		<!-- 我的服务 -->
		<view class="section">
			<text class="section-title">我的服务</text>
			<view class="service-grid">
				<view class="service-item" v-for="(s, i) in serviceItems" :key="i" @tap="toPage(s.url, s.skipCertCheck)">
					<view class="svc-icon-wrap">
						<image class="svc-icon" :src="s.icon" mode="aspectFit"></image>
					</view>
					<text class="svc-label">{{s.label}}</text>
				</view>
			</view>
		</view>

		<!-- 小助手 -->
		<view class="section">
			<text class="section-title">小助手</text>
			<view class="menu-card">
				<view class="menu-item" v-for="(m, i) in menuItems" :key="i" @tap="m.tap ? m.tap() : toPage(m.url, m.skipCertCheck)">
					<image class="menu-icon" :src="m.icon" mode="aspectFit"></image>
					<text class="menu-label">{{m.label}}</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 专属顾问浮窗 -->
		<!-- 专属顾问浮窗（暂时关闭）
		<view class="consultant-float" @tap="toConsultant">
			<image class="consultant-avatar" src="/static/images/icon-consultant.png" mode="aspectFit"></image>
			<text class="consultant-text">专属顾问</text>
		</view>
		-->
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import CertPopup from '@/components/certPopup/index.vue';
import { getDoctorInfo, switchOnlineStatus } from '@/api/doctor';
import { normalizeDoctorInfo } from '@/utils/siteLogo';

export default {
	name: 'MineIndex',
	components: { CertPopup },
	data() {
		return {
			isOnline: true,
			showCertPopup: false,
			showCustomerSheet: false,
			showStatusSheet: false,
			doctorInfo: {
				phone: '',
				picture: '',
				auditStatus: 0,   // 0未审核 1通过 2失败
				onlineStatus: 2,  // 1接诊中 2离线
				mchId: 0          // 门店ID，有值则已备案
			},
			showAmount: false,
			settlementAmount: '0.00',
			pendingAmount: '0.00',
			settlingAmount: '0.00',
			serviceItems: [
				{ icon: '/static/images/icon-service-setting.png', label: '服务设置', url: '/pages/user/index', skipCertCheck: true },
				{ icon: '/static/images/icon-evaluation.png', label: '患者评价', url: '/pages/mine/evaluation' },
				{ icon: '/static/images/icon-profile.png', label: '个人介绍', url: '/pages/users/user_info/index' },
				{ icon: '/static/images/icon-qualification.png', label: '资质认证', url: '/pages/auth/qualification', skipCertCheck: true }
			]
		}
	},
	computed: {
		...mapGetters(['siteLogoUrl']),
		menuItems() {
			return [
				{ icon: '/static/images/icon-online-status.png', label: '在线 / 离线设置', tap: () => this.toggleStatus() },
				{ icon: '/static/images/icon-assistant.png', label: '医师助手', url: '/pages/mine/assistant' },
				{ icon: '/static/images/icon-customer-service.png', label: '联系客服', tap: () => this.toCustomer() },
				{ icon: '/static/images/icon-feedback.png', label: '意见反馈', url: '/pages/mine/feedback', skipCertCheck: true },
				{ icon: '/static/images/icon-about.png', label: '关于我们', url: '/pages/mine/about', skipCertCheck: true },
				{ icon: '/static/images/icon-setting.png', label: '设置', url: '/pages/user/index', skipCertCheck: true }
			]
		}
	},
	onLoad() { this.loadData() },
	onPullDownRefresh() { this.loadData(() => uni.stopPullDownRefresh()) },
	methods: {
		loadData(cb) {
			getDoctorInfo().then(res => {
				const d = normalizeDoctorInfo(res.data || {});
				this.doctorInfo = {
					phone: d.phone || '',
					picture: d.picture || '',
					auditStatus: d.auditStatus || 0,
					onlineStatus: d.onlineStatus || 2,
					mchId: d.mchId || 0
				};
				// 在线状态同步
				this.isOnline = d.onlineStatus === 1;
			}).catch(() => {}).finally(() => {
				cb && cb();
			});
		},

		// 统一跳转入口，未认证时拦截并弹窗
		toPage(url, skipCertCheck) {
			if (!skipCertCheck && this.doctorInfo.auditStatus !== 1) {
				this.showCertPopup = true;
				return;
			}
			uni.navigateTo({ url });
		},

		toggleAmount() { this.showAmount = !this.showAmount },
		toggleStatus() {
			this.showStatusSheet = true;
		},
		confirmToggleStatus() {
			this.showStatusSheet = false;
			const newStatus = this.isOnline ? 2 : 1;
			switchOnlineStatus({ onlineStatus: newStatus }).then(() => {
				this.isOnline = newStatus === 1;
				uni.showToast({ title: this.isOnline ? '已切换为接单中' : '已切换为休息中', icon: 'none' });
			}).catch(err => {
				uni.showToast({ title: String(err) || '切换失败', icon: 'none' });
			});
		},
		toMessage() { uni.navigateTo({ url: '/pages/services/message' }) },
		toApplySettle() {
			if (this.doctorInfo.auditStatus !== 1) {
				this.showCertPopup = true;
				return;
			}
			uni.navigateTo({ url: '/pages/mine/fund' });
		},
		toCustomer() {
			this.showCustomerSheet = true;
		},
		closeCustomerSheet() {
			this.showCustomerSheet = false;
		},
		dialCustomer() {
			uni.makePhoneCall({
				phoneNumber: '4000212018',
				fail: () => {
					uni.showToast({ title: '无法拨打电话', icon: 'none' });
				}
			});
			this.closeCustomerSheet();
		},
		toConsultant() { uni.showToast({ title: '专属顾问功能即将上线', icon: 'none' }) }
	}
}
</script>

<style lang="scss" scoped>
$primary: $theme-color;
$primary-soft: rgba(86,194,184,0.08);
$text: #333;
$text2: #666;
$text3: #999;
$bg: #F5F5F5;

.mine-page {
	min-height: 100vh;
	background: $bg;
	padding-bottom: 40rpx;
}

.user-header {
	background: linear-gradient(180deg, #EDF8F6 0%, #E5F5F2 50%, $bg 100%);
	padding: 70rpx 30rpx 24rpx;
	position: relative;

	.msg-btn {
		position: absolute; right: 30rpx; top: 72rpx;
		width: 48rpx; height: 48rpx;
		display: flex; align-items: center; justify-content: center;
		.msg-icon { width: 44rpx; height: 44rpx; }
	}

	.mine-logo-shading {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-top: 4rpx;
		margin-bottom: 8rpx;
	}

	.mine-logo-img {
		height: 120rpx;
		width: 420rpx;
		max-width: 100%;
	}

	.user-row { display: flex; align-items: center; margin-top: 8rpx; }

	.user-avatar {
		width: 88rpx; height: 88rpx;
		border-radius: 50%; margin-right: 20rpx; background: #e8e8e8;
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
		&.warn { color: #FAAD14; background: rgba(250,173,20,0.08); .dot { background: #FAAD14; } }
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

.settle-card {
	background: linear-gradient(135deg, #6DD0C5, #44B4AA);
	margin: 0 30rpx; border-radius: 18rpx;
	padding: 28rpx 30rpx 24rpx; color: #fff;

	.settle-top-row { display: flex; justify-content: space-between; align-items: center; }
	.settle-left { display: flex; align-items: center; }
	.settle-title { font-size: 24rpx; opacity: 0.85; }
	.eye-btn { margin-left: 12rpx; .eye-icon { width: 32rpx; height: 32rpx; opacity: 0.8; } }
	.apply-btn { background: #fff; color: $primary; font-size: 26rpx; font-weight: 600; padding: 10rpx 30rpx; border-radius: 30rpx; }
	.settle-amount { font-size: 46rpx; font-weight: 700; margin: 10rpx 0; }

	.settle-bottom-row {
		display: flex; align-items: center;
		padding-top: 16rpx; border-top: 1rpx solid rgba(255,255,255,0.18);
	}

	.settle-info {
		display: flex; align-items: center; font-size: 22rpx; opacity: 0.85;
		.info-icon { width: 24rpx; height: 24rpx; margin-right: 8rpx; }
	}

	.settle-line { width: 1rpx; height: 26rpx; background: rgba(255,255,255,0.25); margin: 0 24rpx; }
}

.section {
	margin: 24rpx 30rpx 0;
	.section-title { display: block; font-size: 30rpx; font-weight: 600; color: $text; margin-bottom: 18rpx; }
}

.service-grid {
	display: grid; grid-template-columns: repeat(4, 1fr);
	background: #fff; border-radius: 14rpx; padding: 28rpx 0;

	.service-item {
		display: flex; flex-direction: column; align-items: center;

		.svc-icon-wrap {
			width: 76rpx; height: 76rpx; border-radius: 50%;
			background: $primary-soft;
			display: flex; align-items: center; justify-content: center;
			margin-bottom: 10rpx;
		}

		.svc-icon { width: 40rpx; height: 40rpx; }
		.svc-label { font-size: 24rpx; color: $text2; }
	}
}

.menu-card {
	background: #fff; border-radius: 14rpx; overflow: hidden;

	.menu-item {
		display: flex; align-items: center;
		padding: 28rpx 24rpx;
		border-bottom: 1rpx solid #F5F5F5;
		&:last-child { border-bottom: none; }

		.menu-icon { width: 40rpx; height: 40rpx; margin-right: 16rpx; }
		.menu-label { flex: 1; font-size: 28rpx; color: $text; }
		.menu-arrow { font-size: 30rpx; color: #ccc; }
	}
}

.consultant-float {
	position: fixed; right: 20rpx; bottom: 200rpx;
	display: flex; flex-direction: column; align-items: center; z-index: 999;

	.consultant-avatar {
		width: 80rpx; height: 80rpx; border-radius: 50%;
		box-shadow: 0 6rpx 20rpx rgba(86,194,184,0.3);
	}

	.consultant-text {
		font-size: 18rpx; color: #fff; background: $primary;
		padding: 4rpx 12rpx; border-radius: 0 0 12rpx 12rpx; margin-top: -4rpx;
	}
}

$action-blue: #007aff;

.customer-mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 10000;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.customer-action-wrap {
	padding: 0 16rpx calc(16rpx + env(safe-area-inset-bottom));
	animation: customer-sheet-in 0.28s ease-out;
}

@keyframes customer-sheet-in {
	from { transform: translateY(100%); opacity: 0.96; }
	to { transform: translateY(0); opacity: 1; }
}

.customer-action-card {
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
}
.customer-cancel-card {
	margin-top: 16rpx;
}

.customer-call-row {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 36rpx 24rpx;
}

.customer-call-icon {
	font-size: 40rpx;
	color: $action-blue;
	margin-right: 16rpx;
}

.customer-call-text {
	font-size: 34rpx;
	font-weight: 500;
	color: $action-blue;
	letter-spacing: 2rpx;
}

.customer-cancel-text {
	display: block;
	text-align: center;
	font-size: 34rpx;
	font-weight: 500;
	color: $action-blue;
	padding: 32rpx 0;
}

// 状态切换底部弹窗
.status-mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 10000;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.status-action-wrap {
	padding: 0 24rpx calc(24rpx + env(safe-area-inset-bottom));
	animation: status-sheet-in 0.28s ease-out;
}

@keyframes status-sheet-in {
	from { transform: translateY(100%); opacity: 0.96; }
	to   { transform: translateY(0);    opacity: 1; }
}

.status-action-card {
	background: #fff;
	border-radius: 24rpx;
	text-align: center;
	padding: 48rpx 40rpx 40rpx;
}

.status-sheet-title {
	display: block;
	font-size: 34rpx;
	font-weight: 600;
	color: #333;
}

.status-sheet-desc {
	display: block;
	font-size: 26rpx;
	color: #999;
	margin-top: 16rpx;
}

.status-btn-row {
	display: flex;
	gap: 24rpx;
	margin-top: 48rpx;
}

.status-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	text { font-size: 30rpx; font-weight: 500; }

	&.cancel {
		background: #F5F5F5;
		text { color: #666; }
	}

	&.confirm {
		background: $primary;
		text { color: #fff; }
	}
}
</style>
