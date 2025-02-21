// frontend/src/components/chat/MarkdownRenderer.jsx
import React from 'react'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown'

const MarkdownComponents = (role, isReference = false) => {
  // 基础样式配置
  const baseStyles = {
    h1: 'font-bold my-4 border-b pb-2 border-gray-200',
    h2: 'font-bold my-3',
    h3: 'font-bold my-2',
    h4: 'font-semibold my-2',
    ul: 'list-disc ml-6 space-y-1 my-2',
    ol: 'list-decimal ml-6 space-y-1 my-2',
    li: 'ml-2 leading-relaxed',
    p: role === 'quote' ? 'my-1.5 text-sm leading-relaxed' : 'my-2 leading-relaxed',
    strong: role === 'user' 
      ? 'font-bold text-white' 
      : role === 'quote'
        ? 'font-semibold text-gray-700'
        : 'font-bold text-[#5046e5]',
    inlineCode: role === 'user' 
      ? 'px-1.5 py-0.5 rounded font-mono text-sm bg-white/20' 
      : 'px-1.5 py-0.5 rounded font-mono text-sm bg-gray-100',
    code: 'block bg-gray-900 text-gray-100 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto',
    blockquote: 'border-l-4 border-gray-200 pl-4 my-4 italic text-gray-700',
    img: 'max-w-full h-auto rounded-lg my-2',
    a: 'text-blue-600 hover:underline',
    
    // 增强的表格样式
    table: role === 'quote' 
      ? 'min-w-full text-sm border-collapse my-2'
      : 'min-w-full border-collapse my-3',
    tableWrapper: role === 'quote'
      ? 'overflow-x-auto rounded-lg border border-gray-100 bg-white/90 my-2 shadow-sm'
      : 'overflow-x-auto rounded-lg border border-gray-200 bg-white my-3 shadow-sm',
    thead: role === 'quote' ? 'bg-gray-50/80' : 'bg-gray-50',
    tr: role === 'quote'
      ? 'hover:bg-gray-50/50 transition-colors even:bg-gray-50/30'
      : 'hover:bg-gray-50 transition-colors even:bg-gray-50/50',
    th: role === 'quote'
      ? 'px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100'
      : 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200',
    td: role === 'quote'
      ? 'px-3 py-1.5 text-sm border-b border-gray-100 align-top whitespace-normal break-words'
      : 'px-4 py-2 text-sm border-b border-gray-200 align-top whitespace-normal break-words'
  }

  return {
    h1: ({ node, ...props }) => (
      <h1 {...props} style={{ ...props.style }} className={baseStyles.h1} />
    ),
    h2: ({ node, ...props }) => (
      <h2 {...props} style={{ ...props.style }} className={baseStyles.h2} />
    ),
    h3: ({ node, ...props }) => (
      <h3 {...props} style={{ ...props.style }} className={baseStyles.h3} />
    ),
    h4: ({ node, ...props }) => (
      <h4 {...props} style={{ ...props.style }} className={baseStyles.h4} />
    ),
    ul: ({ node, ...props }) => (
      <ul {...props} style={{ ...props.style }} className={baseStyles.ul} />
    ),
    ol: ({ node, ...props }) => (
      <ol {...props} style={{ ...props.style }} className={baseStyles.ol} />
    ),
    li: ({ node, ...props }) => (
      <li {...props} style={{ ...props.style }} className={baseStyles.li} />
    ),
    p: ({ node, ...props }) => (
      <p {...props} style={{ ...props.style }} className={baseStyles.p} />
    ),
    strong: ({ node, ...props }) => (
      <strong {...props} style={{ ...props.style }} className={baseStyles.strong} />
    ),
    code: ({ node, inline, ...props }) => {
      const codeClass = inline ? baseStyles.inlineCode : baseStyles.code
      return <code {...props} style={{ ...props.style }} className={codeClass} />
    },
    table: ({ node, ...props }) => (
      <div className={baseStyles.tableWrapper}>
        <table {...props} style={{ ...props.style }} className={baseStyles.table} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead {...props} style={{ ...props.style }} className={baseStyles.thead} />
    ),
    tr: ({ node, ...props }) => (
      <tr {...props} style={{ ...props.style }} className={baseStyles.tr} />
    ),
    th: ({ node, ...props }) => (
      <th {...props} style={{ ...props.style }} className={baseStyles.th} scope="col" />
    ),
    td: ({ node, ...props }) => (
      <td {...props} style={{ ...props.style }} className={baseStyles.td} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote {...props} style={{ ...props.style }} className={baseStyles.blockquote} />
    ),
    img: ({ node, ...props }) => (
      <img {...props} style={{ ...props.style }} className={baseStyles.img} alt={props.alt || ''} />
    ),
    a: ({ node, ...props }) => (
      <a 
        {...props} 
        style={{ ...props.style }} 
        className={baseStyles.a} 
        target="_blank" 
        rel="noopener noreferrer" 
      />
    )
  }
}

const MarkdownRenderer = ({ content, role, isReference = false }) => {
  return (
    <div className={`prose prose-sm max-w-none ${isReference ? 'prose-quotation' : 'dark:prose-invert'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={MarkdownComponents(role, isReference)}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer