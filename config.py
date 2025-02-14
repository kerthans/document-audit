# Dify API配置
DIFY_CONFIG = {
    "api_key": "dataset-tSFlfmubMI3jTeTLGACQI6VM",
    "dataset_id": "fc70864a-3020-4533-b88b-023b48ec5772",
    "base_url": "https://api.dify.ai/v1"
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