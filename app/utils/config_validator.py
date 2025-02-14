from config import DIFY_CONFIG, FILE_CONFIG, RETRIEVAL_CONFIG

def validate_config():
    """验证配置文件的完整性"""
    required_dify_keys = ['api_key', 'dataset_id', 'base_url']
    required_file_keys = ['upload_dir', 'default_file']
    required_retrieval_keys = ['top_k', 'search_method', 'weights']
    
    # 验证Dify配置
    for key in required_dify_keys:
        if key not in DIFY_CONFIG:
            raise ValueError(f"DIFY_CONFIG missing required key: {key}")
    
    # 验证文件配置
    for key in required_file_keys:
        if key not in FILE_CONFIG:
            raise ValueError(f"FILE_CONFIG missing required key: {key}")
    
    # 验证检索配置
    for key in required_retrieval_keys:
        if key not in RETRIEVAL_CONFIG:
            raise ValueError(f"RETRIEVAL_CONFIG missing required key: {key}")
    
    # 验证权重配置
    weights = RETRIEVAL_CONFIG['weights']
    if not isinstance(weights, dict) or 'keyword' not in weights or 'semantic' not in weights:
        raise ValueError("Invalid weights configuration in RETRIEVAL_CONFIG")
    
    return True 