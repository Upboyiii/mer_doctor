<template>
	<view class="search-page">
		<doctor-nav-bar title="选择科室" />

		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-wrap">
				<text class="iconfont icon-ic_search search-icon"></text>
				<input
					class="search-input"
					v-model="keyword"
					placeholder="搜索科室"
					placeholder-class="ph"
					confirm-type="search"
					@confirm="doSearch"
					@input="onInput"
					focus
				/>
				<view v-if="keyword" class="clear-btn" @tap="clearKeyword">
					<text class="iconfont icon-ic_close"></text>
				</view>
			</view>
		</view>

		<!-- 搜索结果 -->
		<scroll-view scroll-y class="result-scroll">
			<view v-if="loading" class="loading-wrap">
				<text class="loading-text">搜索中...</text>
			</view>

			<view v-else-if="resultList.length" class="result-list">
				<view
					class="result-item"
					v-for="(item, i) in resultList"
					:key="i"
					@tap="selectItem(item)"
				>
					<text class="result-name">{{item.name}}</text>
					<text class="result-arrow">›</text>
				</view>
			</view>

			<view v-else-if="searched && !resultList.length" class="empty-wrap">
				<text class="empty-text">未搜索到相关科室</text>
			</view>

			<view v-else class="hint-wrap">
				<text class="hint-text">输入科室名称关键字进行搜索</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { getHospitalSubList } from '@/api/doctor';

let searchTimer = null;

export default {
	name: 'DepartmentSearch',
	data() {
		return {
			keyword: '',
			resultList: [],
			loading: false,
			searched: false
		};
	},
	methods: {
		onInput() {
			clearTimeout(searchTimer);
			if (!this.keyword.trim()) {
				this.resultList = [];
				this.searched = false;
				return;
			}
			searchTimer = setTimeout(() => {
				this.doSearch();
			}, 500);
		},

		doSearch() {
			const kw = this.keyword.trim();
			if (!kw) return;
			this.loading = true;
			this.searched = true;
			getHospitalSubList(kw).then(res => {
				this.resultList = (res.data || []).filter(item => item.status === 1);
			}).catch(() => {
				this.resultList = [];
			}).finally(() => {
				this.loading = false;
			});
		},

		clearKeyword() {
			this.keyword = '';
			this.resultList = [];
			this.searched = false;
		},

		selectItem(item) {
			uni.$emit('department-selected', {
				name: item.name,
				id: item.id
			});
			uni.navigateBack();
		}
	}
};
</script>

<style scoped lang="scss">
$primary: $theme-color;

.search-page {
	min-height: 100vh;
	background: #F5F5F5;
}

.search-bar {
	padding: 16rpx 24rpx 20rpx;
	background: #fff;
}

.search-input-wrap {
	display: flex;
	align-items: center;
	background: #F5F5F5;
	border-radius: 40rpx;
	padding: 0 24rpx;
	height: 76rpx;
}

.search-icon {
	font-size: 32rpx;
	color: #bbb;
	margin-right: 12rpx;
	flex-shrink: 0;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	height: 76rpx;
}

.ph { color: #C0C4CC; }

.clear-btn {
	flex-shrink: 0;
	padding: 10rpx;
	margin-left: 8rpx;
	.iconfont { font-size: 28rpx; color: #ccc; }
}

.result-scroll {
	height: calc(100vh - 260rpx);
}

.result-list {
	background: #fff;
	margin-top: 16rpx;
}

.result-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #F5F5F5;
	&:last-child { border-bottom: none; }
}

.result-name {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.result-arrow {
	font-size: 32rpx;
	color: #ccc;
	margin-left: 16rpx;
	flex-shrink: 0;
}

.loading-wrap,
.empty-wrap,
.hint-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 120rpx 40rpx;
}

.loading-text,
.empty-text,
.hint-text {
	font-size: 28rpx;
	color: #bbb;
}
</style>
