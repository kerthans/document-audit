import tornado.ioloop
import tornado.web
import json
import os
import sys
import logging

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 修改导入语句
from app.services.chat import ChatService
from app.services.document import DocumentService
from config.config import DIFY_CONFIG, FILE_CONFIG
from app.handlers.chat import ChatHandler
from app.handlers.upload import UploadHandler
from app.handlers.document import DocumentListHandler
from app.utils.logger import logger

logger = logging.getLogger(__name__)

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        # 修改CORS配置，允许特定域名和请求头
        self.set_header("Access-Control-Allow-Origin", "http://localhost:3000")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, content-type, client-id")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        self.set_header("Access-Control-Allow-Credentials", "true")
    
    def options(self, *args, **kwargs):
        # 处理 OPTIONS 预检请求
        self.set_status(204)
        self.finish()
# class BaseHandler(tornado.web.RequestHandler):
#     def set_default_headers(self):
#         self.set_header("Access-Control-Allow-Origin", "*")
#         self.set_header("Access-Control-Allow-Headers", "x-requested-with,content-type")
#         self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    
#     def options(self):
#         self.set_status(204)
#         self.finish()

# 添加主页处理器
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        try:
            logger.info("="*50)
            logger.info("收到首页请求")
            logger.info(f"请求路径: {self.request.path}")
            logger.info(f"请求方法: {self.request.method}")
            logger.info(f"请求头: {self.request.headers}")
            
            template_path = self.settings['template_path']
            template_file = os.path.join(template_path, 'index.html')
            
            logger.info(f"模板路径: {template_path}")
            logger.info(f"模板文件: {template_file}")
            logger.info(f"模板文件存在: {os.path.exists(template_file)}")
            
            if not os.path.exists(template_file):
                raise FileNotFoundError(f"模板文件不存在: {template_file}")
            
            self.render("index.html")
            logger.info("成功渲染模板")
            
        except Exception as e:
            logger.error("="*50)
            logger.error(f"渲染主页时发生错误: {str(e)}")
            logger.error(f"错误类型: {type(e).__name__}")
            logger.error(f"错误详情: {str(e)}")
            import traceback
            logger.error(f"错误堆栈: \n{traceback.format_exc()}")
            
            self.set_status(500)
            self.write({
                "error": "服务器内部错误",
                "detail": str(e),
                "type": type(e).__name__
            })

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
            filename = file_info['filename']
            
            # 确保文件名是UTF-8编码
            try:
                filename = filename.encode('latin1').decode('utf-8')
            except UnicodeError:
                try:
                    filename = filename.encode('latin1').decode('gbk')
                except UnicodeError:
                    filename = filename  # 保持原样
            
            logger.info(f"处理上传文件: {filename}")
            
            # 确保目录存在
            os.makedirs(FILE_CONFIG['upload_dir'], exist_ok=True)
            
            # 保存上传的文件
            file_path = os.path.join(FILE_CONFIG['upload_dir'], filename)
            with open(file_path, 'wb') as f:
                f.write(file_info['body'])
            
            logger.info(f"文件已保存到: {file_path}")
            
            # 上传到Dify并进行法规评估
            result = await self.document_service.upload_document(file_info)
            
            if result:
                self.write({
                    "status": "success",
                    "message": "文件上传并完成法规评估",
                    "data": {
                        "upload_result": result['upload_response'],
                        "assessments": result['assessments']
                    }
                })
            else:
                self.set_status(500)
                self.write({
                    "status": "error",
                    "message": "文件处理失败"
                })
                
        except Exception as e:
            logger.error(f"处理上传请求时发生错误: {str(e)}")
            logger.error(f"错误类型: {type(e).__name__}")
            import traceback
            logger.error(f"错误堆栈: \n{traceback.format_exc()}")
            self.set_status(500)
            self.write({
                "status": "error",
                "message": f"文件处理错误: {str(e)}"
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

class ErrorHandler(tornado.web.RequestHandler):
    def initialize(self, status_code):
        self.set_status(status_code)
    
    def prepare(self):
        if self.get_status() == 404:
            self.write({"error": "请求的资源不存在"})
        elif self.get_status() == 500:
            self.write({"error": "服务器内部错误"})
        self.finish()

def make_app():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    settings = {
        "template_path": os.path.join(root_dir, "templates"),
        "static_path": os.path.join(root_dir, "static"),
        "debug": True,
        "default_handler_class": ErrorHandler,
        "default_handler_args": dict(status_code=404)
    }
    
    # 在启动时检查目录是否存在
    if not os.path.exists(settings["template_path"]):
        os.makedirs(settings["template_path"])
        logger.warning(f"Created missing template directory: {settings['template_path']}")
    
    if not os.path.exists(settings["static_path"]):
        os.makedirs(settings["static_path"])
        logger.warning(f"Created missing static directory: {settings['static_path']}")
    
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/index.html", MainHandler),
        (r"/api/chat", ChatHandler),
        (r"/api/upload", UploadHandler),
        (r"/api/documents", DocumentListHandler),
    ], **settings)

if __name__ == "__main__":
    try:
        app = make_app()
        port = 8888
        
        # 检查关键目录和文件
        root_dir = os.path.dirname(os.path.abspath(__file__))
        template_dir = os.path.join(root_dir, "templates")
        index_file = os.path.join(template_dir, "index.html")
        
        logger.info("="*50)
        logger.info("服务器启动检查")
        logger.info(f"项目根目录: {root_dir}")
        logger.info(f"模板目录: {template_dir}")
        logger.info(f"index.html路径: {index_file}")
        logger.info(f"模板目录存在: {os.path.exists(template_dir)}")
        logger.info(f"index.html存在: {os.path.exists(index_file)}")
        
        if not os.path.exists(template_dir):
            logger.warning(f"创建模板目录: {template_dir}")
            os.makedirs(template_dir)
            
        if not os.path.exists(index_file):
            logger.error(f"index.html 文件不存在！")
            
        app.listen(port)
        logger.info(f"服务器启动成功: http://localhost:{port}")
        tornado.ioloop.IOLoop.current().start()
        
    except Exception as e:
        logger.error("="*50)
        logger.error("服务器启动失败")
        logger.error(f"错误类型: {type(e).__name__}")
        logger.error(f"错误信息: {str(e)}")
        import traceback
        logger.error(f"错误堆栈: \n{traceback.format_exc()}")
        sys.exit(1) 