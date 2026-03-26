<template>
	<view class="search-page">
		<doctor-nav-bar title="选择门店" />

		<view class="search-bar">
			<view class="search-input-wrap">
				<text class="iconfont icon-ic_search search-icon"></text>
				<input
					class="search-input"
					v-model="keyword"
					placeholder="搜索门店名称"
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

		<scroll-view scroll-y class="result-scroll" @scrolltolower="loadMore">
			<view v-if="loading && page === 1" class="loading-wrap">
				<text class="loading-text">搜索中...</text>
			</view>

			<view v-else-if="resultList.length" class="result-list">
				<view
					class="result-item"
					v-for="(item, i) in resultList"
					:key="item.id || i"
					@tap="selectItem(item)"
				>
					<image class="mer-avatar" :src="item.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
					<view class="mer-info">
						<text class="mer-name">{{item.name}}</text>
						<view class="mer-meta">
							<view class="star-row" v-if="item.starLevel">
								<text class="star" v-for="s in item.starLevel" :key="s">★</text>
							</view>
							<text class="mer-follower" v-if="item.followerNum">{{item.followerNum}}人关注</text>
						</view>
						<view class="mer-products" v-if="item.proList && item.proList.length">
							<text class="mer-pro-count">{{item.proList.length}}个服务项目</text>
						</view>
					</view>
					<text class="result-arrow">›</text>
				</view>

				<view class="tip" v-if="loading && page > 1"><text>加载中...</text></view>
				<view class="tip" v-if="noMore && resultList.length > 0"><text>— 没有更多了 —</text></view>
			</view>

			<view v-else-if="searched && !resultList.length" class="empty-wrap">
				<text class="empty-text">未搜索到相关门店</text>
			</view>

			<view v-else class="hint-wrap">
				<text class="hint-text">输入门店名称关键字进行搜索</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { getMerchantSearchList } from '@/api/doctor';

let searchTimer = null;

export default {
	name: 'MerchantSearch',
	data() {
		return {
			keyword: '',
			resultList: [],
			loading: false,
			searched: false,
			page: 1,
			limit: 15,
			noMore: false
		};
	},
	methods: {
		onInput() {
			clearTimeout(searchTimer);
			if (!this.keyword.trim()) {
				this.resultList = [];
				this.searched = false;
				this.page = 1;
				this.noMore = false;
				return;
			}
			searchTimer = setTimeout(() => {
				this.page = 1;
				this.noMore = false;
				this.resultList = [];
				this.doSearch();
			}, 500);
		},

		doSearch() {
			const kw = this.keyword.trim();
			if (!kw) return;
			this.loading = true;
			this.searched = true;
			getMerchantSearchList({
				keywords: kw,
				page: this.page,
				limit: this.limit
			}).then(res => {
				const data = res.data || {};
				const list = data.list || [];
				if (this.page === 1) {
					this.resultList = list;
				} else {
					this.resultList = this.resultList.concat(list);
				}
				if (list.length < this.limit || this.resultList.length >= (data.total || 0)) {
					this.noMore = true;
				}
			}).catch(() => {
				if (this.page === 1) this.resultList = [];
			}).finally(() => {
				this.loading = false;
			});
		},

		loadMore() {
			if (this.loading || this.noMore) return;
			this.page++;
			this.doSearch();
		},

		clearKeyword() {
			this.keyword = '';
			this.resultList = [];
			this.searched = false;
			this.page = 1;
			this.noMore = false;
		},

		selectItem(item) {
			uni.$emit('merchant-selected', {
				id: item.id,
				name: item.name,
				avatar: item.avatar || '',
				starLevel: item.starLevel || 0
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
	padding: 28rpx 30rpx;
	border-bottom: 1rpx solid #F5F5F5;
	&:last-child { border-bottom: none; }
}

.mer-avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
	background: #eee;
}

.mer-info {
	flex: 1;
	min-width: 0;
}

.mer-name {
	display: block;
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.mer-meta {
	display: flex;
	align-items: center;
	margin-top: 8rpx;
	gap: 16rpx;
}

.star-row {
	display: flex;
	.star { font-size: 22rpx; color: #FAAD14; }
}

.mer-follower {
	font-size: 22rpx;
	color: #999;
}

.mer-products {
	margin-top: 6rpx;
}

.mer-pro-count {
	font-size: 22rpx;
	color: $primary;
	background: rgba(86, 194, 184, 0.1);
	padding: 2rpx 12rpx;
	border-radius: 6rpx;
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

.tip {
	text-align: center;
	color: #bbb;
	font-size: 24rpx;
	padding: 30rpx 0;
}
</style>
