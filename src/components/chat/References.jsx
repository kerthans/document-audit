// frontend/src/components/chat/References.jsx
import React, { useState } from 'react'
import { Quote, ChevronDown, ChevronUp } from 'lucide-react'

// 处理LaTeX数学表达式
const processMathExpression = (text) => {
  // 替换LaTeX数学表达式
  return text.replace(/\$([^$]+)\$/g, (match, p1) => {
    // 移除\mathrm并保留数值和单位
    return p1.replace(/\\mathrm{([^}]+)}/g, '$1')
  })
}

// 智能提取表格数据
const extractTableData = (content) => {
  // 1. 尝试匹配完整的HTML表格
  const fullTableMatch = content.match(/<table>[\s\S]*?<\/table>/)
  
  // 2. 如果找到完整表格，直接解析
  if (fullTableMatch) {
    const tableHtml = fullTableMatch[0]
    const rows = []
    
    // 提取所有行
    const rowMatches = tableHtml.match(/<tr>[\s\S]*?<\/tr>/g) || []
    
    rowMatches.forEach(row => {
      const cells = []
      const cellMatches = row.match(/<td>[\s\S]*?<\/td>/g) || []
      
      cellMatches.forEach(cell => {
        const cellContent = processMathExpression(cell
          .replace(/<\/?td>/g, '')
          .replace(/\\n/g, ' ')
          .trim())
        cells.push(cellContent)
      })
      
      if (cells.length > 0) {
        rows.push(cells)
      }
    })
    
    return rows.length > 0 ? rows : null
  }
  
  // 3. 如果没有找到完整表格，尝试从不完整的HTML中提取
  const incompleteTableMatch = content.match(/<tr>[\s\S]*?(?:<\/tr>|$)/)
  if (incompleteTableMatch) {
    const rows = []
    const rowMatches = content.match(/<tr>[\s\S]*?(?:<\/tr>|$)/g) || []
    
    rowMatches.forEach(row => {
      const cells = []
      const cellMatches = row.match(/<td>[\s\S]*?(?:<\/td>|$)/g) || []
      
      cellMatches.forEach(cell => {
        const cellContent = processMathExpression(cell
          .replace(/<\/?td>/g, '')
          .replace(/\\n/g, ' ')
          .trim())
        cells.push(cellContent)
      })
      
      if (cells.length > 0) {
        rows.push(cells)
      }
    })
    
    return rows.length > 0 ? rows : null
  }
  
  return null
}

// 清理引用标题
const cleanSource = (source) => {
  return source
    .replace(/\.md/g, '')
    .replace(/['"""]/g, '')
    .trim()
}

// 清理和格式化普通文本内容
const cleanTextContent = (content) => {
  // 处理LaTeX数学表达式
  let cleaned = processMathExpression(content)
  
  // 移除表格相关HTML
  cleaned = cleaned
    .replace(/<table>[\s\S]*?<\/table>|<tr>[\s\S]*?<\/tr>|<td>[\s\S]*?<\/td>/g, '')
    .replace(/<\/?(?:html|body)[^>]*>/g, '')
    
  // 处理Markdown标记
  cleaned = cleaned
    .replace(/#+\s+([^\n]+)/g, '$1\n') // 保留标题文本
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 保留加粗文本
    
  // 处理列表和段落
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map(p => {
      return p
        .trim()
        .replace(/^\s*\d+\.\s+/gm, '') // 移除序号
        .replace(/\s+/g, ' ') // 规范化空白
        .trim()
    })
    .filter(p => p && !p.match(/^[<>]/) && !p.includes('table')) // 过滤空段落和HTML残余
  
  return paragraphs
}

// 表格组件
const Table = ({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="overflow-x-auto mt-2 border rounded-lg bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {data[0].map((header, i) => (
              <th 
                key={i}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.slice(1).map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td 
                  key={j}
                  className="px-4 py-2 text-sm text-gray-600 whitespace-pre-wrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 引用块组件
const ReferenceBlock = ({ source, relevance, content }) => {
  // 提取表格数据
  const tableData = extractTableData(content)
  
  // 处理文本内容
  const paragraphs = cleanTextContent(content)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">来自文档「{cleanSource(source)}」</span>
        <span className="text-gray-500">相关度: {relevance}</span>
      </div>
      
      {/* 优先显示表格 */}
      {tableData && <Table data={tableData} />}
      
      {/* 显示文本内容 */}
      {paragraphs.length > 0 && (
        <div className="text-sm text-gray-600 space-y-2">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

const References = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  // 解析引用内容
  const parseReferences = (text) => {
    if (!text) return []
    
    const references = []
    // 使用更灵活的正则表达式匹配引用块
    const pattern = /来自文档\s+['"]([^'"]+)['"]\s*\(相关度:\s*([\d.]+)\):\s*((?:(?!来自文档[\s'"]|\n\s*来自文档)[\s\S])*)/g
    let match
    
    while ((match = pattern.exec(text)) !== null) {
      references.push({
        source: match[1],
        relevance: parseFloat(match[2]),
        content: match[3].trim()
      })
    }
    
    return references
  }

  const references = parseReferences(content)
  if (references.length === 0) return null

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors w-full"
      >
        <Quote className="w-4 h-4" />
        <span className="text-sm font-medium">引用来源</span>
        <div className="flex-1 border-b border-dotted border-gray-300 mx-2" />
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 pl-4 border-l-2 border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4 space-y-6">
            {references.map((ref, index) => (
              <ReferenceBlock
                key={index}
                source={ref.source}
                relevance={ref.relevance}
                content={ref.content}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default References