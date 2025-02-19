import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const LoadingIndicator = () => (
  <div className="flex space-x-2 justify-center items-center my-6">
    <div className="w-2 h-2 bg-[#5046e5]/50 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-[#5046e5]/50 rounded-full animate-bounce delay-75"></div>
    <div className="w-2 h-2 bg-[#5046e5]/50 rounded-full animate-bounce delay-150"></div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4">
    <div className="mb-6 p-5 rounded-full bg-[#f4f4f8]">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5046e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    </div>
    <h3 className="text-xl font-medium mb-3 text-gray-800">开始一次对话</h3>
    <p className="text-base text-gray-500 max-w-md mb-8">
      向AI助手提问任何问题，获取即时解答和帮助。尝试问问天气、编程问题或创意建议。
    </p>
  </div>
);

const ChatContainer = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="py-4 space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>
      )}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} className="pt-2" />
    </div>
  );
};

export default ChatContainer;