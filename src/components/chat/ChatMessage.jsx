// frontend/src/components/chat/ChatMessage.jsx
import React from 'react'
import { User, Bot, AlertCircle } from 'lucide-react'
import TypewriterText from './TypewriterText'
import MarkdownRenderer from './MarkdownRenderer'
import References from './References'

// 加载动画组件
const LoadingDots = () => (
  <div className="flex items-center gap-1.5 py-2">
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
  </div>
)

// 角色图标组件
const RoleIcon = ({ role }) => {
  switch (role) {
    case 'user':
      return <User className="w-6 h-6 text-white" />
    case 'assistant':
      return <Bot className="w-6 h-6 text-[#5046e5]" />
    case 'system':
      return <AlertCircle className="w-6 h-6 text-red-500" />
    default:
      return null
  }
}

// 文本格式化函数
const formatText = (text) => {
  if (!text) return ''
  if (typeof text === 'object') return JSON.stringify(text, null, 2)

  return text
    // 清理 HTML 标签和 Word 格式
    .replace(/<\/?(?:html|body)[^>]*>/g, '')
    .replace(/Version:\d+\.\d+\s+StartHTML:\d+\s+EndHTML:\d+\s+StartFragment:\d+\s+EndFragment:\d+/g, '')
    // 处理数学公式
    .replace(/\$\\mathrm{([^}]+)}\$/g, '$$$1$$')
    // 处理重复的数字和单位
    .replace(/(\d+)([a-zA-Z]+)\1\2/g, '$1$2')
    // 处理无序列表
    .replace(/^\s*[-*]\s+/gm, '- ')
    // 处理有序列表
    .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + ' ')
    // 处理表格对齐
    .replace(/\|\s*/g, '| ')
    .replace(/\s*\|/g, ' |')
    // 处理代码块
    .replace(/```(\w+)?\n/g, '```$1\n')
    // 优化空行
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const ChatMessage = ({ message }) => {
  const { 
    role, 
    content, 
    isLoading, 
    metadata, 
    timestamp, 
    references,
    isError
  } = message

  const formattedContent = formatText(content)

  // 根据角色和状态决定消息的样式
  const getMessageStyle = () => {
    if (role === 'user') {
      return 'bg-[#5046e5] text-white rounded-tr-none'
    }
    if (role === 'system' || isError) {
      return 'bg-red-50 text-red-700 rounded-tl-none'
    }
    return 'bg-gray-100 text-gray-800 rounded-tl-none'
  }

  return (
    <div 
      className={`mb-8 flex items-start gap-4 ${
        role === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* 角色图标 */}
      <div 
        className={`flex-shrink-0 rounded-full p-2 ${
          role === 'user' 
            ? 'bg-[#5046e5]' 
            : role === 'system'
              ? 'bg-red-100'
              : 'bg-gray-100'
        }`}
      >
        <RoleIcon role={role} />
      </div>

      {/* 消息内容 */}
      <div 
        className={`relative flex-1 ${
          role === 'user' ? 'mr-4' : 'ml-4'
        } max-w-[85%]`}
      >
        <div className={`p-6 rounded-2xl shadow-sm ${getMessageStyle()}`}>
          {isLoading ? (
            <LoadingDots />
          ) : role === 'assistant' && !isError ? (
            <>
              <div className="min-h-[20px]">
                <TypewriterText 
                  content={formattedContent} 
                  role={role}
                  speed={30}
                />
              </div>
              {references && (
                <References content={references} />
              )}
            </>
          ) : (
            <div className="min-h-[20px]">
              <MarkdownRenderer content={formattedContent} role={role} />
            </div>
          )}
        </div>

        {/* 时间和模型信息 */}
        {!isLoading && (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {new Date(timestamp).toLocaleString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
            {metadata?.model && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
                {metadata.model}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage