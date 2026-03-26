<template>
	<view>
		<view class="dr-nav-bar" :style="{ paddingTop: navPadTop, background: bgColor, borderBottom: showBorder ? '1rpx solid #EAEEF2' : 'none' }">
			<view v-if="showBack" class="dr-nav-back" @tap="handleBack">
				<text class="iconfont icon-ic_leftarrow"></text>
			</view>
			<text class="dr-nav-title">{{ title }}</text>
			<slot></slot>
		</view>
		<view v-if="placeholder" :style="{ height: navHeight + 'px' }"></view>
	</view>
</template>

<script>
const sysInfo = uni.getSystemInfoSync();

export default {
	name: 'DoctorNavBar',
	props: {
		title: { type: String, default: '' },
		showBack: { type: Boolean, default: true },
		bgColor: { type: String, default: '#FAFBFC' },
		showBorder: { type: Boolean, default: true },
		placeholder: { type: Boolean, default: false }
	},
	data() {
		return {
			navHeight: 0
		};
	},
	mounted() {
		this.$nextTick(() => {
			const query = uni.createSelectorQuery().in(this);
			query.select('.dr-nav-bar').boundingClientRect(rect => {
				if (rect) this.navHeight = rect.height;
			}).exec();
		});
	},
	methods: {
		handleBack() {
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.reLaunch({ url: '/pages/workbench/index' });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.dr-nav-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: 0 30rpx 24rpx;
}

.dr-nav-back {
	position: absolute;
	left: 24rpx;
	bottom: 20rpx;
	padding: 8rpx 16rpx 8rpx 8rpx;
	z-index: 1;

	.iconfont {
		font-size: 36rpx;
		color: #555;
	}
}

.dr-nav-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333;
}
</style>
