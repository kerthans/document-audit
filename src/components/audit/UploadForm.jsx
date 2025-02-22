// frontend/src/components/audit/UploadForm.jsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { cn } from "../../lib/utils";
import ResultDialog from './ResultDialog';

const API_URL = 'http://localhost:8888';
const FILE_CONFIG = {
  maxSize: 1024 * 1024,
  allowedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: '.docx'
};

const UploadForm = ({ serverStatus, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    if (file.size > FILE_CONFIG.maxSize) {
      showError('文件大小不能超过1MB');
      return false;
    }

    if (!FILE_CONFIG.allowedTypes.includes(file.type)) {
      showError('请上传Word文档(.docx)格式的文件');
      return false;
    }

    return true;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const processAnalysisResult = (data) => {
    // Transform the judged_content object into an array of results
    if (!data?.data?.judged_content) return [];

    return Object.entries(data.data.judged_content).map(([key, value]) => {
      // Parse the evaluation result if it's a JSON string
      let parsedValue = value;
      try {
        if (typeof value === 'string' && value.startsWith('{')) {
          parsedValue = JSON.parse(value);
        }
      } catch (e) {
        console.error('Error parsing result:', e);
      }

      // Extract the evaluation result and details
      const result = typeof parsedValue === 'object' ? 
        parsedValue : 
        {
          评估结果: value.split('\n')[0].replace('评估结果：', ''),
          法规内容: value.split('\n')[1]?.replace('法规内容：', ''),
          检查情况: value.split('\n')[2]?.replace('检查情况：', ''),
          评估依据: value.split('\n')[3]?.replace('评估依据：', '')
        };

      return {
        规则编号: key,
        评估结果: result.评估结果 || result['评估结果'],
        法规内容: result.法规内容 || result['法规内容'],
        检查情况: result.检查情况 || result['检查情况'],
        评估依据: result.评估依据 || result['评估依据']
      };
    });
  };

  const handleUpload = async () => {
    if (!file || !serverStatus.connected) return;

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentage);
        },
      });

      if (response.data.status === 'success') {
        const processedResults = processAnalysisResult(response.data);
        setAnalysisResult(processedResults);
        setShowResultDialog(true);
        if (onAnalysisComplete) {
          onAnalysisComplete(processedResults);
        }
      }
    } catch (error) {
      showError(error.response?.data?.detail?.message || '上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (e) => {
    e?.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setProgress(0);
  };

  return (
    <>
      <div className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl",
        "border border-zinc-200/50 dark:border-zinc-800/50",
        "rounded-3xl shadow-lg",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20",
        "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
        "p-8"
      )}>
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            智能文档分析系统
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            上传文档进行智能分析
          </p>
        </div>

        {/* 上传区域 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">上传文档</span>
            <div className="relative group">
              <HelpCircle className="w-5 h-5 text-zinc-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                支持.docx格式，最大1MB
              </div>
            </div>
          </div>

          <label
            className={cn(
              "relative block p-8 border-2 border-dashed rounded-xl",
              "transition-all duration-200 cursor-pointer",
              dragActive ? "border-blue-500 bg-blue-50/50" : "border-zinc-300 hover:border-blue-400",
              file ? "border-green-500 bg-green-50/30" : "",
              !serverStatus.connected && "opacity-50 cursor-not-allowed"
            )}
            onDragEnter={(e) => {
              e.preventDefault();
              if (serverStatus.connected) setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => serverStatus.connected && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_CONFIG.allowedExtensions}
              onChange={handleFileChange}
              className="hidden"
              disabled={!serverStatus.connected}
            />

            {!file ? (
              <div className="flex flex-col items-center gap-3">
                <Upload className={cn(
                  "w-12 h-12",
                  "transition-all duration-300",
                  dragActive ? "text-blue-500 scale-110" : "text-blue-400",
                  "animate-bounce"
                )} />
                <p className="text-zinc-700 dark:text-zinc-300">
                  点击或拖拽文件上传
                </p>
                <p className="text-sm text-zinc-500">
                  支持 .docx 格式，最大 1MB
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {loading && (
                    <div className="mt-2 h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            )}
          </label>
        </div>

        {/* 上传按钮 */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || !serverStatus.connected || loading}
            className={cn(
              "w-48 h-12 rounded-xl font-medium text-white",
              "transition-all duration-300",
              loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transform hover:scale-105 active:scale-95"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                处理中...
              </span>
            ) : (
              '开始分析'
            )}
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className={cn(
            "fixed bottom-4 right-4 p-4 rounded-xl",
            "bg-red-500 text-white",
            "shadow-lg animate-in fade-in slide-in-from-right"
          )}>
            {error}
          </div>
        )}
      </div>

      {/* 结果对话框 */}
      <ResultDialog
        open={showResultDialog}
        onClose={() => setShowResultDialog(false)}
        result={analysisResult}
      />
    </>
  );
};

export default UploadForm;