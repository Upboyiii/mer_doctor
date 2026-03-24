/**
 * 全站 Logo 地址处理
 * 接口 /api/doctor/login/config 返回相对路径，需拼上服务器域名
 */
import { HTTP_REQUEST_URL } from '@/config/app';

export const DEFAULT_SITE_LOGO = '/static/images/logo2.png';

/**
 * 将接口返回的相对路径补全为完整 URL
 * 如果已经是 http/https 开头则直接返回
 */
export function buildImgUrl(path) {
	if (!path || !String(path).trim()) return '';
	const p = String(path).trim();
	if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/static/')) {
		return p;
	}
	const base = HTTP_REQUEST_URL.replace(/\/$/, '');
	return base + '/' + p.replace(/^\//, '');
}

/**
 * 从 loginConfig 响应中提取 logo（PC端用）
 */
export function getLogoUrl(data) {
	if (!data || typeof data !== 'object') return DEFAULT_SITE_LOGO;
	const url = buildImgUrl(data.logo);
	return url || DEFAULT_SITE_LOGO;
}

/**
 * 从 loginConfig 响应中提取 mobileLoginLogo（移动端登录页用）
 */
export function getMobileLoginLogoUrl(data) {
	if (!data || typeof data !== 'object') return DEFAULT_SITE_LOGO;
	const url = buildImgUrl(data.mobileLoginLogo);
	return url || DEFAULT_SITE_LOGO;
}

/**
 * 通用：优先取 mobileLoginLogo，其次 logo，都没有则缺省本地图
 * 兼容旧调用
 */
export function normalizeLogoFromConfig(data) {
	if (!data || typeof data !== 'object') return DEFAULT_SITE_LOGO;
	const url = buildImgUrl(data.mobileLoginLogo) || buildImgUrl(data.logo);
	return url || DEFAULT_SITE_LOGO;
}

// ─── 医生信息图片字段 ───────────────────────────────────────────────

/**
 * 需要补全域名的医生信息图片字段
 */
const DOCTOR_IMG_FIELDS = [
	'picture', 'avatar',
	'idcardObverseImageUrl', 'idcardReverseImageUrl',
	'licenseImageUrl', 'licenseLocalionImageUrl', 'licenseLocationImageUrl',
	'hospitalTitleImageUrl', 'qualificationImageUrl',
	'graduateSchoolImageUrl', 'signatureImageUrl',
];

/**
 * 将 doctor info / login response 中所有图片字段的相对路径补全为完整 URL
 * 不修改原对象，返回新对象
 */
export function normalizeDoctorInfo(data) {
	if (!data || typeof data !== 'object') return data;
	const result = { ...data };
	for (const field of DOCTOR_IMG_FIELDS) {
		if (result[field]) {
			result[field] = buildImgUrl(result[field]);
		}
	}
	return result;
}
