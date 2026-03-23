<template>
	<view class="qual-page">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @tap="$back">
				<text class="iconfont icon-ic_leftarrow"></text>
			</view>
			<text class="nav-title">资质认证</text>
		</view>

		<!-- Tab 标签 -->
		<view class="tabs">
			<view class="tab-item" :class="{ active: activeTab === 0 }" @tap="activeTab = 0">
				<text>1.基础认证</text>
				<text class="tab-sub">（{{basicStatus}}）</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 1 }" @tap="activeTab = 1">
				<text>2.备案认证</text>
				<text class="tab-sub">（{{recordStatus}}）</text>
			</view>
		</view>

		<text class="tab-hint">平台审核后可以进行线上问诊等患者管理服务。</text>

		<!-- ===== 基础认证（含证件上传，一页填完） ===== -->
		<scroll-view v-if="activeTab === 0" scroll-y class="form-scroll">

				<view class="section-card">
					<text class="section-title">请填写您的实名信息</text>

					<!-- 头像上传 -->
					<view class="form-row">
						<text class="form-label required">头像</text>
					</view>
					<view class="avatar-upload" @tap="uploadAvatar">
						<image v-if="form.avatar" :src="form.avatar" class="avatar-preview" mode="aspectFill"></image>
						<view v-else class="avatar-placeholder">
							<text class="plus">+</text>
						</view>
					</view>

					<!-- 姓名 -->
					<view class="form-row">
						<text class="form-label required">姓名</text>
						<input class="form-input" v-model="form.name" placeholder="请输入真实姓名" placeholder-class="ph" />
					</view>

					<!-- 医生所属 -->
					<view class="form-row arrow" @tap="pickField('clinic')">
						<text class="form-label required">医生所属</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.clinic }">{{form.clinic || '榕树家诊所'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 机构名称 -->
					<view class="form-row arrow" @tap="pickField('institution')">
						<text class="form-label required">机构名称</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.institution }">{{form.institution || ''}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 职业 -->
					<view class="form-row arrow" @tap="pickField('profession')">
						<text class="form-label required">职业</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.profession }">{{form.profession || '请选择职业'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 职称 -->
					<view class="form-row arrow" @tap="pickField('title')">
						<text class="form-label required">职称</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.title }">{{form.title || '请选择职称'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 科室 -->
					<view class="form-row arrow" @tap="pickField('department')">
						<text class="form-label required">科室</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.department }">{{form.department || '请选择科室'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>
				</view>

				<!-- 个人简介 -->
				<view class="section-card">
					<text class="section-label required">个人简介</text>
					<textarea
						class="bio-textarea"
						v-model="form.bio"
						placeholder="请填写个人简介，介绍您的从医经历、擅长方向等（50字以上）"
						placeholder-class="ph"
						:maxlength="500"
						auto-height
					></textarea>
					<text class="word-count">{{form.bio.length}}/500</text>
				</view>

				<!-- 我的擅长 -->
				<view class="section-card">
					<text class="section-label required">我的擅长</text>
					<textarea
						class="bio-textarea"
						v-model="form.specialties"
						placeholder="请填写您擅长诊治的疾病或症状，如：高血压、糖尿病管理、心脏病..."
						placeholder-class="ph"
						:maxlength="300"
						auto-height
					></textarea>
					<text class="word-count">{{form.specialties.length}}/300</text>
				</view>

			<!-- 证件上传 -->
			<!-- 身份证 -->
			<view class="section-card">
				<text class="cert-section-title">*身份证</text>
				<view class="id-number-row">
					<text class="id-number-label">身份证号</text>
					<input class="id-number-input" v-model="form.idNumber" placeholder="请输入身份证号码" placeholder-class="ph" />
				</view>
				<view class="id-cards-row">
					<view class="id-card-box" @tap="uploadImage('idFront')">
						<image v-if="form.idFront" :src="form.idFront" class="id-card-img" mode="aspectFill"></image>
						<view v-else class="id-card-placeholder">
							<view class="id-front-inner">
								<view class="id-avatar-wrap">
									<view class="id-avatar-head"></view>
									<view class="id-avatar-body"></view>
								</view>
								<view class="id-lines-wrap">
									<view class="id-line w100"></view>
									<view class="id-line w70"></view>
									<view class="id-line w50"></view>
									<view class="id-line w70"></view>
								</view>
							</view>
							<text class="id-card-tip">点击上传正面</text>
						</view>
					</view>
					<view class="id-card-box" @tap="uploadImage('idBack')">
						<image v-if="form.idBack" :src="form.idBack" class="id-card-img" mode="aspectFill"></image>
						<view v-else class="id-card-placeholder">
							<view class="id-back-inner">
								<view class="id-emblem-wrap">
									<view class="id-emblem-circle"></view>
								</view>
								<view class="id-back-text">
									<text class="id-back-country">中华人民共和国</text>
									<text class="id-back-name">居民身份证</text>
								</view>
							</view>
							<text class="id-card-tip">点击上传背面</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 医师执业证 -->
			<view class="section-card">
				<text class="cert-section-title">*医师执业证</text>
				<text class="cert-section-sub">需上传编码页和执业地点页</text>
				<view class="cert-upload-row">
					<view class="cert-upload-box" @tap="uploadImage('licenseCode')">
						<image v-if="form.licenseCode" :src="form.licenseCode" class="cert-upload-img" mode="aspectFill"></image>
						<view v-else class="cert-upload-empty">
							<view class="cert-doc-icon">
								<view class="cert-doc-head"></view>
								<view class="cert-doc-line"></view>
								<view class="cert-doc-line short"></view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 职称证 -->
			<view class="section-card">
				<text class="cert-section-title">*职称证</text>
				<text class="cert-section-sub">若无职称证可上传工牌</text>
				<view class="cert-upload-row">
					<view class="cert-upload-box" @tap="uploadImage('titleCert')">
						<image v-if="form.titleCert" :src="form.titleCert" class="cert-upload-img" mode="aspectFill"></image>
						<view v-else class="cert-upload-empty">
							<view class="cert-doc-icon">
								<view class="cert-doc-head"></view>
								<view class="cert-doc-line"></view>
								<view class="cert-doc-line short"></view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="section-card">
				<view class="form-tip">
					<text class="iconfont icon-ic_tips"></text>
					<text class="tip-text">信息仅用于认证审核，平台将保障您的信息安全</text>
				</view>
			</view>

		</scroll-view>

		<!-- ===== 备案认证 ===== -->
		<scroll-view v-if="activeTab === 1" scroll-y class="form-scroll">
			<view class="empty-record">
				<image class="empty-img" src="/static/images/empty-list.png" mode="aspectFit"></image>
				<text class="empty-text">请先完成基础认证后再进行备案认证</text>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="bottom-btn-wrap" v-if="activeTab === 0">
			<view class="bottom-btn" @tap="submitForm">提交认证</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'AuthQualification',
	data() {
		return {
			activeTab: 0,
			basicStatus: '未提交',
			recordStatus: '未备案',
			form: {
				avatar: '',
				name: '',
				clinic: '榕树家诊所',
				institution: '',
				profession: '',
				title: '',
				department: '',
				bio: '',
				specialties: '',
				idNumber: '',
				idFront: '',
				idBack: '',
				licenseCode: '',
				titleCert: ''
			},
			professionOptions: ['执业医师', '执业助理医师'],
			titleOptions: ['主任医师', '副主任医师', '主治医师', '住院医师', '医师'],
			departmentOptions: ['内科', '外科', '儿科', '妇科', '皮肤科', '眼科', '耳鼻喉科', '口腔科', '精神科', '中医科', '全科']
		};
	},
	onLoad(options) {
		if (options && options.tab) {
			this.activeTab = Number(options.tab);
		}
	},
	methods: {
		$back() { uni.navigateBack(); },

		uploadAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.form.avatar = res.tempFilePaths[0];
				}
			});
		},

		uploadImage(field) {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.form[field] = res.tempFilePaths[0];
				}
			});
		},

		pickField(field) {
			const maps = {
				profession: this.professionOptions,
				title: this.titleOptions,
				department: this.departmentOptions
			};
			if (maps[field]) {
				uni.showActionSheet({
					itemList: maps[field],
					success: (res) => {
						this.form[field] = maps[field][res.tapIndex];
					}
				});
			} else if (field === 'institution') {
				// TODO: 对接机构搜索接口
				uni.showToast({ title: '机构选择开发中', icon: 'none' });
			} else if (field === 'clinic') {
				// TODO: 对接诊所列表
				uni.showToast({ title: '所属选择开发中', icon: 'none' });
			}
		},

		submitForm() {
			if (!this.form.name) {
				return uni.showToast({ title: '请输入姓名', icon: 'none' });
			}
			if (!this.form.profession) {
				return uni.showToast({ title: '请选择职业', icon: 'none' });
			}
			if (!this.form.title) {
				return uni.showToast({ title: '请选择职称', icon: 'none' });
			}
			if (!this.form.department) {
				return uni.showToast({ title: '请选择科室', icon: 'none' });
			}
			if (!this.form.bio || this.form.bio.length < 20) {
				return uni.showToast({ title: '请填写个人简介（至少20字）', icon: 'none' });
			}
			if (!this.form.specialties.trim()) {
				return uni.showToast({ title: '请填写擅长方向', icon: 'none' });
			}
			if (!this.form.idNumber) {
				return uni.showToast({ title: '请输入身份证号', icon: 'none' });
			}
			if (!this.form.idFront || !this.form.idBack) {
				return uni.showToast({ title: '请上传身份证正反面', icon: 'none' });
			}
			if (!this.form.licenseCode) {
				return uni.showToast({ title: '请上传医师执业证', icon: 'none' });
			}
			if (!this.form.titleCert) {
				return uni.showToast({ title: '请上传职称证', icon: 'none' });
			}
			// TODO: 对接提交认证接口
			uni.showLoading({ title: '提交中...' });
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({ title: '提交成功，请等待审核', icon: 'none' });
				this.basicStatus = '审核中';
				setTimeout(() => uni.navigateBack(), 1500);
			}, 1000);
		}
	}
};
</script>

