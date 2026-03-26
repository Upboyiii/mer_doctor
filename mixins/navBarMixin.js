/**
 * 全局导航栏 mixin
 * 提供 statusBarHeight 和 navPadTop，适配 iOS / Android / H5 / PC
 */
const sysInfo = uni.getSystemInfoSync();

export default {
	data() {
		return {
			statusBarHeight: sysInfo.statusBarHeight || 0
		};
	},
	computed: {
		navPadTop() {
			return (this.statusBarHeight + 10) + 'px';
		}
	}
};
