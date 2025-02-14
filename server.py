import tornado.ioloop
import tornado.web
import json
import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 修改导入语句
from app.services.chat import ChatService  # 替换原来的chat_system导入
from app.services.document import DocumentService  # 替换原来的upload_document导入
from config.config import DIFY_CONFIG, FILE_CONFIG
from app.handlers.chat import ChatHandler
from app.handlers.upload import UploadHandler
from app.handlers.document import DocumentListHandler

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with,content-type")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    
    def options(self):
        self.set_status(204)
        self.finish()

# 添加主页处理器
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class ChatHandler(BaseHandler):
    def initialize(self):
        self.chat_service = ChatService()  # 不再传递参数
    
    async def post(self):
        try:
            data = json.loads(self.request.body)
            query = data.get('query', '')
            
            if not query:
                self.set_status(400)
                self.write({"error": "查询内容不能为空"})
                return
                
            response = await self.chat_service.retrieve_knowledge(query)
            formatted_response = self.chat_service.format_response(response)
            
            self.write({
                "status": "success",
                "data": formatted_response
            })
            
        except Exception as e:
            self.set_status(500)
            self.write({
                "status": "error",
                "message": str(e)
            })

class UploadHandler(BaseHandler):
    def initialize(self):
        self.document_service = DocumentService()  # 创建服务实例
    
    async def post(self):
        try:
            file_info = self.request.files['file'][0]
            filename = file_info['filename']
            
            # 确保目录存在
            os.makedirs(FILE_CONFIG['upload_dir'], exist_ok=True)
            
            # 保存上传的文件
            file_path = os.path.join(FILE_CONFIG['upload_dir'], filename)
            with open(file_path, 'wb') as f:
                f.write(file_info['body'])
            
            # 上传到Dify
            result = await self.document_service.upload_document(file_info)  # 使用实例方法
            
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
            self.set_status(500)
            self.write({
                "status": "error",
                "message": str(e)
            })

class DocumentListHandler(BaseHandler):
    def initialize(self):
        self.document_service = DocumentService()  # 创建服务实例
    
    async def get(self):
        try:
            documents = await self.document_service.get_documents()  # 使用实例方法
            
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

def make_app():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/api/chat", ChatHandler),
        (r"/api/upload", UploadHandler),
        (r"/api/documents", DocumentListHandler),
    ],
    template_path=os.path.join(current_dir, "templates"),
    static_path=os.path.join(current_dir, "static"),
    debug=True
    )

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("服务器启动在 http://localhost:8888")
    tornado.ioloop.IOLoop.current().start() 