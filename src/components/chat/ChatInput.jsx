import React, { useState, useRef, useEffect } from "react";
import { Plus, Mic, File, Camera, X, ArrowRight } from "lucide-react";

const FileDisplay = ({ fileName, onClear }) => (
  <div className="flex items-center gap-2 bg-[#f4f4f8] w-fit px-3 py-1 rounded-lg group">
    <File className="w-4 h-4 text-[#5046e5]" />
    <span className="text-sm text-gray-700">{fileName}</span>
    <button
      type="button"
      onClick={onClear}
      className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
    >
      <X className="w-3 h-3 text-gray-500" />
    </button>
  </div>
);

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // 自动调整文本区域高度
  const adjustHeight = (reset = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    if (reset) {
      textarea.style.height = "56px";
      return;
    }
    
    textarea.style.height = "56px";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(Math.max(56, scrollHeight), 120)}px`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 文件大小限制为5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("文件大小超过5MB限制");
        return;
      }
      setFileName(file.name);
    }
  };

  const clearFile = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue);
        setInputValue("");
        adjustHeight(true);
      }
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className="w-full">
      <div className="relative max-w-4xl w-full mx-auto flex flex-col gap-2">
        {fileName && (
          <FileDisplay fileName={fileName} onClear={clearFile} />
        )}

        <div className="relative">
          <div
            ref={menuRef}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full bg-white p-2 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <Plus className={`w-5 h-5 text-[#5046e5] ${isLoading ? 'opacity-50' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50 border border-gray-100">
                <button
                  type="button"
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  onClick={handleFileUpload}
                >
                  <File className="w-4 h-4 text-[#5046e5]" />
                  <span>上传文件</span>
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Mic className="w-4 h-4 text-[#5046e5]" />
                  <span>语音输入</span>
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Camera className="w-4 h-4 text-[#5046e5]" />
                  <span>拍照</span>
                </button>
              </div>
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
          />

          <textarea
            placeholder="有什么想问的..."
            className="w-full px-14 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5046e5] focus:border-transparent placeholder-gray-400 text-gray-700 min-h-[56px] max-h-[120px]"
            ref={textareaRef}
            value={inputValue}
            disabled={isLoading}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustHeight();
            }}
            rows={1}
          />

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-[#5046e5] p-2 hover:bg-[#4037cc] transition-colors disabled:opacity-50 disabled:bg-[#5046e5]"
            type="button"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;