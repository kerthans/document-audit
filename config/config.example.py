# Dify API配置
DIFY_CONFIG = {
    "api_key": "your-api-key-here",  # 替换为您的API密钥
    "dataset_id": "your-dataset-id-here",  # 替换为您的数据集ID
    "base_url": "https://api.dify.ai/v1"
}

# 文件配置
FILE_CONFIG = {
    "upload_dir": "knowledge_base",  # 知识库文件存放目录
    "default_file": "dify知识库.md"   # 默认的知识库文件名
}

# 检索配置
RETRIEVAL_CONFIG = {
    "top_k": 5,  # 返回的最相关结果数量
    "search_method": "hybrid_search",  # 搜索方法：hybrid_search, keyword_search, semantic_search
    "weights": {
        "keyword": 0.7,
        "semantic": 0.3
    }
} 