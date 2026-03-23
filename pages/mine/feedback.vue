<template>
	<view class="feedback-page">
		<view class="nav-bar">
			<view class="back-btn" @tap="$back">
				<text class="iconfont icon-ic_leftarrow"></text>
			</view>
			<text class="nav-title">意见反馈</text>
		</view>

		<view class="form-card">
			<!-- 问题反馈类型 -->
			<view class="field-block">
				<text class="field-label">
					<text class="req">*</text>
					问题反馈类型
				</text>
				<view class="type-row">
					<view
						v-for="t in typeOptions"
						:key="t.value"
						class="type-tag"
						:class="{ active: feedbackType === t.value }"
						@tap="feedbackType = t.value"
					>
						<text>{{ t.label }}</text>
					</view>
				</view>
			</view>

			<!-- 详情描述 -->
			<view class="field-block">
				<text class="field-label">
					<text class="req">*</text>
					详情描述
				</text>
				<view class="textarea-box">
					<textarea
						class="detail-textarea"
						v-model="content"
						placeholder="您在哪个页面，遇到了什么问题，详细描述有助于帮助您快速解决"
						placeholder-class="textarea-ph"
						:maxlength="500"
						:auto-height="true"
					></textarea>
					<text class="char-count">{{ content.length }}/500</text>
				</view>
			</view>

			<!-- 添加图片 -->
			<view class="field-block field-block-last">
				<text class="field-label plain">添加图片 ({{ images.length }}/9)</text>
				<view class="img-grid">
					<view
						v-for="(src, idx) in images"
						:key="idx"
						class="img-cell"
					>
						<image class="img-preview" :src="src" mode="aspectFill" @tap="previewImage(idx)"></image>
						<view class="img-remove" @tap.stop="removeImage(idx)">
							<text class="img-remove-x">×</text>
						</view>
					</view>
					<view v-if="images.length < 9" class="img-cell img-add" @tap="addImages">
						<text class="img-add-plus">+</text>
					</view>
				</view>
			</view>
		</view>

		<view class="footer-spacer"></view>

		<view class="footer-bar">
			<view class="submit-btn" :class="{ disabled: submitting }" @tap="submit">
				{{ submitting ? '提交中...' : '提交' }}
			</view>
		</view>
	</view>
</template>

<script>
const TYPE_MAP = {
	bug: '功能异常',
	suggest: '优化建议',
	other: '其他反馈'
};

export default {
	name: 'MineFeedback',
	data() {
		return {
			feedbackType: 'bug',
			typeOptions: [
				{ value: 'bug', label: '功能异常' },
				{ value: 'suggest', label: '优化建议' },
				{ value: 'other', label: '其他反馈' }
			],
			content: '',
			images: [],
			submitting: false
		};
	},
	onLoad(options) {
		this.options = options;
	},
	methods: {
		$back() {
			uni.navigateBack();
		},
		addImages() {
			const remain = 9 - this.images.length;
			if (remain <= 0) return;
			uni.chooseImage({
				count: remain,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.images = this.images.concat(res.tempFilePaths);
				}
			});
		},
		removeImage(index) {
			this.images.splice(index, 1);
		},
		previewImage(index) {
			uni.previewImage({
				current: index,
				urls: this.images
			});
		},
		submit() {
			if (!this.content || !this.content.trim()) {
				uni.showToast({ title: '请填写详情描述', icon: 'none' });
				return;
			}
			if (this.content.trim().length < 10) {
				uni.showToast({ title: '详情描述至少10个字', icon: 'none' });
				return;
			}
			this.submitting = true;
			// TODO: 对接意见反馈接口，图片走 uploadFile 后提交 URL
			const payload = {
				type: this.feedbackType,
				typeLabel: TYPE_MAP[this.feedbackType],
				content: this.content.trim(),
				imageCount: this.images.length
			};
			console.log('[feedback]', payload);
			setTimeout(() => {
				this.submitting = false;
				uni.showToast({ title: '提交成功', icon: 'success' });
				setTimeout(() => uni.navigateBack(), 1500);
			}, 600);
		}
	}
};
</script>

<style lang="scss" scoped>
$bg: #f7f8fa;
$card: #fff;
$primary: #56c2b8;
$text: #333;
$text2: #666;
$muted: #999;
$border: #eee;

.feedback-page {
	min-height: 100vh;
	background: $bg;
	padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: calc(88rpx + env(safe-area-inset-top)) 30rpx 24rpx;
	background: $card;
	border-bottom: 1rpx solid #f0f0f0;

	.back-btn {
		position: absolute;
		left: 24rpx;
		bottom: 24rpx;
		padding: 8rpx 16rpx 8rpx 8rpx;
		.iconfont {
			font-size: 36rpx;
			color: $text;
		}
	}

	.nav-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #111;
	}
}

.form-card {
	margin: 24rpx 24rpx 0;
	background: $card;
	border-radius: 16rpx;
	padding: 32rpx 28rpx 8rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.field-block {
	margin-bottom: 36rpx;
}
.field-block-last {
	margin-bottom: 24rpx;
}

.field-label {
	display: block;
	font-size: 28rpx;
	color: $text;
	margin-bottom: 20rpx;
	font-weight: 500;

	&.plain {
		font-weight: 500;
	}
}

.req {
	color: #ff4d4f;
	margin-right: 4rpx;
}

.type-row {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.type-tag {
	padding: 14rpx 28rpx;
	border-radius: 40rpx;
	background: #f5f5f5;
	font-size: 26rpx;
	color: $text2;

	&.active {
		background: rgba(86, 194, 184, 0.12);
		color: $primary;
		font-weight: 500;
	}
}

.textarea-box {
	position: relative;
	background: #f7f8fa;
	border-radius: 12rpx;
	padding: 20rpx 20rpx 48rpx;
	min-height: 220rpx;
}

.detail-textarea {
	width: 100%;
	min-height: 180rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: $text;
}

.textarea-ph {
	color: #bbb;
	font-size: 28rpx;
}

.char-count {
	position: absolute;
	right: 20rpx;
	bottom: 16rpx;
	font-size: 24rpx;
	color: $muted;
}

.img-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.img-cell {
	position: relative;
	width: calc((100% - 32rpx) / 3);
	padding-bottom: calc((100% - 32rpx) / 3);
	height: 0;
	border-radius: 12rpx;
	overflow: hidden;
	background: #f0f0f0;
}

.img-preview {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.img-remove {
	position: absolute;
	top: 0;
	right: 0;
	width: 44rpx;
	height: 44rpx;
	background: rgba(0, 0, 0, 0.45);
	border-radius: 0 0 0 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
}

.img-remove-x {
	color: #fff;
	font-size: 36rpx;
	line-height: 1;
	font-weight: 300;
}

.img-add {
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx dashed #ddd;
	background: #fafafa;
	box-sizing: border-box;
}

.img-add-plus {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 64rpx;
	font-weight: 300;
	color: #ccc;
	line-height: 1;
}

.footer-spacer {
	height: 24rpx;
}

.footer-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
	background: $card;
	box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	font-size: 32rpx;
	font-weight: 600;
	color: #fff;
	background: $primary;
	border-radius: 44rpx;

	&.disabled {
		opacity: 0.65;
	}
}
</style>
