import asyncio
from app.services.workflow import WorkflowService
from app.utils.logger import logger

async def main():
    try:
        workflow_service = WorkflowService()
        success = await workflow_service.process_law_files()
        
        if success:
            logger.info("所有文件处理完成")
        else:
            logger.error("文件处理过程中出现错误")
            
    except Exception as e:
        logger.error(f"程序执行失败: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main()) 