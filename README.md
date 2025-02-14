# 工业企业设计标准知识库系统

基于Dify API的工业企业设计标准知识库检索系统，使用Tornado框架实现Web服务器功能。系统提供文档上传、管理和智能问答功能。

## 项目结构

```
file_index/
├── app/                    # 应用程序核心目录
│   ├── handlers/          # 处理器目录
│   │   ├── base.py       # 基础处理器
│   │   ├── chat.py       # 聊天处理器
│   │   ├── document.py   # 文档处理器
│   │   └── upload.py     # 上传处理器
│   ├── services/         # 服务层目录
│   │   ├── chat.py       # 聊天服务
│   │   └── document.py   # 文档服务
│   ├── middleware/       # 中间件目录
│   │   └── error_handler.py  # 错误处理
│   └── utils/            # 工具函数目录
│       ├── config_validator.py  # 配置验证
│       ├── helpers.py    # 辅助函数
│       └── logger.py     # 日志工具
├── config/               # 配置文件目录
│   ├── config.py        # 配置文件
│   └── config.example.py # 配置模板
├── logs/                # 日志目录
├── static/             # 静态文件目录
├── templates/          # 模板目录
│   └── index.html     # Web界面
├── tests/             # 测试目录
│   └── test_chat.py   # 聊天功能测试
├── knowledge_base/    # 知识库文件目录
├── .gitignore        # Git忽略文件
├── requirements.txt   # 项目依赖
├── server.py         # 服务器入口
└── README.md         # 项目说明
```

## 功能特点

- RESTful API接口
- Web界面操作
- 文档上传和管理
- 智能问答系统
- 错误处理和日志记录
- 配置验证和管理

## 安装和配置

1. 创建并激活虚拟环境：
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置系统：
```bash
cp config/config.example.py config/config.py
# 编辑 config/config.py 填入配置信息
```

## API接口

### 1. 聊天接口
```
POST /api/chat
Content-Type: application/json

{
    "query": "您的问题"
}
```

### 2. 文档上传
```
POST /api/upload
Content-Type: multipart/form-data

file: [文件]
```

### 3. 文档列表
```
GET /api/documents
```

## 配置说明

### Dify配置
```python
DIFY_CONFIG = {
    "api_key": "your-api-key",
    "dataset_id": "your-dataset-id",
    "base_url": "https://api.dify.ai/v1"
}
```

### 检索配置
```python
RETRIEVAL_CONFIG = {
    "top_k": 5,
    "search_method": "hybrid_search",
    "weights": {
        "keyword": 0.7,
        "semantic": 0.3
    }
}
```

## 使用说明

1. 启动服务器：
```bash
python server.py
```

2. 访问Web界面：
- 打开浏览器访问 http://localhost:8888
- 使用上传功能添加文档
- 在问答界面输入问题

3. 使用API：
- 参考API文档进行接口调用
- 使用Postman等工具测试

## 开发指南

1. 错误处理：
- 使用error_handler装饰器处理异常
- 错误日志记录在logs目录

2. 日志系统：
- 日志文件按日期生成
- 包含INFO和ERROR级别日志

3. 测试：
```bash
python -m pytest tests/
```

## 注意事项

1. 安全性：
- 保护API密钥
- 注意文件上传限制
- 定期更新密钥

2. 性能：
- 注意API调用频率
- 大文件上传需要时间
- 日志文件定期清理

## 常见问题

1. 配置问题：
- 检查API密钥格式
- 确认数据集ID正确
- 验证配置文件完整性

2. 上传失败：
- 检查文件格式
- 确认文件大小限制
- 查看错误日志

## 更新日志

- 2024-03-20：
  - 重构项目结构
  - 添加错误处理
  - 完善日志系统
  - 优化文件上传
  - 改进API接口
