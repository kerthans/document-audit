from tornado.web import RequestHandler
import json
from ..services.chat import ChatService
from ..utils.logger import logger

class ChatHandler(RequestHandler):
    def initialize(self):
        self.chat_service = ChatService()
    
    async def post(self):
        try:
            data = json.loads(self.request.body)
            logger.info(f"收到请求数据：{data}")
            
            query = data.get('query', '')
            if not query:
                error_response = {
                    "status": "error",
                    "message": "查询内容不能为空"
                }
                logger.error(f"空查询响应：{error_response}")
                self.set_status(400)
                self.write(error_response)
                return
            
            # 获取回答
            response = await self.chat_service.retrieve_knowledge(query)
            logger.info(f"ChatService返回的原始响应：{response}")
            
            # 检查响应结构
            if not response:
                logger.error("ChatService返回空响应")
                self.set_status(500)
                self.write({"status": "error", "message": "服务返回空响应"})
                return
            
            # 直接返回ChatService的响应，不做额外包装
            final_response = {
                "status": "success",
                "data": response['data']  # 直接使用内部data
            }
            
            logger.info(f"发送到前端的最终响应：{final_response}")
            self.write(final_response)
            
        except Exception as e:
            error_message = str(e)
            logger.error(f"处理请求时发生错误: {error_message}")
            error_response = {
                "status": "error",
                "message": error_message
            }
            logger.error(f"错误响应：{error_response}")
            self.set_status(500)
            self.write(error_response) 