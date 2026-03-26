<template>
	<view class="qual-page">
		<doctor-nav-bar title="资质认证" />

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
						<image v-if="form.picture" :src="form.picture" class="avatar-preview" mode="aspectFill"></image>
						<view v-else class="avatar-placeholder">
							<view v-if="uploadingField === 'picture'" class="avatar-loading"><text class="loading-dot">...</text></view>
							<text v-else class="plus">+</text>
						</view>
					</view>

					<!-- 姓名 -->
					<view class="form-row">
						<text class="form-label required">姓名</text>
						<input class="form-input" v-model="form.name" placeholder="请输入真实姓名" placeholder-class="ph" />
					</view>

					<!-- 机构名称 (hospitalName) -->
					<view class="form-row arrow" @tap="goHospitalSearch">
						<text class="form-label required">机构名称</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.hospitalName }">{{form.hospitalName || '请选择诊所'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 职业 (hospitalCareer) -->
					<view class="form-row arrow" @tap="pickField('hospitalCareer')">
						<text class="form-label required">职业</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.hospitalCareer }">{{form.hospitalCareer || '请选择职业'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 职称 (hospitalTitle) -->
					<view class="form-row arrow" @tap="pickField('hospitalTitle')">
						<text class="form-label required">职称</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.hospitalTitle }">{{form.hospitalTitle || '请选择职称'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>

					<!-- 科室 (hospitalSub) -->
					<view class="form-row arrow" @tap="goDepartmentSearch">
						<text class="form-label required">科室</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !form.hospitalSub }">{{form.hospitalSub || '请选择科室'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>
				</view>

				<!-- 个人简介 (selfInfo) -->
				<view class="section-card">
					<text class="section-label required">个人简介</text>
					<textarea
						class="bio-textarea"
						v-model="form.selfInfo"
						placeholder="请填写个人简介，介绍您的从医经历、擅长方向等（20字以上）"
						placeholder-class="ph"
						:maxlength="500"
						auto-height
					></textarea>
					<text class="word-count">{{form.selfInfo.length}}/500</text>
				</view>

				<!-- 我的擅长 (hospitalDomain) -->
				<view class="section-card">
					<text class="section-label required">我的擅长</text>
					<textarea
						class="bio-textarea"
						v-model="form.hospitalDomain"
						placeholder="请填写您擅长诊治的疾病或症状，如：高血压、糖尿病管理、心脏病..."
						placeholder-class="ph"
						:maxlength="300"
						auto-height
					></textarea>
					<text class="word-count">{{form.hospitalDomain.length}}/300</text>
				</view>

		<!-- 证件上传 -->
		<!-- 身份证 -->
		<view class="section-card">
			<text class="cert-section-title">*身份证</text>
			<view class="id-number-row">
				<text class="id-number-label">身份证号</text>
				<input class="id-number-input" v-model="form.idcardNum" placeholder="请输入身份证号码" placeholder-class="ph" />
			</view>
			<view class="id-cards-row">
				<view class="id-card-box" @tap="pickImage('idcardObverseImageUrl')">
					<image v-if="form.idcardObverseImageUrl" :src="form.idcardObverseImageUrl" class="id-card-img" mode="aspectFill"></image>
					<view v-else class="id-card-placeholder">
						<view v-if="uploadingField === 'idcardObverseImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="id-front-inner">
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
						<text class="id-card-tip" v-if="uploadingField !== 'idcardObverseImageUrl'">点击上传正面</text>
					</view>
				</view>
				<view class="id-card-box" @tap="pickImage('idcardReverseImageUrl')">
					<image v-if="form.idcardReverseImageUrl" :src="form.idcardReverseImageUrl" class="id-card-img" mode="aspectFill"></image>
					<view v-else class="id-card-placeholder">
						<view v-if="uploadingField === 'idcardReverseImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="id-back-inner">
							<view class="id-emblem-wrap">
								<view class="id-emblem-circle"></view>
							</view>
							<view class="id-back-text">
								<text class="id-back-country">中华人民共和国</text>
								<text class="id-back-name">居民身份证</text>
							</view>
						</view>
						<text class="id-card-tip" v-if="uploadingField !== 'idcardReverseImageUrl'">点击上传背面</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 医师执业证（编码页 + 执业地点页） -->
		<view class="section-card">
			<text class="cert-section-title">*医师执业证</text>
			<text class="cert-section-sub">需上传编码页和执业地点页</text>
			<view class="cert-upload-row">
				<view class="cert-upload-box" @tap="pickImage('licenseImageUrl')">
					<image v-if="form.licenseImageUrl" :src="form.licenseImageUrl" class="cert-upload-img" mode="aspectFill"></image>
					<view v-else class="cert-upload-empty">
						<view v-if="uploadingField === 'licenseImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="cert-doc-icon">
							<view class="cert-doc-head"></view>
							<view class="cert-doc-line"></view>
							<view class="cert-doc-line short"></view>
						</view>
					</view>
				</view>
				<view class="cert-upload-box" @tap="pickImage('licenseLocationImageUrl')">
					<image v-if="form.licenseLocationImageUrl" :src="form.licenseLocationImageUrl" class="cert-upload-img" mode="aspectFill"></image>
					<view v-else class="cert-upload-empty">
						<view v-if="uploadingField === 'licenseLocationImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="cert-doc-icon">
							<view class="cert-doc-head"></view>
							<view class="cert-doc-line"></view>
							<view class="cert-doc-line short"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="cert-upload-labels">
				<text class="cert-upload-label">编码页</text>
				<text class="cert-upload-label">执业地点页</text>
			</view>
		</view>

		<!-- 职称证 (hospitalTitleImageUrl) -->
		<view class="section-card">
			<text class="cert-section-title">*职称证</text>
			<text class="cert-section-sub">若无职称证可上传工牌</text>
			<view class="cert-upload-row">
				<view class="cert-upload-box" @tap="pickImage('hospitalTitleImageUrl')">
					<image v-if="form.hospitalTitleImageUrl" :src="form.hospitalTitleImageUrl" class="cert-upload-img" mode="aspectFill"></image>
					<view v-else class="cert-upload-empty">
						<view v-if="uploadingField === 'hospitalTitleImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="cert-doc-icon">
							<view class="cert-doc-head"></view>
							<view class="cert-doc-line"></view>
							<view class="cert-doc-line short"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 医师资格证 (qualificationImageUrl) -->
		<view class="section-card">
			<text class="cert-section-title">医师资格证</text>
			<view class="cert-upload-row">
				<view class="cert-upload-box" @tap="pickImage('qualificationImageUrl')">
					<image v-if="form.qualificationImageUrl" :src="form.qualificationImageUrl" class="cert-upload-img" mode="aspectFill"></image>
					<view v-else class="cert-upload-empty">
						<view v-if="uploadingField === 'qualificationImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="cert-doc-icon">
							<view class="cert-doc-head"></view>
							<view class="cert-doc-line"></view>
							<view class="cert-doc-line short"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 毕业院校证书 (graduateSchoolImageUrl) -->
		<view class="section-card">
			<text class="cert-section-title">毕业院校证书</text>
			<view class="cert-upload-row">
				<view class="cert-upload-box" @tap="pickImage('graduateSchoolImageUrl')">
					<image v-if="form.graduateSchoolImageUrl" :src="form.graduateSchoolImageUrl" class="cert-upload-img" mode="aspectFill"></image>
					<view v-else class="cert-upload-empty">
						<view v-if="uploadingField === 'graduateSchoolImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="cert-doc-icon">
							<view class="cert-doc-head"></view>
							<view class="cert-doc-line"></view>
							<view class="cert-doc-line short"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 电子签名 (signatureImageUrl) -->
		<view class="section-card">
			<text class="cert-section-title">电子签名</text>
			<view class="cert-upload-row">
				<view class="cert-upload-box" @tap="pickImage('signatureImageUrl')">
					<image v-if="form.signatureImageUrl" :src="form.signatureImageUrl" class="cert-upload-img" mode="aspectFill"></image>
					<view v-else class="cert-upload-empty">
						<view v-if="uploadingField === 'signatureImageUrl'" class="cert-upload-loading"><text>上传中...</text></view>
						<view v-else class="cert-doc-icon">
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
			<!-- 未通过基础认证 -->
			<view v-if="auditStatus !== 1" class="empty-record">
				<image class="empty-img" src="/static/images/empty-list.png" mode="aspectFit"></image>
				<text class="empty-text">请先完成基础认证后再进行备案认证</text>
			</view>

			<!-- 已通过基础认证 -->
			<view v-else>
				<!-- 已备案状态 -->
				<view v-if="filingInfo.mchId" class="section-card">
					<text class="section-title">当前备案门店</text>
					<view class="filed-merchant">
						<image class="filed-avatar" :src="filingInfo.merchantAvatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
						<view class="filed-info">
							<text class="filed-name">{{filingInfo.merchantName || '门店'}}</text>
							<view class="filed-status">
								<view class="filed-dot"></view>
								<text>已备案</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 未备案 / 选择门店 -->
				<view class="section-card">
					<text class="section-title">{{filingInfo.mchId ? '更换备案门店' : '选择备案门店'}}</text>
					<text class="section-hint">请选择您所在的门店进行备案，备案后可开展线上问诊服务。</text>

					<view class="form-row arrow" @tap="goMerchantSearch">
						<text class="form-label required">门店</text>
						<view class="form-input-row">
							<text class="form-value" :class="{ ph: !selectedMerchant.name }">{{selectedMerchant.name || '请选择门店'}}</text>
							<text class="arrow-icon">›</text>
						</view>
					</view>
				</view>

				<view class="section-card" v-if="selectedMerchant.name">
					<view class="filing-preview">
						<image class="preview-avatar" :src="selectedMerchant.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
						<view class="preview-info">
							<text class="preview-name">{{selectedMerchant.name}}</text>
							<view class="preview-star" v-if="selectedMerchant.starLevel">
								<text class="star" v-for="s in selectedMerchant.starLevel" :key="s">★</text>
							</view>
						</view>
					</view>
				</view>

				<view class="section-card">
					<view class="form-tip">
						<text class="iconfont icon-ic_tips"></text>
						<text class="tip-text">备案信息提交后需等待平台审核，审核通过后即可在该门店执业。</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
	<view class="bottom-btn-wrap" v-if="activeTab === 1 && auditStatus === 1 && selectedMerchant.name">
		<view class="bottom-btn" :class="{ disabled: filingSubmitting }" @tap="submitFiling">
			{{ filingSubmitting ? '提交中...' : '提交备案' }}
		</view>
	</view>
	<view class="bottom-btn-wrap" v-if="activeTab === 0">
		<view class="bottom-btn" :class="{ disabled: submitting || !!uploadingField }" @tap="submitForm">
			{{ submitting ? '提交中...' : '提交认证' }}
		</view>
	</view>
	</view>
