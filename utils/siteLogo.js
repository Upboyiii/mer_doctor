/**
 * 全站登录页 / 我的 / 关于我们 等与登录顶图一致的 Logo 地址
 * 与 loginConfigApi 返回字段对齐：优先 logo，其次 mobileLoginLogo，缺省为本地图
 */
export const DEFAULT_SITE_LOGO = '/static/images/logo2.png';

export function normalizeLogoFromConfig(data) {
	if (!data || typeof data !== 'object') return DEFAULT_SITE_LOGO;
	const u = data.logo || data.mobileLoginLogo;
	return u && String(u).trim() ? String(u).trim() : DEFAULT_SITE_LOGO;
}
