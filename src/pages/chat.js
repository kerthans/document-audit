import React, { useState, useEffect } from 'react';
import SEOHead from '../components/common/SEOHead';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import { PlusCircle, Trash2, AlertCircle, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import useChat from '../hooks/useChat';

// 服务器状态组件
const ServerStatus = ({ status, error }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: '服务器已连接',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'connecting':
        return {
          icon: <Wifi className="w-5 h-5 text-blue-500 animate-pulse" />,
          text: '正在连接服务器...',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'error':
        return {
          icon: <WifiOff className="w-5 h-5 text-red-500" />,
          text: error || '服务器连接失败',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
          text: '未知状态',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700'
        };
    }
  };

  const { icon, text, bgColor, borderColor, textColor } = getStatusInfo();

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 py-2 px-4 ${bgColor} ${textColor} rounded-lg shadow-md border ${borderColor}`}>
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default function ChatPage() {
  const [chatInstances, setChatInstances] = useState([{ id: 'default', name: '新对话' }]);
  const [activeChatId, setActiveChatId] = useState('default');
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('connecting');
  const [serverError, setServerError] = useState(null);

  // 检查服务器连接状态
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/health', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          setServerStatus('connected');
          setServerError(null);
        } else {
          setServerStatus('error');
          setServerError(`服务器返回错误: ${response.status}`);
        }
      } catch (err) {
        setServerStatus('error');
        setServerError(err.name === 'TimeoutError' 
          ? '连接超时，服务器未响应' 
          : `连接失败: ${err.message}`);
      }
    };

    checkServerStatus();
    const intervalId = setInterval(checkServerStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat = { id: newId, name: '新对话' };
    setChatInstances([...chatInstances, newChat]);
    setActiveChatId(newId);
    clearMessages();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <SEOHead title="AI聊天助手 | 智能对话" description="与我们的AI助手进行实时对话，获取即时回答和帮助" />
      
      <div className="absolute inset-0 bg-gray-50 flex flex-col">
        {/* 顶部标题 */}
        <div className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">AI聊天助手</h1>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              aria-label="清空对话"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">清空对话</span>
            </button>
          )}
        </div>
        
        {/* 主体内容 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 侧边栏 - 桌面版 */}
          <div className="hidden md:block w-64 border-r border-gray-200 bg-white h-full overflow-y-auto">
            <div className="p-4">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#5046e5] hover:bg-[#4037cc] text-white rounded-lg transition-colors"
              >
                <PlusCircle size={18} />
                <span>新建对话</span>
              </button>
            </div>
            
            <div className="mt-4">
              {chatInstances.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left px-4 py-3 flex items-center ${
                    activeChatId === chat.id
                      ? 'bg-[#f4f4f8] text-[#5046e5]'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="truncate flex-1">{chat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 聊天区域 */}
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-hidden relative">
              <ChatContainer messages={messages} isLoading={isLoading} />
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-white">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* 移动版菜单按钮 */}
      <div className="md:hidden fixed bottom-20 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#5046e5] text-white p-3 rounded-full shadow-lg"
        >
          <PlusCircle size={24} />
        </button>
        
        {isMobileMenuOpen && (
          <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-2 w-48 border border-gray-200">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 rounded-lg"
            >
              <PlusCircle size={18} />
              <span>新建对话</span>
            </button>
          </div>
        )}
      </div>

      {/* 服务器状态提示 */}
      <ServerStatus status={serverStatus} error={serverError} />
      
      {/* 错误提示 */}
      {error && (
        <div className="fixed bottom-20 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-md max-w-xs">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">消息发送失败</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}