<style scoped lang="scss">
$primary: #56C2B8;
$required: #E93323;

.qual-page {
	min-height: 100vh;
	background: #F5F6FA;
	padding-bottom: 160rpx;
}

.nav-bar {
	display: flex;
	align-items: center;
	padding: 88rpx 30rpx 20rpx;
	background: #fff;
	position: relative;

	.back-btn {
		padding: 10rpx 20rpx 10rpx 0;
		font-size: 36rpx;
		color: #333;
	}

	.nav-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 32rpx;
		font-weight: 600;
		color: #111;
	}
}

.tabs {
	display: flex;
	background: #fff;
	border-bottom: 1rpx solid #F0F0F0;
}

.tab-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24rpx 0 20rpx;
	font-size: 26rpx;
	color: #999;
	position: relative;

	text { color: inherit; }
	.tab-sub { font-size: 22rpx; margin-left: 4rpx; }

	&.active {
		color: $primary;
		font-weight: 600;
		&::after {
			content: '';
			position: absolute;
			bottom: 0; left: 20%; right: 20%;
			height: 4rpx;
			background: $primary;
			border-radius: 2rpx;
		}
	}
}

.tab-hint {
	display: block;
	font-size: 22rpx;
	color: #999;
	padding: 16rpx 24rpx;
	background: #fff;
}

