import { useState, useCallback } from 'react';

// API 基础URL
const API_BASE_URL = 'http://localhost:8000';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    
    // 添加用户消息
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 尝试连接后端API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
        signal: controller.signal
      }).catch(err => {
        // 将网络错误转换为自定义错误对象
        if (err.name === 'AbortError') {
          throw new Error('请求超时，服务器响应时间过长');
        }
        throw new Error(`网络错误: ${err.message}`);
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMsg = `服务器错误 (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (e) {
          // 无法解析错误响应，使用默认错误消息
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      // 添加AI响应
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || '抱歉，服务器返回了空响应。'
      }]);
      return data.response;
    } catch (err) {
      console.error('聊天请求失败:', err);
      setError(err.message || '发送消息时出现未知错误');
      
      // 如果是网络连接问题，使用本地模拟响应
      if (err.message.includes('网络错误') || err.message.includes('请求超时')) {
        const fallbackMessage = { 
          role: 'assistant', 
          content: '看起来服务器连接出现问题。这是一个离线回复：我理解您的问题，但目前无法连接到服务器。请检查您的网络连接或稍后再试。'
        };
        setMessages(prev => [...prev, fallbackMessage]);
        return fallbackMessage.content;
      }
      
      // 添加系统错误消息
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '抱歉，发送消息时出现错误。请稍后再试。' 
      }]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}