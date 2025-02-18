import requests
import json
from config.config import DIFY_CONFIG
from ..utils.logger import logger
from .workflow import WorkflowService
import os

class DocumentService:
    def __init__(self):
        self.api_key = DIFY_CONFIG['api_key']
        self.dataset_id = DIFY_CONFIG['dataset_id']
        self.base_url = DIFY_CONFIG['base_url']
        self.workflow_service = WorkflowService()
    
    async def upload_document(self, file_info):
        """上传文档到Dify并进行法规评估"""
        try:
            # 1. 上传到知识库
            url = f"{self.base_url}/datasets/{self.dataset_id}/document/create-by-text"
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            text_content = file_info['body'].decode('utf-8')
            
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
            
            logger.info(f"文件已上传到知识库: {file_info['filename']}")
            
            # 2. 进行法规评估
            base_file_path = 'knowledge_base/厂区环境布局.md'
            law_list_dir = 'Law_list'
            
            # 确保输出目录存在
            os.makedirs('Judge_output', exist_ok=True)
            
            # 保存上传的文件到临时位置
            temp_file_path = os.path.join('temp_uploads', file_info['filename'])
            os.makedirs('temp_uploads', exist_ok=True)
            
            with open(temp_file_path, 'wb') as f:
                f.write(file_info['body'])
            
            # 运行工作流进行评估
            assessment_results = []
            for law_file in os.listdir(law_list_dir):
                if law_file.endswith('.md'):
                    law_file_path = os.path.join(law_list_dir, law_file)
                    
                    logger.info(f"正在评估文件 {file_info['filename']} 与法规 {law_file}")
                    output_text = await self.workflow_service.run_workflow(law_file_path, temp_file_path)
                    
                    if output_text:
                        assessment_results.append({
                            'law_file': law_file,
                            'assessment': output_text
                        })
                        
                        # 保存评估结果
                        output_path = os.path.join('Judge_output', f"{file_info['filename']}_{law_file}")
                        with open(output_path, 'w', encoding='utf-8') as f:
                            f.write(output_text)
                        logger.info(f"已保存评估结果: {output_path}")
            
            # 清理临时文件
            os.remove(temp_file_path)
            
            return {
                'upload_status': 'success',
                'upload_response': response.json(),
                'assessments': assessment_results
            }
            
        except Exception as e:
            logger.error(f"处理文件时发生错误: {str(e)}")
            if hasattr(e, 'response'):
                logger.error(f"错误响应: {e.response.text}")
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