</template>

<script>
import { getDoctorInfo, uploadQualification, getCareerList, getTitleList, getMerchantSearchList } from '@/api/doctor';
import { uploadDoctorImage } from '@/utils/doctorRequest';
import { normalizeDoctorInfo } from '@/utils/siteLogo';

const AUDIT_STATUS_MAP = { 0: '未提交', 1: '已通过', 2: '审核中' };

export default {
	name: 'AuthQualification',
	data() {
		return {
			activeTab: 0,
			auditStatus: 0,
			recordStatus: '未备案',
			uploadingField: '',
			submitting: false,
			/** 字段名与 /api/doctor/qualification POST 体完全对齐 */
			form: {
				picture: '',
				name: '',
				hospitalName: '',
				hospitalCareer: '',
				hospitalTitle: '',
				hospitalSub: '',
				selfInfo: '',
				hospitalDomain: '',
				idcardNum: '',
				idcardObverseImageUrl: '',
				idcardReverseImageUrl: '',
				licenseImageUrl: '',
				licenseLocationImageUrl: '',
				hospitalTitleImageUrl: '',
				qualificationImageUrl: '',
				graduateSchoolImageUrl: '',
				signatureImageUrl: '',
				type: 1
			},
		careerOptions: [],
		titleOptions: [],
		hospitalSearchResults: [],
		departmentSearchResults: [],
		selectedMerchant: { id: 0, name: '', avatar: '', starLevel: 0 },
		filingInfo: { mchId: 0, merchantName: '', merchantAvatar: '' },
		filingSubmitting: false
		};
	},
	computed: {
		basicStatus() {
			return AUDIT_STATUS_MAP[this.auditStatus] || '未提交';
		}
	},
	onLoad(options) {
		if (options && options.tab) {
			this.activeTab = Number(options.tab);
		}
		this.loadDoctorInfo();
		this.loadCareerOptions();
		this.loadTitleOptions();
	},
	onUnload() {
		uni.$off('hospital-selected');
		uni.$off('department-selected');
		uni.$off('merchant-selected');
	},
	methods: {
		loadDoctorInfo() {
			getDoctorInfo().then(res => {
				const d = normalizeDoctorInfo(res.data || {});
			this.auditStatus = d.auditStatus || 0;
			this.filingInfo.mchId = d.mchId || 0;
			if (d.mchId) {
				this.recordStatus = '已备案';
			}
			// 回填表单（优先已保存值）
				const fields = [
					'picture', 'name', 'hospitalName', 'hospitalCareer', 'hospitalTitle',
					'hospitalSub', 'selfInfo', 'hospitalDomain', 'idcardNum',
					'idcardObverseImageUrl', 'idcardReverseImageUrl',
					'licenseImageUrl', 'hospitalTitleImageUrl',
					'qualificationImageUrl', 'graduateSchoolImageUrl', 'signatureImageUrl',
					'type'
				];
				fields.forEach(k => {
					if (d[k] !== undefined && d[k] !== null && d[k] !== '') {
						this.form[k] = d[k];
					}
				});
				// 执业证地点页字段（详情接口 typo 为 licenseLocalionImageUrl，提交接口为 licenseLocationImageUrl）
				if (d.licenseLocalionImageUrl) {
					this.form.licenseLocationImageUrl = d.licenseLocalionImageUrl;
				}
			}).catch(() => {
				// 未登录或网络失败，静默处理，不影响填写
			});
		},

		uploadAvatar() {
			this.pickImage('picture');
		},

		/**
		 * 选图 → 立即上传到 /api/doctor/upload/image → 拿到 URL 存入 form
		 */
		pickImage(field) {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const tempPath = res.tempFilePaths[0];
					this.uploadingField = field;
					uploadDoctorImage(tempPath).then(res => {
						this.form[field] = res.data.url;
					}).catch(err => {
						uni.showToast({ title: String(err) || '上传失败', icon: 'none' });
					}).finally(() => {
						this.uploadingField = '';
					});
				}
			});
		},

		loadCareerOptions() {
			getCareerList().then(res => {
				this.careerOptions = (res.data || []).filter(item => item.status === 1);
			}).catch(() => {});
		},

		loadTitleOptions() {
			getTitleList().then(res => {
				this.titleOptions = (res.data || []).filter(item => item.status === 1);
			}).catch(() => {});
		},

		pickField(field) {
			if (field === 'hospitalCareer') {
				const names = this.careerOptions.map(o => o.name);
				if (!names.length) return uni.showToast({ title: '职业列表加载中，请稍候', icon: 'none' });
				uni.showActionSheet({
					itemList: names,
					success: (res) => { this.form.hospitalCareer = names[res.tapIndex]; }
				});
			} else if (field === 'hospitalTitle') {
				const names = this.titleOptions.map(o => o.name);
				if (!names.length) return uni.showToast({ title: '职称列表加载中，请稍候', icon: 'none' });
				uni.showActionSheet({
					itemList: names,
					success: (res) => { this.form.hospitalTitle = names[res.tapIndex]; }
				});
			}
		},

		goHospitalSearch() {
			uni.$on('hospital-selected', (data) => {
				this.form.hospitalName = data.name || '';
				this.form.hospitalLevel = data.level || '';
				uni.$off('hospital-selected');
			});
			uni.navigateTo({ url: '/pages/auth/hospital-search' });
		},

		goDepartmentSearch() {
			uni.$on('department-selected', (data) => {
				this.form.hospitalSub = data.name || '';
				uni.$off('department-selected');
			});
			uni.navigateTo({ url: '/pages/auth/department-search' });
		},

		goMerchantSearch() {
			uni.$on('merchant-selected', (data) => {
				this.selectedMerchant = {
					id: data.id || 0,
					name: data.name || '',
					avatar: data.avatar || '',
					starLevel: data.starLevel || 0
				};
				uni.$off('merchant-selected');
			});
			uni.navigateTo({ url: '/pages/auth/merchant-search' });
		},

		submitFiling() {
			if (!this.selectedMerchant.id) {
				return uni.showToast({ title: '请选择门店', icon: 'none' });
			}
			this.filingSubmitting = true;
			uni.showLoading({ title: '提交中...' });
			// TODO: 替换为实际的备案提交接口
			setTimeout(() => {
				uni.hideLoading();
				this.filingSubmitting = false;
				this.filingInfo.mchId = this.selectedMerchant.id;
				this.filingInfo.merchantName = this.selectedMerchant.name;
				this.filingInfo.merchantAvatar = this.selectedMerchant.avatar;
				this.recordStatus = '已备案';
				uni.showToast({ title: '备案提交成功，等待审核', icon: 'none' });
			}, 600);
		},

		submitForm() {
			if (!this.form.name)                        return uni.showToast({ title: '请输入姓名', icon: 'none' });
			if (!this.form.hospitalCareer)              return uni.showToast({ title: '请选择职业', icon: 'none' });
			if (!this.form.hospitalTitle)               return uni.showToast({ title: '请选择职称', icon: 'none' });
			if (!this.form.hospitalSub)                 return uni.showToast({ title: '请选择科室', icon: 'none' });
			if (!this.form.selfInfo || this.form.selfInfo.length < 20)
				return uni.showToast({ title: '请填写个人简介（至少20字）', icon: 'none' });
			if (!this.form.hospitalDomain.trim())       return uni.showToast({ title: '请填写擅长方向', icon: 'none' });
			if (!this.form.idcardNum)                   return uni.showToast({ title: '请输入身份证号', icon: 'none' });
			if (!this.form.idcardObverseImageUrl || !this.form.idcardReverseImageUrl)
				return uni.showToast({ title: '请上传身份证正反面', icon: 'none' });
			if (!this.form.licenseImageUrl)             return uni.showToast({ title: '请上传医师执业证（编码页）', icon: 'none' });
			if (!this.form.licenseLocationImageUrl)     return uni.showToast({ title: '请上传医师执业证（执业地点页）', icon: 'none' });
			if (!this.form.hospitalTitleImageUrl)       return uni.showToast({ title: '请上传职称证', icon: 'none' });
			if (this.uploadingField)                    return uni.showToast({ title: '图片上传中，请稍候', icon: 'none' });

			this.submitting = true;
			uni.showLoading({ title: '提交中...' });

			uploadQualification(this.form).then(() => {
				uni.hideLoading();
				this.submitting = false;
				this.auditStatus = 2;
				uni.showToast({ title: '提交成功，请等待审核', icon: 'none' });
				setTimeout(() => uni.navigateBack(), 1500);
			}).catch(err => {
				uni.hideLoading();
				this.submitting = false;
				uni.showToast({ title: String(err) || '提交失败，请重试', icon: 'none' });
			});
		}
	}
};
</script>

