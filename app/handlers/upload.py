from .base import BaseHandler
from ..services.document import DocumentService
from ..utils.logger import logger

class UploadHandler(BaseHandler):
    def initialize(self):
        self.document_service = DocumentService()
    
    async def post(self):
        try:
            if 'file' not in self.request.files:
                self.set_status(400)
                self.write({
                    "status": "error",
                    "message": "没有找到上传的文件"
                })
                return
                
            file_info = self.request.files['file'][0]
            logger.info(f"接收到文件: {file_info['filename']}")
            
            result = await self.document_service.upload_document(file_info)
            
            if result:
                self.write({
                    "status": "success",
                    "message": "文件上传成功",
                    "data": result
                })
            else:
                self.set_status(500)
                self.write({
                    "status": "error",
                    "message": "文件上传失败"
                })
                
        except Exception as e:
            logger.error(f"处理上传请求时发生错误: {str(e)}")
            logger.error(f"错误类型: {type(e).__name__}")
            import traceback
            logger.error(f"错误堆栈: \n{traceback.format_exc()}")
            self.set_status(500)
            self.write({
                "status": "error",
                "message": str(e)
            }) 