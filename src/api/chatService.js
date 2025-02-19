/**
 * Chat API服务
 * 
 * 该模块负责处理与聊天后端API的所有通信
 */

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from '../config/api.config';

/**
 * 发送消息到AI聊天服务
 * 
 * @param {string} message - 用户发送的消息
 * @param {Array} history - 历史消息记录
 * @returns {Promise<Object>} - 包含AI响应的Promise
 */
export async function sendChatMessage(message, history) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP错误! 状态: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('聊天API调用失败:', error);
    
    // 针对不同错误类型返回友好错误消息
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(ERROR_MESSAGES.CONNECTION_ERROR);
    }
    
    throw error;
  }
}

/**
 * 上传文件到AI聊天服务
 * 
 * @param {File} file - 要上传的文件对象
 * @returns {Promise<Object>} - 包含上传结果的Promise
 */
export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `文件上传失败! 状态: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}

/**
 * 获取聊天历史记录
 * 
 * @param {string} sessionId - 可选的会话ID
 * @returns {Promise<Array>} - 包含聊天历史的Promise
 */
export async function getChatHistory(sessionId = null) {
  try {
    const url = sessionId 
      ? `${API_BASE_URL}${API_ENDPOINTS.HISTORY}?sessionId=${sessionId}`
      : `${API_BASE_URL}${API_ENDPOINTS.HISTORY}`;
      
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`获取历史记录失败! 状态: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('获取聊天历史失败:', error);
    throw error;
  }
}

/**
 * 创建新的聊天会话
 * 
 * @returns {Promise<Object>} - 包含新会话信息的Promise
 */
export async function createChatSession() {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SESSIONS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`创建会话失败! 状态: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('创建聊天会话失败:', error);
    throw error;
  }
}

/**
 * 删除聊天会话
 * 
 * @param {string} sessionId - 要删除的会话ID
 * @returns {Promise<Object>} - 操作结果
 */
export async function deleteChatSession(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SESSIONS}/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`删除会话失败! 状态: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('删除聊天会话失败:', error);
    throw error;
  }
}