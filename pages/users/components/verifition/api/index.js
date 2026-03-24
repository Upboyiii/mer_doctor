/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

import request from '../utils/axios'; // 组件内部封装的axios
// import request from "@/api/axios.js"       //调用项目封装的axios


/**
 * 滑块验证（/api/front/safety/check 暂注释）
 */
// export function ajcaptchaCheck(data) {
// 	return request.post("safety/check", data, { noAuth: true });
// }
export function ajcaptchaCheck(data) {
	return Promise.resolve({ repCode: '0000' });
}

/**
 * 滑块信息（/api/front/safety/get 暂注释）
 */
// export function getAjcaptcha(data) {
// 	return request.post("safety/get", data, { noAuth: true });
// }
export function getAjcaptcha(data) {
	return Promise.resolve({ repCode: '0000', repData: {} });
}
