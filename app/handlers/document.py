from .base import BaseHandler
from ..services.document import DocumentService

class DocumentListHandler(BaseHandler):
    def initialize(self):
        self.document_service = DocumentService()
    
    async def get(self):
        try:
            documents = await self.document_service.get_documents()
            if documents:
                self.write({
                    "status": "success",
                    "data": documents
                })
            else:
                self.set_status(500)
                self.write({
                    "status": "error",
                    "message": "获取文档列表失败"
                })
        except Exception as e:
            self.set_status(500)
            self.write({
                "status": "error",
                "message": str(e)
            }) 