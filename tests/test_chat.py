import unittest
from tornado.testing import AsyncHTTPTestCase
from server import make_app
import json

class TestChatHandler(AsyncHTTPTestCase):
    def get_app(self):
        return make_app()
    
    async def test_chat_empty_query(self):
        response = await self.fetch(
            '/api/chat',
            method='POST',
            body=json.dumps({"query": ""})
        )
        self.assertEqual(response.code, 400)
    
    async def test_chat_valid_query(self):
        response = await self.fetch(
            '/api/chat',
            method='POST',
            body=json.dumps({"query": "工业企业总平面布置的原则是什么？"})
        )
        self.assertEqual(response.code, 200)
        data = json.loads(response.body)
        self.assertEqual(data['status'], 'success') 