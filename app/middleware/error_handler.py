import functools
import traceback
from ..utils.logger import logger

def handle_exceptions(method):
    """异常处理装饰器"""
    @functools.wraps(method)
    async def wrapper(self, *args, **kwargs):
        try:
            return await method(self, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {method.__name__}: {str(e)}")
            logger.error(traceback.format_exc())
            
            self.set_status(500)
            self.write({
                "status": "error",
                "message": str(e),
                "detail": traceback.format_exc() if self.application.settings.get('debug') else None
            })
    return wrapper 