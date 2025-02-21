import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  LinearProgress, 
  Paper,
  Fade,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Zoom,
  useTheme,
  alpha
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import axios from 'axios';
import ResultDialog from './ResultDialog';

// API配置
const API_URL = 'http://localhost:8888';
// const API_URL = 'http://47.109.205.129:5001';


const FILE_CONFIG = {
  maxSize: 1024 * 1024,
  allowedTypes: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowedExtensions: '.docx'
};

// 动画关键帧
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(33, 150, 243, 0); }
  100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
`;

// 样式组件
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '700px',
  borderRadius: theme.spacing(2),
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.light, 0.05)})`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed',
  borderColor: alpha(theme.palette.text.secondary, 0.23),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  backgroundColor: 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    '& .upload-icon': {
      animation: `${float} 2s ease-in-out infinite`
    }
  },
  '&.dragActive': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  '&.hasFile': {
    borderColor: theme.palette.success.main,
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 220,
  height: 48,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:not(:disabled):hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: `0 6px 10px 4px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  '&:not(:disabled):active': {
    transform: 'translateY(1px)',
  },
  '&.loading': {
    animation: `${pulse} 2s infinite`
  }
}));
function UploadSection() {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [connected, setConnected] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const eventSourceRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // 生成唯一的客户端ID
    const generateClientId = () => {
      return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    };

    const newClientId = generateClientId();
    setClientId(newClientId);

    // 建立 SSE 连接
    // const setupEventSource = () => {
    //   const eventSource = new EventSource(`${API_URL}/api/events?clientId=${newClientId}`);
    //   eventSourceRef.current = eventSource;

    //   eventSource.onopen = () => {
    setConnected(true);
    //     showSnackbar('已成功连接到服务器', 'success');
    //   };

    //   eventSource.onerror = (error) => {
    //     console.error('SSE连接错误:', error);
    //     setConnected(false);
    //     showSnackbar('服务器连接失败，正在重试...', 'warning');
        
    //     // 错误处理和重连逻辑
    //     if (eventSource.readyState === EventSource.CLOSED) {
    //       setTimeout(setupEventSource, 5000); // 5秒后重试
    //     }
    //   };

    //   // 处理服务器发送的消息
    //   eventSource.onmessage = (event) => {
    //     try {
    //       const data = JSON.parse(event.data);
    //       handleServerEvent(data);
    //     } catch (error) {
    //       console.error('解析服务器消息失败:', error);
    //     }
    //   };
    // };

    // setupEventSource();

    // 组件卸载时清理
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleServerEvent = (event) => {
    switch (event.type) {
      case 'upload_progress':
        setProgress(event.data.progress);
        break;
      case 'processing_start':
        showSnackbar('开始处理文档...', 'info');
        break;
      case 'processing_complete':
        setResult(event.data.result);
        setLoading(false);
        setProgress(100);
        setDialogOpen(true);
        showSnackbar('文档分析完成！', 'success');
        break;
      case 'processing_error':
        if (event.data.filename === file?.name) {
          showSnackbar(`处理失败: ${event.data.error}`, 'error');
          setLoading(false);
          setProgress(0);
        }
        break;
      case 'connection_status':
        setConnected(event.data.connected);
        showSnackbar(event.data.message, event.data.connected ? 'success' : 'warning');
        break;
      default:
        console.log('未处理的事件类型:', event.type);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > FILE_CONFIG.maxSize) {
      showSnackbar('文件大小超过1MB限制', 'error');
      return;
    }

    if (!FILE_CONFIG.allowedTypes.includes(selectedFile.type)) {
      showSnackbar('请上传Word文档(.docx)格式的文件', 'error');
      return;
    }

    setFile(selectedFile);
    setResult(null);
    showSnackbar('文件已选择，可以开始分析', 'success');
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showSnackbar('已清除文件', 'info');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > FILE_CONFIG.maxSize) {
        showSnackbar('文件大小超过1MB限制', 'error');
        return;
      }
      if (!FILE_CONFIG.allowedTypes.includes(droppedFile.type)) {
        showSnackbar('请上传Word文档(.docx)格式的文件', 'error');
        return;
      }
      setFile(droppedFile);
      setResult(null);
      showSnackbar('文件已选择，可以开始分析', 'success');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showSnackbar('请先选择文件', 'warning');
      return;
    }
  
    if (!connected) {
      showSnackbar('未连接到服务器，请稍后重试', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    setLoading(true);
    setProgress(0);
    setResult(null);
  
    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Client-ID': clientId,
        },
        withCredentials: true, // 添加这行
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      
      showSnackbar('文档已上传，正在进行智能分析...', 'info');
    } catch (error) {
      console.error('上传失败:', error);
      const errorMessage = error.response?.data?.error || '上传失败，请重试';
      showSnackbar(errorMessage, 'error');
      setLoading(false);
    }
  };
  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: 3,
          gap: 3,
        }}
      >
        <StyledPaper elevation={3}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}
          >
            <AutoGraphIcon sx={{ fontSize: 40 }} />
            智能文档分析系统
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'text.secondary',
                mb: 2
              }}
            >
              <DescriptionIcon fontSize="small" />
              上传分析文档
              <Tooltip 
                title="支持Word文档(.docx)格式，文件大小不超过1MB" 
                arrow
                placement="right"
              >
                <HelpOutlineIcon 
                  fontSize="small" 
                  color="action"
                  sx={{ cursor: 'help' }}
                />
              </Tooltip>
            </Typography>
            
            <UploadBox
              component="label"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`${dragActive ? 'dragActive' : ''} ${file ? 'hasFile' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_CONFIG.allowedExtensions}
                hidden
                onChange={handleFileChange}
              />
              <Zoom in={true}>
                <CloudUploadIcon 
                  className="upload-icon"
                  sx={{ 
                    fontSize: 56,
                    color: file ? 'success.main' : 'primary.main',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                />
              </Zoom>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                align="center" 
                sx={{ 
                  mb: 1,
                  fontWeight: 500
                }}
              >
                {file ? file.name : '点击或拖拽文档至此处'}
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary" 
                align="center"
                sx={{
                  opacity: 0.7
                }}
              >
                支持格式: .docx | 最大大小: 1MB
              </Typography>
              {file && (
                <Zoom in={true}>
                  <IconButton
                    size="small"
                    onClick={handleClearFile}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      bgcolor: 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'error.light',
                        transform: 'rotate(90deg)',
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Zoom>
              )}
            </UploadBox>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <StyledButton
              variant="contained"
              onClick={handleUpload}
              disabled={loading || !connected || !file}
              className={loading ? 'loading' : ''}
            >
              {loading ? (
                <>
                  <CircularProgress 
                    size={24} 
                    color="inherit" 
                    sx={{ mr: 1 }} 
                  />
                  正在分析中...
                </>
              ) : '开始智能分析'}
            </StyledButton>

            {loading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  align="center" 
                  sx={{ mt: 1 }}
                >
                  已完成 {progress}%
                </Typography>
              </Box>
            )}
          </Box>
        </StyledPaper>

        <ResultDialog 
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          result={result}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
            sx={{ 
              width: '100%',
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}

export default UploadSection;