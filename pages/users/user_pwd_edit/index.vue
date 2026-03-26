<template>
	<view class="pwd-page">
		<doctor-nav-bar title="修改密码" />

		<view class="form-wrap">
			<view class="form-card">
				<!-- 手机号 -->
				<view class="form-item">
					<text class="form-label">手机号</text>
					<text class="form-value phone">{{ userInfo.phone }}</text>
				</view>

				<!-- 新密码 -->
				<view class="form-item">
					<text class="form-label">新密码</text>
					<input
						class="form-input"
						type="password"
						placeholder="请输入新密码"
						placeholder-class="placeholder"
						name="password"
						v-model="password"
						maxlength="18"
					/>
				</view>

				<!-- 确认密码 -->
				<view class="form-item">
					<text class="form-label">确认密码</text>
					<input
						class="form-input"
						type="password"
						placeholder="请再次输入新密码"
						placeholder-class="placeholder"
						name="qr_password"
						v-model="qr_password"
						maxlength="18"
					/>
				</view>

				<!-- 验证码 -->
				<view class="form-item form-item-last">
					<text class="form-label">验证码</text>
					<view class="code-row">
						<input
							class="form-input flex1"
							type="number"
							placeholder="请输入验证码"
							placeholder-class="placeholder"
							name="captcha"
							v-model="captcha"
							maxlength="6"
						/>
						<view class="code-btn" :class="{ disabled: disabled }" @tap="code">
							<text>{{ text }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 页面提示 -->
			<view class="tips-wrap">
				<text class="tips-text">· 密码必须以字母开头，长度6~18位</text>
				<text class="tips-text">· 只能包含字母、数字和下划线</text>
				<text class="tips-text">· 验证码将发送至当前绑定的手机号</text>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-btn" @tap="editPwd">
				<text>确认修改</text>
			</view>
		</view>

	</view>
</template>

<script>
import sendVerifyCode from '@/mixins/SendVerifyCode';
import { resetPasswordApi, getUpdatePasswordCode } from '@/api/doctor';
import { toLogin } from '@/libs/login.js';
import { mapGetters } from 'vuex';
import { Debounce } from '@/utils/validate.js';

export default {
	mixins: [sendVerifyCode],
	data() {
		return {
			password: '',
			captcha: '',
			qr_password: ''
		};
	},
	computed: mapGetters(['isLogin', 'userInfo']),
	onLoad() {
		if (!this.isLogin) {
			toLogin();
		}
	},
	methods: {
		code: Debounce(function() {
			if (!this.userInfo.phone) {
				return this.$util.Tips({ title: '手机号不存在，无法发送验证码' });
			}
			if (this.password && this.qr_password && this.password !== this.qr_password) {
				return this.$util.Tips({ title: '两次输入的密码不一致' });
			}
			getUpdatePasswordCode().then(res => {
				this.$util.Tips({ title: '验证码已发送' });
				this.sendCode();
			}).catch(err => {
				this.$util.Tips({ title: err });
			});
		}),

		editPwd: Debounce(function() {
			if (!this.password) {
				return this.$util.Tips({ title: '请输入新密码' });
			}
			if (!/^[a-zA-Z]\w{5,17}$/.test(this.password)) {
				return this.$util.Tips({ title: '密码格式不正确，请按页面提示设置' });
			}
			if (!this.qr_password) {
				return this.$util.Tips({ title: '请确认新密码' });
			}
			if (this.qr_password !== this.password) {
				return this.$util.Tips({ title: '两次输入的密码不一致' });
			}
			if (!this.captcha) {
				return this.$util.Tips({ title: '请输入验证码' });
			}

			uni.showLoading({ title: '提交中...', mask: true });
			resetPasswordApi({
				captcha: this.captcha,
				password: this.password
			}).then(res => {
				uni.hideLoading();
				this.$util.Tips({ title: '修改成功' }, { tab: 3, url: 1 });
			}).catch(err => {
				uni.hideLoading();
				this.$util.Tips({ title: err });
			});
		})
	}
};
</script>

<style lang="scss" scoped>
$primary: $theme-color;

.pwd-page {
	min-height: 100vh;
	background: #F5F6FA;
}

.form-wrap {
	padding: 24rpx;
}

.form-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 0 32rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-item {
	display: flex;
	align-items: center;
	height: 104rpx;
	border-bottom: 1rpx solid #F5F5F5;

	&.form-item-last {
		border-bottom: none;
	}
}

.form-label {
	width: 160rpx;
	flex-shrink: 0;
	font-size: 28rpx;
	color: #333;
}

.form-value {
	flex: 1;
	font-size: 28rpx;
	color: #333;

	&.phone {
		color: #666;
		letter-spacing: 2rpx;
	}
}

.form-input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	color: #333;
}

.placeholder {
	color: #C0C4CC;
}

.code-row {
	flex: 1;
	display: flex;
	align-items: center;
	height: 100%;

	.flex1 {
		flex: 1;
		min-width: 0;
	}
}

.code-btn {
	flex-shrink: 0;
	padding: 0 4rpx;
	margin-left: 16rpx;

	text {
		font-size: 26rpx;
		color: $primary;
	}

	&.disabled text {
		color: #C0C4CC;
	}
}

.tips-wrap {
	margin-top: 24rpx;
	padding: 0 8rpx;
}

.tips-text {
	display: block;
	font-size: 24rpx;
	color: #999;
	line-height: 1.9;
}

.submit-btn {
	margin-top: 60rpx;
	height: 88rpx;
	background: $primary;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	text {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
	}
}
</style>
