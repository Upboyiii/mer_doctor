<template>
	<view class="consultation-page">
		<view class="header">
			<view class="tab-row">
				<view
					class="tab-item"
					v-for="(tab, idx) in tabs"
					:key="idx"
					:class="{ active: currentTab === idx }"
					@tap="switchTab(idx)"
				>
					<text class="tab-text">{{tab.name}}</text>
					<view class="tab-line" v-if="currentTab === idx"></view>
				</view>
			</view>
			<view class="sort-btn" @tap="toggleSort">
				<text class="sort-text">{{sortLabel}}</text>
				<text class="sort-arrow">▾</text>
			</view>
		</view>

		<scroll-view scroll-y class="list-scroll" @scrolltolower="loadMore" :style="{ height: scrollH + 'px' }">
			<view class="empty-wrap" v-if="list.length === 0 && !loading">
				<image class="empty-img" src="/static/images/empty-list.png" mode="aspectFit"></image>
				<text class="empty-text">暂无数据</text>
			</view>

			<view class="card" v-for="(item, idx) in list" :key="idx" @tap="toDetail(item)">
				<view class="card-top">
					<view class="patient-row">
						<image class="avatar" :src="item.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
						<view class="patient-info">
							<text class="p-name">{{item.patientName}}</text>
							<text class="p-desc">{{item.age}}岁 | {{item.gender === 1 ? '男' : '女'}}</text>
						</view>
					</view>
					<view class="status-tag" :class="'s' + item.status">{{statusMap[item.status]}}</view>
				</view>
				<view class="card-body" v-if="item.complaint">
					<text class="complaint">主诉：{{item.complaint}}</text>
				</view>
				<view class="card-foot">
					<text class="time">{{item.createTime}}</text>
					<view class="actions">
						<view class="btn ghost" v-if="item.status === 0" @tap.stop="handleApply(item)">处理申请</view>
						<view class="btn solid" v-if="item.status === 1" @tap.stop="toChat(item)">继续问诊</view>
					</view>
				</view>
			</view>

			<view class="tip" v-if="loading"><text>加载中...</text></view>
			<view class="tip" v-if="noMore && list.length > 0"><text>— 没有更多了 —</text></view>
		</scroll-view>

		<!-- 专属顾问浮窗（暂时关闭）
		<view class="consultant-float" @tap="toConsultant">
			<image class="consultant-avatar" src="/static/images/icon-consultant.png" mode="aspectFit"></image>
			<text class="consultant-text">专属</text>
		</view>
		-->
	</view>
</template>

<script>
export default {
	name: 'ConsultationIndex',
	data() {
		return {
			currentTab: 0,
			tabs: [
				{ name: '全部', type: '' },
				{ name: '待接诊', type: 'pending' },
				{ name: '进行中', type: 'ongoing' }
			],
			statusMap: { 0: '待接诊', 1: '进行中', 2: '已完成', 3: '已取消' },
			sortType: 'new_message',
			sortLabel: '按新消息',
			list: [],
			page: 1,
			loading: false,
			noMore: false,
			scrollH: 600
		}
	},
	onLoad() {
		const sys = uni.getSystemInfoSync()
		this.scrollH = sys.windowHeight - 110
		this.loadList()
	},
	onPullDownRefresh() { this.refresh(() => uni.stopPullDownRefresh()) },
	methods: {
		switchTab(idx) { this.currentTab = idx; this.refresh() },
		toggleSort() {
			uni.showActionSheet({
				itemList: ['按新消息', '按时间'],
				success: (r) => {
					this.sortLabel = r.tapIndex === 0 ? '按新消息' : '按时间'
					this.refresh()
				}
			})
		},
		refresh(cb) { this.page = 1; this.noMore = false; this.list = []; this.loadList(cb) },
		loadList(cb) {
			if (this.loading || this.noMore) return
			this.loading = true
			setTimeout(() => { this.loading = false; cb && cb() }, 300)
		},
		loadMore() { if (!this.noMore) { this.page++; this.loadList() } },
		toDetail(item) { uni.navigateTo({ url: `/pages/consultation/detail?id=${item.id}` }) },
		handleApply(item) { uni.navigateTo({ url: `/pages/consultation/apply?id=${item.id}` }) },
		toChat(item) { uni.navigateTo({ url: `/pages/consultation/chat?id=${item.id}` }) },
		toConsultant() { uni.showToast({ title: '专属顾问功能即将上线', icon: 'none' }) }
	}
}
</script>

<style lang="scss" scoped>
$primary: #56C2B8;
$primary-soft: rgba(86,194,184,0.08);
$text: #333;
$text2: #666;
$text3: #999;
$bg: #F5F5F5;

.consultation-page {
	min-height: 100vh;
	background: $bg;
	display: flex;
	flex-direction: column;
}

.header {
	background: linear-gradient(180deg, #EDF8F6 0%, #fff 100%);
	padding: 70rpx 0 0;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;

	.tab-row { display: flex; padding-left: 10rpx; }

	.tab-item {
		position: relative; padding: 24rpx 28rpx;
		.tab-text { font-size: 30rpx; color: $text3; }
		.tab-line {
			position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
			width: 44rpx; height: 5rpx; border-radius: 3rpx; background: $primary;
		}
		&.active .tab-text { font-size: 34rpx; font-weight: 700; color: $text; }
	}

	.sort-btn {
		display: flex; align-items: center; padding: 24rpx 30rpx;
		.sort-text { font-size: 24rpx; color: $text3; }
		.sort-arrow { font-size: 20rpx; color: $text3; margin-left: 4rpx; }
	}
}

.list-scroll { flex: 1; padding: 16rpx 30rpx 0; }

.empty-wrap {
	display: flex; flex-direction: column; align-items: center; padding: 220rpx 0;
	.empty-img { width: 260rpx; height: 260rpx; margin-bottom: 20rpx; opacity: 0.5; }
	.empty-text { font-size: 28rpx; color: $text3; }
}

.card {
	background: #fff; border-radius: 14rpx; padding: 24rpx; margin-bottom: 16rpx;

	.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14rpx; }
	.patient-row { display: flex; align-items: center; }
	.avatar { width: 72rpx; height: 72rpx; border-radius: 50%; margin-right: 16rpx; background: #eee; }
	.p-name { display: block; font-size: 28rpx; font-weight: 600; color: $text; }
	.p-desc { font-size: 22rpx; color: $text3; margin-top: 4rpx; }

	.status-tag {
		font-size: 22rpx; padding: 6rpx 16rpx; border-radius: 20rpx;
		&.s0 { color: #FA8C16; background: rgba(250,140,22,0.08); }
		&.s1 { color: $primary; background: $primary-soft; }
		&.s2 { color: #52C41A; background: rgba(82,196,26,0.08); }
		&.s3 { color: $text3; background: #F5F5F5; }
	}

	.card-body { margin-bottom: 14rpx; .complaint { font-size: 26rpx; color: $text2; line-height: 1.5; } }
	.card-foot { display: flex; justify-content: space-between; align-items: center; .time { font-size: 22rpx; color: $text3; } }
	.actions { display: flex; gap: 14rpx; }
	.btn {
		font-size: 24rpx; padding: 10rpx 24rpx; border-radius: 30rpx;
		&.solid { background: $primary; color: #fff; }
		&.ghost { border: 1rpx solid $primary; color: $primary; }
	}
}

.tip { text-align: center; color: $text3; font-size: 24rpx; padding: 30rpx 0; }

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
</style>
