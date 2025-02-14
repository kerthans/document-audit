from .base import BaseHandler
from ..services.chat import ChatService
from ..middleware.error_handler import handle_exceptions
from ..utils.logger import logger
import json

class ChatHandler(BaseHandler):
    def initialize(self):
        self.chat_service = ChatService()
    
    @handle_exceptions
    async def post(self):
        data = json.loads(self.request.body)
        query = data.get('query', '')
        
        if not query:
            self.set_status(400)
            self.write({"error": "查询内容不能为空"})
            return
        
        logger.info(f"Received chat query: {query}")
        response = await self.chat_service.retrieve_knowledge(query)
        formatted_response = self.chat_service.format_response(response)
        
        logger.info(f"Chat response generated for query: {query}")
        self.write({
            "status": "success",
            "data": formatted_response
        }) 