<style scoped lang="scss">
$primary: $theme-color;
$required: #E93323;

.qual-page {
	min-height: 100vh;
	background: #F5F6FA;
	padding-bottom: 160rpx;
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

// 执业证子标签
.cert-upload-labels {
	display: flex;
	gap: 20rpx;
	margin-top: 10rpx;
}

.cert-upload-label {
	width: 200rpx;
	text-align: center;
	font-size: 22rpx;
	color: #999;
}

// 上传中状态
.cert-upload-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	text { font-size: 24rpx; color: #999; }
}

.avatar-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.loading-dot {
	font-size: 36rpx;
	color: #ccc;
	letter-spacing: 4rpx;
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

// 备案认证
.filed-merchant {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
}

.filed-avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
	background: #eee;
}

.filed-info {
	flex: 1;
}

.filed-name {
	display: block;
	font-size: 30rpx;
	font-weight: 500;
	color: #333;
}

.filed-status {
	display: inline-flex;
	align-items: center;
	font-size: 22rpx;
	color: $primary;
	background: rgba(86, 194, 184, 0.08);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	margin-top: 10rpx;
}

.filed-dot {
	width: 10rpx;
	height: 10rpx;
	border-radius: 50%;
	background: $primary;
	margin-right: 8rpx;
}

.section-hint {
	display: block;
	font-size: 22rpx;
	color: #999;
	margin-top: -12rpx;
	margin-bottom: 20rpx;
}

.filing-preview {
	display: flex;
	align-items: center;
	padding: 16rpx 0;
}

.preview-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
	background: #eee;
}

.preview-info {
	flex: 1;
}

.preview-name {
	display: block;
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
}

.preview-star {
	margin-top: 8rpx;
	.star { font-size: 22rpx; color: #FAAD14; }
}

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

		&.disabled { opacity: 0.6; }
	}
}
</style>
