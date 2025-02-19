import React from 'react';

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  
  return (
    <div 
      className={`mb-6 ${
        role === 'user' 
          ? 'flex justify-end' 
          : 'flex justify-start'
      } w-full`}
    >
      <div 
        className={`px-4 py-3 rounded-2xl max-w-[85%] ${
          role === 'user' 
            ? 'bg-[#5046e5] text-white rounded-br-none' 
            : role === 'system'
              ? 'bg-red-500 text-white'
              : 'bg-[#ededed] text-gray-800 dark:text-gray-800 rounded-bl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;