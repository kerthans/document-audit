// config/api.config.js
export const API_BASE_URL = 'http://localhost:8888';

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  UPLOAD: '/api/upload',
  HISTORY: '/api/history',
  SESSIONS: '/api/sessions'
};

export const ERROR_MESSAGES = {
  CONNECTION_ERROR: '连接服务器失败，请检查网络连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  TIMEOUT_ERROR: '请求超时，服务器响应时间过长',
  INVALID_RESPONSE: '服务器返回数据格式错误',
  UPLOAD_ERROR: '文件上传失败'
};