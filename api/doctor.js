/**
 * 医生端接口（路径前缀 /api/doctor/）
 * 对应接口文档：接口.md
 */
import dr from '@/utils/doctorRequest';

// ────────────────────────────────────────────────
// 登录 / 注册 / Token
// ────────────────────────────────────────────────

/**
 * 获取登录配置
 * GET /api/doctor/login/config
 */
export function loginConfigApi() {
	return dr.get('login/config', {}, { noAuth: true });
}

/**
 * 手机号 + 验证码登录
 * POST /api/doctor/login/mobile/captcha
 * @param {{ phone, captcha, spreadPid? }} data
 */
export function loginMobile(data) {
	return dr.post('login/mobile/captcha', data, { noAuth: true });
}

/**
 * 手机号 + 密码登录
 * POST /api/doctor/login/mobile/password
 * @param {{ phone, password, spreadPid? }} data
 */
export function loginH5(data) {
	return dr.post('login/mobile/password', data, { noAuth: true });
}

/**
 * 发送短信验证码（接口文档未独立列出，按项目惯例使用 send/code）
 * POST /api/doctor/login/send/code
 */
export function sendCode(phone) {
	return dr.post('login/send/code', { phone }, { noAuth: true });
}

/**
 * 退出登录
 * GET /api/doctor/login/logout
 */
export function logoutApi() {
	return dr.get('login/logout');
}

/**
 * 校验 token 是否有效
 * POST /api/doctor/login/token/is/exist
 */
export function tokenIsExistApi() {
	return dr.post('login/token/is/exist');
}

// ────────────────────────────────────────────────
// 医生信息
// ────────────────────────────────────────────────

/**
 * 获取医生技师信息详情
 * GET /api/doctor/info
 */
export function getDoctorInfo() {
	return dr.get('info');
}

/**
 * 上传资质认证
 * POST /api/doctor/qualification
 * 字段见接口.md 生成资质上传对象
 */
export function uploadQualification(data) {
	return dr.post('qualification', data);
}
