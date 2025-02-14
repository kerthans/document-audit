# 工业企业设计标准知识库系统

这是一个基于Dify API的工业企业设计标准知识库检索系统。系统可以上传和管理知识库文档，并提供智能问答功能。

## 功能特点

- 文档上传：支持上传Markdown格式的知识库文档
- 文档管理：查看和管理已上传的知识库文档
- 智能问答：基于混合搜索的智能问答功能
- 友好界面：简单直观的命令行交互界面

## 系统架构

```
project/
├── config.py           # 配置文件
├── upload_document.py  # 文档上传模块
├── chat_system.py     # 问答系统模块
├── knowledge_base/    # 知识库文件目录
│   └── dify知识库.md   # 知识库文档
└── README.md          # 项目说明文档
```

## 安装和配置

1. 安装依赖：
```bash
pip install requests
```

2. 配置系统：
   - 复制配置模板文件：
     ```bash
     cp config.example.py config.py
     ```
   - 在`config.py`中填入您的实际配置信息
   - 确保知识库文件目录`knowledge_base`存在并有正确的权限

3. Git配置：
   - 项目已配置`.gitignore`来排除敏感配置文件
   - 确保不要将包含实际API密钥的`config.py`提交到仓库
   - 使用`config.example.py`作为配置模板

## 使用说明

### 1. 上传文档

运行文档上传程序：
```bash
python upload_document.py
```

程序会：
- 检查并创建知识库目录
- 上传指定的知识库文档
- 显示上传结果和文档列表

### 2. 使用问答系统

运行问答系统：
```bash
python chat_system.py
```

使用方法：
- 输入问题进行咨询
- 系统会返回最相关的答案
- 输入'quit'或'exit'退出系统

### 示例问题

- "工业企业总平面布置的原则是什么？"
- "高温车间的布置要求是什么？"
- "洁净厂房的设计要求有哪些？"

## 配置说明

在`config.py`中可以配置：

1. Dify API配置：
```python
DIFY_CONFIG = {
    "api_key": "your_api_key",
    "dataset_id": "your_dataset_id",
    "base_url": "https://api.dify.ai/v1"
}
```

2. 文件配置：
```python
FILE_CONFIG = {
    "upload_dir": "knowledge_base",
    "default_file": "dify知识库.md"
}
```

3. 检索配置：
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

## Dify配置指南

### 获取必要的配置信息

1. 获取API密钥（api_key）：
   - 登录Dify平台 (https://dify.ai)
   - 点击右上角的用户头像
   - 选择"Settings"（设置）
   - 在左侧菜单中选择"API Keys"
   - 点击"Create API Key"创建新的API密钥
   - 注意：API密钥格式通常以"app-"开头

2. 获取数据集ID（dataset_id）：
   - 在Dify平台首页点击"Datasets"（数据集）
   - 选择或创建一个数据集
   - 数据集ID在URL中可以找到：
     ```
     https://dify.ai/datasets/{dataset_id}/documents
     ```
   - 或在数据集设置页面的API部分可以找到

3. 基础URL（base_url）：
   - 默认为 "https://api.dify.ai/v1"
   - 如果使用自托管版本，请替换为您的服务器地址

### 配置示例

在`config.py`中配置这些值：

```python
DIFY_CONFIG = {
    "api_key": "app-xxxxxxxxxxxxxxxx",        # 替换为您的API密钥
    "dataset_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",  # 替换为您的数据集ID
    "base_url": "https://api.dify.ai/v1"     # 默认API地址
}
```

### 安全注意事项

1. API密钥安全：
   - 不要在公共场合分享您的API密钥
   - 建议使用环境变量或配置文件管理API密钥
   - 定期更换API密钥以提高安全性

2. 权限控制：
   - 确保API密钥具有适当的权限级别
   - 建议使用最小权限原则
   - 不同环境（开发/生产）使用不同的API密钥

3. 配置文件管理：
   - 建议将`config.py`添加到`.gitignore`
   - 可以创建`config.example.py`作为配置模板
   - 在部署时才填入实际的配置值

## 注意事项

1. 文档格式：
   - 支持Markdown格式
   - 建议按照标准格式编写文档
   - 确保文档编码为UTF-8

2. API限制：
   - 注意API调用频率限制
   - 确保API密钥有效且有足够权限

3. 网络要求：
   - 需要稳定的网络连接
   - 可能需要配置代理

## 常见问题

1. 上传失败：
   - 检查API密钥是否正确
   - 确认文件格式和编码
   - 检查网络连接

2. 检索无结果：
   - 尝试使用更具体的关键词
   - 确保问题与知识库内容相关
   - 检查搜索配置是否合适

## 更新日志

- 2024-03-20：初始版本发布
  - 实现基础文档上传功能
  - 实现智能问答功能
  - 添加配置文件
  - 优化错误处理和网络连接