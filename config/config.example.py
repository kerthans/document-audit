# config.example.py

import os

# 加载环境变量
# 请根据您的环境设置以下变量
# DIFY API配置
DIFY_CONFIG = {
    "api_key": os.getenv('DIFY_API_KEY', "您的数据集API密钥"),  # 数据集API密钥
    "api_key_workflow": os.getenv('DIFY_WORKFLOW_API_KEY', "您的应用API密钥"),  # 应用API密钥
    "dataset_id": os.getenv('DIFY_DATASET_ID', "您的数据集ID"),
    "base_url": os.getenv('DIFY_BASE_URL', "https://api.dify.ai/v1")
}

# 文件配置
FILE_CONFIG = {
    "upload_dir": "知识库上传目录",
    "default_file": "默认知识库文件.md"
}

# 检索配置
RETRIEVAL_CONFIG = {
    "top_k": 3,
    "search_method": "keyword_search",
    "reranking": {
        "enable": False,
        "provider": "",
        "model": ""
    }
}

# 智谱AI配置
ZHIPU_CONFIG = {
    "api_key": os.getenv('ZHIPU_API_KEY', "您的智谱AI API密钥"),
    "model": "glm-4-flash"
}

# Moonshot配置
MOONSHOT_CONFIG = {
    'api_key': os.getenv('MOONSHOT_API_KEY', "您的Moonshot API密钥"),
    'base_url': os.getenv('MOONSHOT_BASE_URL', 'https://api.moonshot.cn/v1')
}

# 修改日志配置
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "standard",
            "stream": "sys.stdout"
        },
        "file": {
            "class": "logging.FileHandler",
            "level": "INFO",
            "formatter": "standard",
            "filename": "app.log",
            "mode": "a"
        }
    },
    "loggers": {
        "": {  # root logger
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True
        }
    }
}