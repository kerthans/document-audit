import requests
from config.config import DIFY_CONFIG, RETRIEVAL_CONFIG
from ..utils.helpers import format_response

class ChatService:
    def __init__(self):
        self.api_key = DIFY_CONFIG['api_key']
        self.dataset_id = DIFY_CONFIG['dataset_id']
        self.base_url = DIFY_CONFIG['base_url']
    
    async def retrieve_knowledge(self, query):
        """从知识库检索内容"""
        try:
            url = f"{self.base_url}/datasets/{self.dataset_id}/retrieve"
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                "query": {
                    "content": query
                },
                "retrieval_model": {
                    "search_method": RETRIEVAL_CONFIG['search_method'],
                    "reranking_enable": False,
                    "top_k": RETRIEVAL_CONFIG['top_k'],
                    "score_threshold_enabled": False,
                    "weights": RETRIEVAL_CONFIG['weights']
                }
            }
            
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            print(f"检索知识时发生错误: {str(e)}")
            return None
    
    def format_response(self, response_data):
        """格式化响应数据"""
        return format_response(response_data) 