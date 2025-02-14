import requests
import json
from config.config import DIFY_CONFIG

class DocumentService:
    def __init__(self):
        self.api_key = DIFY_CONFIG['api_key']
        self.dataset_id = DIFY_CONFIG['dataset_id']
        self.base_url = DIFY_CONFIG['base_url']
    
    async def upload_document(self, file_info):
        """上传文档到Dify"""
        try:
            url = f"{self.base_url}/datasets/{self.dataset_id}/document/create-by-text"
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            # 读取文件内容
            text_content = file_info['body'].decode('utf-8')
            
            # 准备请求数据
            data = {
                "name": file_info['filename'],
                "text": text_content,
                "indexing_technique": "high_quality",
                "process_rule": {
                    "mode": "automatic"
                }
            }
            
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            
            print(f"Response Status: {response.status_code}")
            print(f"Response Content: {response.text}")
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"上传文档时发生错误: {str(e)}")
            if hasattr(e.response, 'text'):
                print(f"错误详情: {e.response.text}")
            return None
        except Exception as e:
            print(f"处理文件时发生错误: {str(e)}")
            return None
    
    async def get_documents(self):
        """获取文档列表"""
        try:
            url = f"{self.base_url}/datasets/{self.dataset_id}/documents"
            
            headers = {
                'Authorization': f'Bearer {self.api_key}'
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            print(f"获取文档列表时发生错误: {str(e)}")
            return None 