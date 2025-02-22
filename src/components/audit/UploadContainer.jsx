// frontend/src/components/audit/UploadContainer.jsx
import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import axios from 'axios';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from "../../lib/utils";

const API_URL = 'http://localhost:8888';

const UploadContainer = () => {
  const [serverStatus, setServerStatus] = useState({
    connected: false,
    checking: true
  });

  const [lastAnalysisResult, setLastAnalysisResult] = useState(null);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/health`);
        setServerStatus({
          connected: response.data.status === 'success',
          checking: false
        });
      } catch (error) {
        setServerStatus({
          connected: false,
          checking: false
        });
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalysisComplete = (results) => {
    setLastAnalysisResult(results);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center p-6">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 opacity-70" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* 服务器状态指示器 */}
      <div className={cn(
        "absolute right-6 top-6 flex items-center gap-2 px-4 py-2 rounded-full",
        "transition-all duration-300 backdrop-blur-sm",
        serverStatus.connected
          ? "bg-green-50/80 text-green-600 border border-green-200"
          : "bg-red-50/80 text-red-600 border border-red-200",
        "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        "cursor-help"
      )}>
        {serverStatus.connected ? (
          <Wifi className="w-5 h-5 animate-pulse" />
        ) : (
          <WifiOff className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">
          {serverStatus.checking
            ? "检查连接中..."
            : serverStatus.connected
              ? "服务器已连接"
              : "服务器未连接"}
        </span>
      </div>

      {/* 主要内容区域 */}
      <div className="relative w-full max-w-4xl z-10">
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            智能文档分析系统
          </h1>
          <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400">
            上传您的文档，获取智能分析结果
          </p>
        </div> */}

        {/* 上传表单组件 */}
        <div className="relative w-full">
          <UploadForm 
            serverStatus={serverStatus} 
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>

        {/* 分析状态展示 */}
        {serverStatus.connected && (
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              {lastAnalysisResult 
                ? `最近一次分析完成时间: ${new Date().toLocaleString()}`
                : '准备就绪，等待文件上传'}
            </p>
          </div>
        )}

        {/* 错误状态展示 */}
        {!serverStatus.connected && !serverStatus.checking && (
          <div className="mt-8">
            <div className={cn(
              "w-full max-w-2xl mx-auto",
              "bg-red-50 border border-red-200",
              "rounded-xl p-4",
              "flex items-center gap-3"
            )}>
              <WifiOff className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">
                  服务器连接失败
                </h3>
                <p className="mt-1 text-sm text-red-600">
                  请检查服务器状态或稍后重试。如果问题持续存在，请联系技术支持。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 页脚信息 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-zinc-400 text-sm">
        <p>© 2024 智能文档分析系统 - V1.0.0</p>
      </div>
    </div>
  );
};

export default UploadContainer;