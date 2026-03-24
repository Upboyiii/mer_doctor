<template>
	<view class="settings-page" :data-theme="theme">
		<!-- #ifdef MP -->
		<view class="cart_nav" :style='"height:"+navH+"rpx;"'>
			<nav-bar iconColor='#fff' ref="navBarRef" navTitle="设置" :isShowBack="true"></nav-bar>
		</view>
		<!-- #endif -->
		<view class="settings-content">
			<view class="settings-group">
				<view class="settings-item" @tap="goPage('/pages/users/user_info/index')">
					<text class="item-label">个人资料</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
				<view class="settings-item" @tap="goPage('/pages/users/user_setting/index')">
					<text class="item-label">个人信息</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
				<view class="settings-item" @tap="goPage('/pages/users/user_pwd_edit/index')">
					<text class="item-label">修改密码</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
				<view class="settings-item" @tap="goPage('/pages/users/user_phone/index')">
					<text class="item-label">修改手机号</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
			</view>
			<view class="settings-group">
				<view class="settings-item" @tap="goPage('/pages/agreement/rules/index')">
					<text class="item-label">隐私协议</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
				<view class="settings-item" @tap="goPage('/pages/mine/feedback')">
					<text class="item-label">意见反馈</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="settings-item" @tap="goPage('/pages/users/app_update/app_update')">
					<text class="item-label">检查更新</text>
					<text class="iconfont icon-ic_rightarrow item-arrow"></text>
				</view>
				<!-- #endif -->
			</view>
			<view class="logout-btn" v-if="isLogin" @tap="handleLogout">
				<text>退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
import Cache from '@/utils/cache';
import navBar from '@/components/navBar';
import { mapGetters } from 'vuex';
import animationType from '@/utils/animationType.js';
import { logoutApi } from '@/api/doctor';

const app = getApp();
export default {
	components: { navBar },
	computed: mapGetters(['isLogin', 'globalData']),
	data() {
		return {
			theme: app.globalData.theme,
			navH: ''
		};
	},
	onLoad() {
		// #ifdef MP
		this.navH = this.globalData.navHeight;
		// #endif
		// #ifndef MP
		this.navH = 96;
		// #endif
	},
	methods: {
		goPage(url) {
			uni.navigateTo({
				animationType: animationType.type,
				animationDuration: animationType.duration,
				url
			});
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						logoutApi().catch(() => {}).finally(() => {
							this.$store.commit('LOGOUT');
							uni.reLaunch({
								url: '/pages/users/login/index'
							});
						});
					}
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.settings-page {
	min-height: 100vh;
	background: #f5f5f5;
}
.settings-content {
	padding: 20rpx 24rpx;
}
.settings-group {
	background: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}
.settings-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
	&:last-child {
		border-bottom: none;
	}
}
.item-label {
	font-size: 30rpx;
	color: #333;
}
.item-arrow {
	font-size: 24rpx;
	color: #ccc;
}
.logout-btn {
	margin-top: 60rpx;
	background: #fff;
	border-radius: 16rpx;
	text-align: center;
	padding: 28rpx 0;
	text {
		font-size: 30rpx;
		color: #E93323;
	}
}
</style>
