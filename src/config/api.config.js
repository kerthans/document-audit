/**
 * API配置文件
 * 集中管理API相关配置，方便在不同环境中切换
 */

// 开发环境API基础URL
export const DEV_API_URL = 'http://localhost:8888';

// 生产环境API基础URL  
export const PROD_API_URL = 'https://api.your-production-domain.com';

// 当前环境的API基础URL
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? PROD_API_URL 
    : DEV_API_URL;

// API端点配置
export const API_ENDPOINTS = {
  CHAT: '/api/chat',        // 聊天消息接口
  UPLOAD: '/api/upload',    // 文件上传接口
  HISTORY: '/api/history',  // 聊天历史记录接口
  SESSIONS: '/api/sessions' // 会话管理接口
};

// API请求超时时间 (毫秒)
export const API_TIMEOUT = 30000;

// API错误消息
export const ERROR_MESSAGES = {
  CONNECTION_ERROR: '连接服务器失败，请检查您的网络连接',
  TIMEOUT_ERROR: '请求超时，服务器可能暂时无法响应',
  SERVER_ERROR: '服务器发生错误，请稍后再试',
  UNKNOWN_ERROR: '发生未知错误'
};