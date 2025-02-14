def format_response(response_data):
    """格式化API响应"""
    if not response_data or not response_data.get('records'):
        return """抱歉，我没有找到相关的信息。
建议您：
1. 使用更具体的关键词
2. 尝试其他相关问题
3. 确保问题与工业企业设计标准相关"""
    
    results = []
    for record in response_data['records']:
        segment = record['segment']
        content = segment.get('content', '').strip()
        score = record.get('score', 0)
        doc_name = segment.get('document', {}).get('name', '未知文档')
        
        if content:
            results.append(f"相关度: {score:.2f}\n文档: {doc_name}\n内容: {content}\n")
    
    if not results:
        return "抱歉，虽然找到了记录但内容似乎为空。请换个方式提问。"
    
    return "\n---\n".join(results) 