.form-scroll {
	height: calc(100vh - 400rpx);
}

.section-card {
	margin: 16rpx 24rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx 24rpx;
}

.section-title {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 24rpx;

	&.mt40 { margin-top: 40rpx; }
}

.section-sub {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-top: -16rpx;
	margin-bottom: 20rpx;
}

// 头像上传
.avatar-upload {
	margin-bottom: 24rpx;
}

.avatar-preview {
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
	border: 2rpx dashed #ddd;
}

.avatar-placeholder {
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
	border: 2rpx dashed #C8D0D8;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FAFAFA;

	.plus { font-size: 56rpx; color: #C8D0D8; line-height: 1; }
}

// 表单行
.form-row {
	display: flex;
	align-items: center;
	min-height: 88rpx;
	border-bottom: 1rpx solid #F0F0F0;

	&:last-of-type { border-bottom: none; }

	&.arrow { cursor: pointer; }
}

.form-label {
	font-size: 28rpx;
	color: #333;
	width: 180rpx;
	flex-shrink: 0;

	&.required::before {
		content: '*';
		color: $required;
		margin-right: 4rpx;
	}
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}

.form-input-row {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.form-value {
	font-size: 28rpx;
	color: #333;
	&.ph { color: #C0C4CC; }
}

.arrow-icon {
	font-size: 32rpx;
	color: #ccc;
	margin-left: 8rpx;
}

.form-tip {
	display: flex;
	align-items: center;
	margin-top: 28rpx;
	padding: 0 4rpx;

	&.mt30 { margin-top: 30rpx; }

	text {
		font-size: 22rpx;
		color: #bbb;
		margin-left: 6rpx;
	}

	.iconfont { font-size: 24rpx; color: #ccc; }
}

// 证件区标题
.cert-section-title {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 16rpx;
}

.cert-section-sub {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-top: -8rpx;
	margin-bottom: 20rpx;
}

// 身份证号输入行
.id-number-row {
	display: flex;
	align-items: center;
	height: 88rpx;
	border: 1rpx solid #EAEAEA;
	border-radius: 10rpx;
	padding: 0 20rpx;
	margin-bottom: 20rpx;
	background: #FAFAFA;
}

.id-number-label {
	font-size: 28rpx;
	color: #666;
	width: 140rpx;
	flex-shrink: 0;
}

.id-number-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}

// 身份证两张卡片
.id-cards-row {
	display: flex;
	gap: 16rpx;
}

.id-card-box {
	flex: 1;
	height: 200rpx;
	border-radius: 12rpx;
	border: 2rpx dashed #CDD5DD;
	background: #F2F5F8;
	overflow: hidden;
}

.id-card-img {
	width: 100%;
	height: 200rpx;
}

.id-card-placeholder {
	width: 100%;
	height: 200rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.id-front-inner {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 0 20rpx;
	box-sizing: border-box;
}

.id-avatar-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 16rpx;
}

.id-avatar-head {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background: #C5D3DE;
}

.id-avatar-body {
	width: 56rpx;
	height: 30rpx;
	border-radius: 28rpx 28rpx 0 0;
	background: #C5D3DE;
	margin-top: 4rpx;
}

.id-lines-wrap {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.id-line {
	height: 10rpx;
	border-radius: 5rpx;
	background: #C5D3DE;
}

.id-line.w100 { width: 100%; }
.id-line.w70  { width: 70%; }
.id-line.w50  { width: 50%; }

.id-back-inner {
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	width: 100%;
	box-sizing: border-box;
}

.id-emblem-wrap {
	margin-right: 16rpx;
}

.id-emblem-circle {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	background: #E0956A;
	opacity: 0.7;
}

.id-back-text {
	display: flex;
	flex-direction: column;
}

.id-back-country {
	font-size: 18rpx;
	color: #A0B0BB;
	letter-spacing: 2rpx;
}

.id-back-name {
	font-size: 22rpx;
	color: #90A4AE;
	margin-top: 6rpx;
	letter-spacing: 3rpx;
}

.id-card-tip {
	font-size: 22rpx;
	color: #AABBCC;
	margin-top: 12rpx;
}

// 执业证 / 职称证上传
.cert-upload-row {
	display: flex;
	gap: 20rpx;
}

.cert-upload-box {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	border: 2rpx dashed #CDD5DD;
	background: #F2F5F8;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cert-upload-img {
	width: 200rpx;
	height: 200rpx;
}

.cert-upload-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.cert-doc-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.cert-doc-head {
	width: 60rpx;
	height: 72rpx;
	background: #D0DDE8;
	border-radius: 6rpx;
	margin-bottom: 10rpx;
	position: relative;
}

.cert-doc-line {
	width: 60rpx;
	height: 10rpx;
	background: #D0DDE8;
	border-radius: 5rpx;
	margin-top: 8rpx;
}

.cert-doc-line.short {
	width: 40rpx;
}

.tip-text {
	font-size: 22rpx;
	color: #bbb;
	margin-left: 6rpx;
}

// 证件上传网格
.upload-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-top: 16rpx;
}

.upload-item {
	width: 180rpx;
	height: 180rpx;
	border-radius: 12rpx;
	border: 2rpx dashed #C8D0D8;
	background: #F7F8FA;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.upload-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.upload-placeholder-img {
	width: 70rpx;
	height: 70rpx;
	opacity: 0.3;
}

.upload-preview {
	width: 100%;
	height: 100%;
}

// 简介 & 擅长区
.section-label {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 20rpx;

	&.required::before {
		content: '*';
		color: $required;
		margin-right: 4rpx;
	}
}

.section-hint {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-top: -12rpx;
	margin-bottom: 20rpx;
}

.bio-textarea {
	width: 100%;
	min-height: 160rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 1.7;
	background: #F7F8FA;
	border-radius: 10rpx;
	padding: 20rpx;
	box-sizing: border-box;
}

.word-count {
	display: block;
	text-align: right;
	font-size: 22rpx;
	color: #C0C4CC;
	margin-top: 10rpx;
}

// 备案认证占位
.empty-record {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 40rpx;

	.empty-img { width: 220rpx; height: 220rpx; opacity: 0.5; margin-bottom: 30rpx; }
	.empty-text { font-size: 28rpx; color: #bbb; }
}

// 底部按钮
.bottom-btn-wrap {
	position: fixed;
	bottom: 0; left: 0; right: 0;
	padding: 20rpx 40rpx;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #F5F6FA;

	.bottom-btn {
		width: 100%;
		height: 96rpx;
		background: $primary;
		border-radius: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}
}
</style>
