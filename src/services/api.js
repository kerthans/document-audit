// services/api.js
const API_BASE_URL = 'http://localhost:8888';

export async function sendChatMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || `请求失败(${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
}

export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || '文件上传失败');
    }

    return await response.json();
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}