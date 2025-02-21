// frontend/src/components/chat/TypewriterText.jsx
import React, { useState, useEffect, useRef } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

const TypewriterText = ({ content, role, speed = 10 }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const contentRef = useRef(content)
  const timeoutRef = useRef(null)

  // 当内容更新时重置状态
  useEffect(() => {
    if (content !== contentRef.current) {
      contentRef.current = content
      setDisplayedContent('')
      setIsComplete(false)
    }
  }, [content])

  // 处理打字机效果
  useEffect(() => {
    if (displayedContent.length < content.length && !isComplete) {
      const nextChar = content[displayedContent.length]
      
      // 处理 Markdown 特殊字符序列
      let charsToAdd = nextChar
      const specialSequences = [
        '```', '**', '__', '*', '_', '#', '>', '|', '-', 
        '$\\mathrm{', '}$', '$$', '\n'
      ]
      
      for (const seq of specialSequences) {
        if (content.slice(displayedContent.length).startsWith(seq)) {
          charsToAdd = seq
          break
        }
      }

      // 处理代码块
      if (displayedContent.endsWith('\n```')) {
        const codeBlockEnd = content.indexOf('```', displayedContent.length)
        if (codeBlockEnd !== -1) {
          charsToAdd = content.slice(displayedContent.length, codeBlockEnd + 3)
        }
      }
      
      // 处理表格行
      if (content.slice(displayedContent.length).startsWith('|')) {
        const lineEnd = content.indexOf('\n', displayedContent.length)
        if (lineEnd !== -1) {
          charsToAdd = content.slice(displayedContent.length, lineEnd + 1)
        }
      }

      // 处理数学公式
      if (content.slice(displayedContent.length).startsWith('$')) {
        const formulaEnd = content.indexOf('$', displayedContent.length + 1)
        if (formulaEnd !== -1) {
          charsToAdd = content.slice(displayedContent.length, formulaEnd + 1)
        }
      }

      timeoutRef.current = setTimeout(() => {
        setDisplayedContent(prev => prev + charsToAdd)
      }, speed)
    } else if (displayedContent.length >= content.length && !isComplete) {
      setIsComplete(true)
    }

    // 清理定时器
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [displayedContent, content, speed, isComplete])

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <MarkdownRenderer content={displayedContent} role={role} />
    </div>
  )
}

export default TypewriterText