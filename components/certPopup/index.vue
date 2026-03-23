<template>
	<view class="cert-mask" v-if="show" @tap.self="close">
		<view class="cert-popup">
			<view class="cert-img-wrap">
				<image class="cert-img" src="/static/images/icon-cert-notice.png" mode="aspectFit"></image>
			</view>
			<text class="cert-title">您还未完成资质认证</text>
			<text class="cert-desc">认证成功后，您就可以进行患者管理与在线接诊和开具处方</text>
			<view class="cert-btn" @tap="goCert">去认证</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CertPopup',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		close() {
			this.$emit('update:show', false);
		},
		goCert() {
			this.$emit('update:show', false);
			uni.navigateTo({ url: '/pages/auth/notice' });
		}
	}
};
</script>

<style scoped lang="scss">
$primary: #56C2B8;

.cert-mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.cert-popup {
	width: 560rpx;
	background: #fff;
	border-radius: 28rpx;
	padding: 0 40rpx 48rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
}

.cert-img-wrap {
	width: 100%;
	height: 300rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(160deg, #E8F6FF 0%, #EDF7FF 100%);
	margin: 0 -40rpx;
	width: calc(100% + 80rpx);
	margin-bottom: 36rpx;
}

.cert-img {
	width: 220rpx;
	height: 220rpx;
}

.cert-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #222;
	margin-bottom: 20rpx;
}

.cert-desc {
	font-size: 26rpx;
	color: #888;
	text-align: center;
	line-height: 1.7;
	margin-bottom: 48rpx;
}

.cert-btn {
	width: 100%;
	height: 88rpx;
	background: $primary;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	font-weight: 600;
	color: #fff;
}
</style>
