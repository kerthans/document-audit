// hooks/useChat.js
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8888';

// 简化后的数据提取函数
const extractResponseData = (response) => {
  try {
    if (!response || typeof response !== 'object') {
      throw new Error('响应数据格式错误');
    }

    // 检查响应状态
    if (response.code !== 200) {
      throw new Error(response.message || '请求失败');
    }

    return {
      answer: typeof response.answer === 'string' 
        ? response.answer.replace(/^优化后的回答：\n*/, '').trim()
        : typeof response.answer?.content === 'string'
          ? response.answer.content.replace(/^优化后的回答：\n*/, '').trim()
          : '无法解析回答内容',
      references: response.knowledge_base_content || '',
      metadata: {
        model: response.metadata?.model || 'unknown',
        usage: response.metadata?.usage || {}
      },
      timestamp: response.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error('解析响应数据出错:', error);
    return {
      answer: '抱歉，解析响应时出现错误',
      references: '',
      metadata: {
        model: 'unknown',
        usage: {}
      },
      timestamp: new Date().toISOString()
    };
  }
};

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);

      // 添加加载消息
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '正在思考中...',
        isLoading: true,
        timestamp: new Date().toISOString()
      }]);

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      // 移除加载消息
      setMessages(prev => prev.filter(msg => !msg.isLoading));

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const rawData = await response.json();
      const { answer, references, metadata, timestamp } = extractResponseData(rawData);

      const assistantMessage = {
        role: 'assistant',
        content: answer,
        references,
        metadata,
        timestamp
      };

      setMessages(prev => [...prev.filter(msg => !msg.isLoading), assistantMessage]);

    } catch (err) {
      console.error('发送消息失败:', err);
      setError(err.message);

      setMessages(prev => [...prev.filter(msg => !msg.isLoading), {
        role: 'system',
        content: `发送失败: ${err.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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