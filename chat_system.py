import requests
import json
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from urllib3.exceptions import InsecureRequestWarning
from config import DIFY_CONFIG, RETRIEVAL_CONFIG

# 禁用不安全请求的警告
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

class KnowledgeBaseChat:
    def __init__(self, api_key, dataset_id):
        """
        初始化知识库对话系统
        
        参数:
            api_key (str): Dify API密钥
            dataset_id (str): 数据集ID
        """
        self.api_key = api_key
        self.dataset_id = dataset_id
        self.base_url = DIFY_CONFIG['base_url']
        
        # 创建一个带重试机制的会话
        self.session = requests.Session()
        
        # 配置重试策略
        retry_strategy = Retry(
            total=3,  # 最大重试次数
            backoff_factor=1,  # 重试间隔
            status_forcelist=[500, 502, 503, 504]  # 需要重试的HTTP状态码
        )
        
        # 创建适配器
        adapter = HTTPAdapter(max_retries=retry_strategy)
        
        # 将适配器应用到会话
        self.session.mount("https://", adapter)
        self.session.mount("http://", adapter)
    
    def retrieve_knowledge(self, query, top_k=None):
        """
        从知识库检索相关内容
        """
        url = f"{self.base_url}/datasets/{self.dataset_id}/retrieve"
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        # 使用配置文件中的设置
        data = {
            "query": {
                "content": query
            },
            "retrieval_model": {
                "search_method": RETRIEVAL_CONFIG['search_method'],
                "reranking_enable": False,
                "top_k": top_k or RETRIEVAL_CONFIG['top_k'],
                "score_threshold_enabled": False,
                "weights": RETRIEVAL_CONFIG['weights']
            }
        }
        
        try:
            response = self.session.post(
                url, 
                headers=headers, 
                json=data,
                verify=False,
                timeout=(5, 15)
            )
            
            print(f"状态码: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                if not result.get('records'):
                    print("API返回成功但没有找到相关内容")
                return result
            else:
                print(f"API返回错误: {response.text}")
                return None
            
        except Exception as e:
            print(f"检索知识时发生错误: {str(e)}")
            return None

    def format_response(self, response_data):
        """格式化检索结果"""
        if not response_data or not response_data.get('records'):
            return """抱歉，我没有找到相关的信息。
建议您：
1. 使用更具体的关键词
2. 尝试其他相关问题
3. 确保问题与工业企业设计标准相关

您可以尝试这些示例问题：
- 工业企业总平面布置的原则是什么？
- 高温车间的布置要求是什么？
- 洁净厂房的设计要求有哪些？"""
        
        results = []
        for record in response_data['records']:
            segment = record['segment']
            content = segment.get('content', '').strip()
            score = record.get('score', 0)
            doc_name = segment.get('document', {}).get('name', '未知文档')
            
            if content:  # 只添加有内容的结果
                results.append(f"相关度: {score:.2f}\n文档: {doc_name}\n内容: {content}\n")
        
        if not results:
            return "抱歉，虽然找到了记录但内容似乎为空。请换个方式提问。"
        
        return "\n---\n".join(results)

def main():
    # 使用配置文件中的设置
    api_key = DIFY_CONFIG['api_key']
    dataset_id = DIFY_CONFIG['dataset_id']
    
    try:
        # 创建对话系统实例
        chat_system = KnowledgeBaseChat(api_key, dataset_id)
        
        print("欢迎使用工业企业设计标准知识库问答系统！")
        print("输入 'quit' 或 'exit' 退出对话")
        print("-" * 50)
        
        while True:
            try:
                # 获取用户输入
                user_input = input("\n请输入您的问题: ").strip()
                
                if user_input.lower() in ['quit', 'exit']:
                    print("感谢使用，再见！")
                    break
                
                if not user_input:
                    continue
                
                # 检索知识库
                response = chat_system.retrieve_knowledge(user_input)
                
                if response:
                    # 格式化并显示结果
                    formatted_response = chat_system.format_response(response)
                    print("\n检索结果:")
                    print(formatted_response)
                else:
                    print("\n抱歉，检索失败，请稍后重试。")
                    
            except KeyboardInterrupt:
                print("\n程序被用户中断")
                break
            except Exception as e:
                print(f"\n发生错误: {str(e)}")
                print("请重试或输入 'exit' 退出")
                
    except Exception as e:
        print(f"程序初始化失败: {str(e)}")

if __name__ == "__main__":
    main() 