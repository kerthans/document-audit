import requests
import json
import os
from config import DIFY_CONFIG, FILE_CONFIG

def upload_document_to_dify(api_key, dataset_id, file_path):
    """
    向Dify API上传文档
    
    参数:
        api_key (str): Dify API密钥
        dataset_id (str): 数据集ID
        file_path (str): 要上传的文件路径
    
    返回:
        dict: API响应内容
    """
    # API端点
    url = f"{DIFY_CONFIG['base_url']}/datasets/{dataset_id}/document/create-by-file"
    
    # 处理规则配置
    process_rules = {
        "indexing_technique": "high_quality",  # 注意这里是下划线，不是连字符
        "process_rule": {
            "rules": {
                "pre_processing_rules": [
                    {"id": "remove_extra_spaces", "enabled": True},
                    {"id": "remove_urls_emails", "enabled": True}
                ],
                "segmentation": {
                    "separator": "###",
                    "max_tokens": 500
                }
            },
            "mode": "custom"
        }
    }
    
    # 准备请求头和文件数据
    headers = {
        'Authorization': f'Bearer {api_key}'
    }
    
    files = {
        'data': (None, json.dumps(process_rules), 'text/plain'),
        'file': (os.path.basename(file_path), open(file_path, 'rb'))
    }
    
    try:
        # 发送POST请求
        response = requests.post(url, headers=headers, files=files)
        
        # 打印详细的错误信息
        if response.status_code != 200:
            print(f"状态码: {response.status_code}")
            print(f"错误详情: {response.text}")
            
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"上传文件时发生错误: {str(e)}")
        return None
    finally:
        files['file'][1].close()  # 确保文件被关闭

def get_documents(api_key, dataset_id):
    """
    查询数据集中的所有文档
    
    参数:
        api_key (str): Dify API密钥
        dataset_id (str): 数据集ID
    
    返回:
        dict: API响应内容
    """
    url = f'https://api.dify.ai/v1/datasets/{dataset_id}/documents'
    
    headers = {
        'Authorization': f'Bearer {api_key}'
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"查询状态码: {response.status_code}")
            print(f"查询错误详情: {response.text}")
            return None
            
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"查询文档时发生错误: {str(e)}")
        return None

def main():
    # 使用配置文件中的设置
    api_key = DIFY_CONFIG['api_key']
    dataset_id = DIFY_CONFIG['dataset_id']
    
    # 确保知识库目录存在
    os.makedirs(FILE_CONFIG['upload_dir'], exist_ok=True)
    
    # 构建文件完整路径
    file_path = os.path.join(
        FILE_CONFIG['upload_dir'], 
        FILE_CONFIG['default_file']
    )
    
    # 检查文件是否存在
    if not os.path.exists(file_path):
        print(f"错误：文件 {file_path} 不存在")
        return
        
    print(f"正在上传文件: {file_path}")
    
    # 上传文件
    result = upload_document_to_dify(api_key, dataset_id, file_path)
    
    if result:
        print("文件上传成功！")
        print("响应内容:", json.dumps(result, indent=2, ensure_ascii=False))
        
        # 查询现有文档
        print("\n正在查询知识库现有文档...")
        documents = get_documents(api_key, dataset_id)
        
        if documents:
            print("\n知识库文档列表：")
            for doc in documents.get('data', []):
                print(f"\n文档ID: {doc.get('id')}")
                print(f"文档名称: {doc.get('name')}")
                print(f"创建时间: {doc.get('created_at')}")
                print(f"更新时间: {doc.get('updated_at')}")
                print(f"处理状态: {doc.get('status')}")
                print("-" * 50)
        else:
            print("查询文档失败。")
    else:
        print("文件上传失败。")

if __name__ == "__main__":
    main() 