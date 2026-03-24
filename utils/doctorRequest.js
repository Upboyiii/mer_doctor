/**
 * 医生端专用 HTTP 工具
 * 所有路径前缀为 /api/doctor/（与旧版 /api/front/ 并行，不改现有逻辑）
 */
import { HTTP_REQUEST_URL, HEADER, TOKENNAME } from '@/config/app';
import { toLogin } from '../libs/login';
import store from '../store';

const BASE = HTTP_REQUEST_URL + '/api/doctor/';

function doctorRequest(url, method, data, options = {}) {
	const { noAuth = false } = options;

	if (!noAuth && !store.state.app.token) {
		toLogin();
		return Promise.reject({ msg: '未登录' });
	}

	const header = Object.assign({}, HEADER);
	if (store.state.app.token) {
		header[TOKENNAME] = store.state.app.token;
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE + url,
			method: method || 'GET',
			header,
			data: data || {},
			success: (res) => {
				const d = res.data;
				if (!d) { reject('响应为空'); return; }
				if (d.code === 200) {
					resolve(d);
				} else if ([410000, 410001, 410002, 401, 402].indexOf(d.code) !== -1) {
					store.commit('LOGOUT');
					toLogin();
					reject(d);
				} else {
					reject(d.message || '系统错误');
				}
			},
			fail: () => reject('网络请求失败')
		});
	});
}

/**
 * 上传图片（multipart/form-data）
 * 返回 { code, data: { url, fileName, ... }, message }
 */
export function uploadDoctorImage(filePath) {
	return new Promise((resolve, reject) => {
		const header = { [TOKENNAME]: store.state.app.token };
		uni.uploadFile({
			url: BASE + 'upload/image',
			filePath,
			name: 'multipart',
			header,
			success: (res) => {
				let d;
				try { d = JSON.parse(res.data); } catch (e) { reject('解析失败'); return; }
				if (d.code === 200) resolve(d);
				else reject(d.message || '上传失败');
			},
			fail: () => reject('上传失败')
		});
	});
}

const dr = {};
['get', 'post', 'put', 'delete'].forEach((m) => {
	dr[m] = (url, data, opts) => doctorRequest(url, m, data, opts || {});
});

export default dr;
