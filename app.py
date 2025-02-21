from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import logging
import os
import sys
import json
import traceback
from typing import Optional
from typing import Dict

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 修改导入语句
from app.services.chat import ChatService
from app.services.document import DocumentService
from config.config import DIFY_CONFIG, FILE_CONFIG
from app.utils.logger import logger

# 创建FastAPI应用
app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 获取项目根目录
root_dir = os.path.dirname(os.path.abspath(__file__))

# 配置静态文件和模板
# templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))
# app.mount("/static", StaticFiles(directory=os.path.join(root_dir, "static")), name="static")

# 创建服务实例
chat_service = ChatService()
document_service = DocumentService()

@app.get("/")
@app.get("/index.html")
async def main(request: Request):
    try:
        logger.info("="*50)
        logger.info("收到首页请求")
        logger.info(f"请求路径: {request.url.path}")
        logger.info(f"请求方法: {request.method}")
        logger.info(f"请求头: {request.headers}")
        
        template_path = os.path.join(root_dir, "templates")
        template_file = os.path.join(template_path, "index.html")
        
        logger.info(f"模板路径: {template_path}")
        logger.info(f"模板文件: {template_file}")
        logger.info(f"模板文件存在: {os.path.exists(template_file)}")
        
        if not os.path.exists(template_file):
            raise FileNotFoundError(f"模板文件不存在: {template_file}")
        
        # return templates.TemplateResponse("index.html", {"request": request})
        
    except Exception as e:
        logger.error("="*50)
        logger.error(f"渲染主页时发生错误: {str(e)}")
        logger.error(f"错误类型: {type(e).__name__}")
        logger.error(f"错误堆栈: \n{traceback.format_exc()}")
        
        raise HTTPException(
            status_code=500,
            detail={
                "error": "服务器内部错误",
                "detail": str(e),
                "type": type(e).__name__
            }
        )

@app.post("/api/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        query = data.get('query', '')
        
        if not query:
            raise HTTPException(status_code=400, detail="查询内容不能为空")
            
        response = await chat_service.retrieve_knowledge(query)
        formatted_response = chat_service.format_response(response)
        
        return {
            "status": "success",
            "data": formatted_response
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": str(e)
            }
        )

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(
                status_code=400,
                detail={
                    "status": "error",
                    "message": "没有找到上传的文件"
                }
            )
        
        filename = file.filename
        
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
        file_content = await file.read()
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        logger.info(f"文件已保存到: {file_path}")
        
        # 创建文件信息字典，模拟tornado的文件信息格式
        file_info = {
            'filename': filename,
            'body': file_content,
            'content_type': file.content_type
        }
        
        # 上传到Dify并进行法规评估
        result = await document_service.upload_document(file_info) 

        # 读取Judge_output文件夹中的所有文件
        judge_output_path = os.path.join(root_dir, 'Judge_output')
        judged_content: Dict[str, str] = {}
        
        if os.path.exists(judge_output_path):
            file_count = 0
            for file_name in os.listdir(judge_output_path):
                if os.path.isfile(os.path.join(judge_output_path, file_name)):
                    file_count += 1
                    # 获取文件名（不含扩展名）
                    file_base_name = os.path.splitext(file_name)[0]
                    
                    # 读取文件内容
                    try:
                        with open(os.path.join(judge_output_path, file_name), 'r', encoding='utf-8') as f:
                            content = f.read()
                            judged_content[file_base_name] = content
                    except Exception as e:
                        logger.error(f"读取文件 {file_name} 时发生错误: {str(e)}")
                        continue
            
            return {
                "status": "success",
                "message": "文件上传并完成法规评估",
                "data": {
                    "law_num": file_count,
                    "judged_content": judged_content
                }
            }
        else:
            raise HTTPException(
                status_code=500,
                detail={
                    "status": "error",
                    "message": "Judge_output文件夹不存在"
                }
            )
            
    except Exception as e:
        logger.error(f"处理上传请求时发生错误: {str(e)}")
        logger.error(f"错误类型: {type(e).__name__}")
        logger.error(f"错误堆栈: \n{traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": f"文件处理错误: {str(e)}"
            }
        )
        
    #     if result:
    #         return {
    #             "status": "success",
    #             "message": "文件上传并完成法规评估",
    #             "data": {
    #                 "upload_result": result['upload_response'],
    #                 "assessments": result['assessments']
    #             }
    #         }
    #     else:
    #         raise HTTPException(
    #             status_code=500,
    #             detail={
    #                 "status": "error",
    #                 "message": "文件处理失败"
    #             }
    #         )
            
    # except Exception as e:
    #     logger.error(f"处理上传请求时发生错误: {str(e)}")
    #     logger.error(f"错误类型: {type(e).__name__}")
    #     logger.error(f"错误堆栈: \n{traceback.format_exc()}")
    #     raise HTTPException(
    #         status_code=500,
    #         detail={
    #             "status": "error",
    #             "message": f"文件处理错误: {str(e)}"
    #         }
    #     )

@app.get("/api/documents")
async def get_documents():
    try:
        documents = await document_service.get_documents()
        
        if documents:
            return {
                "status": "success",
                "data": documents
            }
        else:
            raise HTTPException(
                status_code=500,
                detail={
                    "status": "error",
                    "message": "获取文档列表失败"
                }
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": str(e)
            }
        )

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=404,
        content={"error": "请求的资源不存在"}
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=500,
        content={"error": "服务器内部错误"}
    )

if __name__ == "__main__":
    try:
        # 检查关键目录和文件
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
        
        # 启动服务器
        port = 8888
        logger.info(f"服务器启动成功: http://localhost:{port}")
        uvicorn.run(app, host="0.0.0.0", port=port)
        
    except Exception as e:
        logger.error("="*50)
        logger.error("服务器启动失败")
        logger.error(f"错误类型: {type(e).__name__}")
        logger.error(f"错误信息: {str(e)}")
        logger.error(f"错误堆栈: \n{traceback.format_exc()}")
        sys.exit(1)