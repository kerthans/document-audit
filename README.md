# 工业企业设计标准智能问答系统

## 项目简介
本项目是一个基于智谱AI GLM-4和Dify知识库的工业企业设计标准智能问答系统。系统可以根据用户的问题，从工业企业设计标准知识库中检索相关内容，并通过大模型分析和优化后给出专业的答复。

## 功能特点
- 智能问答：支持自然语言提问，系统会从知识库中检索相关标准并给出答案
- 知识库管理：支持标准文档的上传、更新和管理
- 对话历史：保存用户的问答历史，支持上下文理解
- 专业优化：使用GLM-4模型对答案进行专业性优化
- 实时反馈：显示检索进度和处理状态

## 项目结构
```
industrial-standards-qa/
├── app/                    # 应用主目录
│   ├── handlers/          # 请求处理器
│   │   ├── chat.py       # 聊天处理器
│   │   └── document.py   # 文档处理器
│   ├── services/         # 业务逻辑服务
│   │   └── chat.py      # 聊天服务
│   └── utils/           # 工具函数
│       ├── helpers.py   # 辅助函数
│       └── logger.py    # 日志工具
├── config/               # 配置文件目录
│   └── config.py        # 配置文件
├── static/              # 静态资源文件
├── templates/           # 前端模板
│   └── index.html      # 主页面
├── .env                 # 环境变量
├── requirements.txt     # 项目依赖
└── server.py           # 服务器入口
```

## 环境要求
- Python 3.8+
- 智谱AI API密钥
- Dify API密钥和数据集

## 快速开始

1. 克隆项目并安装依赖：
```bash
git clone <repository-url>
cd industrial-standards-qa
pip install -r requirements.txt
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，填写必要的配置信息
```

3. 启动服务：
```bash
python server.py
```

4. 访问系统：
打开浏览器访问 `http://localhost:8888`

## API文档

### 1. 问答接口
- 接口：`/api/chat`
- 方法：POST
- 请求体：
```json
{
    "query": "问题内容"
}
```
- 响应：
```json
{
    "status": "success",
    "data": {
        "answer": "回答内容",
        "knowledge_base_content": "知识库内容",
        "metadata": {
            "model": "glm-4",
            "usage": {
                "total_tokens": 1234
            }
        }
    }
}
```

### 2. 文件上传接口
- 接口：`/api/upload`
- 方法：POST
- 请求体：multipart/form-data
- 响应：
```json
{
    "status": "success",
    "message": "文件上传成功"
}
```

## 使用说明
1. 在输入框中输入工业企业设计相关问题
2. 系统会从知识库中检索相关标准并给出答案
3. 可以查看知识库匹配内容和答案的专业性优化

## 技术栈
- 前端：原生JavaScript + HTML/CSS
- 后端：Python + Tornado
- AI模型：智谱AI GLM-4
- 知识库：Dify

## 注意事项
- 请确保API密钥的安全性
- 建议在生产环境中启用HTTPS
- 定期备份知识库数据
- 注意API调用频率限制

## 许可证
MIT License

## 更新日志
- 2024-03-20
  - 初始版本发布
  - 实现基础问答功能
  - 添加文件上传功能
  - 优化用户界面

