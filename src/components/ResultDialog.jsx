import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
  Fade,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CelebrationIcon from '@mui/icons-material/Celebration';
import TableChartIcon from '@mui/icons-material/TableChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';

// 现代化主题颜色
const THEME_COLORS = {
  primary: {
    main: '#4F46E5',
    light: '#8A7CFF',
    dark: '#321FAB',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#E3E3FF',
    light: '#FFFFFF',
    dark: '#C0C0FF',
    contrastText: '#333333'
  },
  success: '#66BB6A',
  warning: '#FFCA28',
  error: '#E53935'
};

// 自定义样式组件
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: `linear-gradient(145deg, ${THEME_COLORS.secondary.light} 0%, ${THEME_COLORS.secondary.main} 100%)`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  maxHeight: '60vh',
  overflow: 'auto',
  transition: 'all 0.3s ease',
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: THEME_COLORS.secondary.main,
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: THEME_COLORS.primary.light,
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: THEME_COLORS.primary.main,
    },
  },
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  transition: 'all 0.3s ease',
  borderColor: THEME_COLORS.primary.main,
  color: THEME_COLORS.primary.main,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
  },
  '&.MuiChip-filled': {
    backgroundColor: THEME_COLORS.primary.main,
    color: THEME_COLORS.primary.contrastText,
  },
}));

// 生成Excel文件
const generateExcel = (data) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // 设置列宽
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key]).length))
  }));
  worksheet['!cols'] = colWidths;

  // 添加样式
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = {c: C, r: R};
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if (!worksheet[cell_ref]) continue;
      
      worksheet[cell_ref].s = {
        font: {
          name: 'Arial',
          sz: 11,
          color: { rgb: R === 0 ? "FFFFFF" : "000000" }
        },
        fill: {
          fgColor: { rgb: R === 0 ? "2196F3" : R % 2 ? "F5F5F5" : "FFFFFF" }
        },
        border: {
          top: { style: 'thin', color: { rgb: "E0E0E0" } },
          bottom: { style: 'thin', color: { rgb: "E0E0E0" } },
          left: { style: 'thin', color: { rgb: "E0E0E0" } },
          right: { style: 'thin', color: { rgb: "E0E0E0" } }
        },
        alignment: {
          vertical: 'center',
          horizontal: 'left',
          wrapText: true
        }
      };
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, "分析结果");
  return workbook;
};

// 生成HTML模板
const generateStyledHTML = (data) => {
  const headers = Object.keys(data[0]);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 2rem;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 2rem;
        }
        table { 
          border-collapse: collapse; 
          width: 100%;
          margin: 1rem 0;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
        }
        th { 
          background-color: ${THEME_COLORS.primary.main}; 
          color: white; 
          padding: 1rem;
          text-align: left;
          font-weight: 500;
        }
        td { 
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #eee;
          color: #333;
        }
        tr:nth-child(even) { background-color: #f8f9fa; }
        tr:hover { background-color: #f1f4f8; }
        .header {
          margin-bottom: 2rem;
          color: ${THEME_COLORS.primary.main};
          border-bottom: 2px solid ${THEME_COLORS.primary.light};
          padding-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>分析结果报告</h2>
          <p>生成时间：${new Date().toLocaleString()}</p>
        </div>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
};

function ResultDialog({ open, onClose, result }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // 表格数据处理
  const tableData = useMemo(() => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      return { headers: [], rows: [] };
    }
    const headers = Array.from(new Set(result.flatMap(obj => Object.keys(obj))));
    return { headers, rows: result };
  }, [result]);

  // 处理Excel导出
  const handleExportExcel = () => {
    if (!result || result.length === 0) return;

    setLoading(true);
    try {
      const workbook = generateExcel(result);
      XLSX.writeFile(workbook, `分析结果_${new Date().toISOString().slice(0,10)}.xlsx`);
      
      setSnackbar({
        open: true,
        message: 'Excel文件导出成功',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '导出失败，请重试',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理复制功能
  const handleCopyResult = async () => {
    if (!result || result.length === 0) return;

    setLoading(true);
    try {
      const htmlContent = generateStyledHTML(result);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([JSON.stringify(result, null, 2)], { type: 'text/plain' })
        })
      ]);
      
      setSnackbar({
        open: true,
        message: '已成功复制到剪贴板',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '复制失败，请重试',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理HTML下载
  const handleDownloadHTML = () => {
    if (!result || result.length === 0) return;

    setLoading(true);
    try {
      const htmlContent = generateStyledHTML(result);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `分析结果_${new Date().toISOString().slice(0,10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'HTML文件下载成功',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '下载失败，请重试',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        fullScreen={fullScreen}
        TransitionComponent={Zoom}
      >
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: THEME_COLORS.primary.light,
              '& .MuiLinearProgress-bar': {
                backgroundColor: THEME_COLORS.primary.dark,
              }
            }} 
          />
        )}

        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            background: THEME_COLORS.primary.main,
            color: THEME_COLORS.primary.contrastText,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CelebrationIcon />
            <Typography variant="h6" component="span">
              分析结果
            </Typography>
            {result && Array.isArray(result) && (
              <Chip
                size="small"
                label={`${result.length} 条数据`}
                sx={{ 
                  ml: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: THEME_COLORS.primary.contrastText,
                }}
              />
            )}
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: THEME_COLORS.primary.contrastText,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2, pb: 1 }}>
          <Fade in={true} timeout={800}>
            <Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 3,
                justifyContent: 'center' 
              }}>
                <CheckCircleOutlineIcon sx={{ color: THEME_COLORS.success, fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: THEME_COLORS.primary.main }}>
                  分析完成
                </Typography>
              </Box>

              {result && Array.isArray(result) && result.length > 0 ? (
                <StyledTableContainer component={Paper} elevation={3}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {tableData.headers.map((header, index) => (
                          <TableCell
                            key={index}
                            sx={{
                              fontWeight: 500,
                              backgroundColor: THEME_COLORS.primary.main,
                              color: THEME_COLORS.primary.contrastText,
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: THEME_COLORS.primary.dark,
                              },
                            }}
                          >
                            <Tooltip title={header} arrow placement="top">
                              <Typography variant="subtitle2">
                                {header}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.rows.map((row, rowIndex) => (
                        <TableRow
                          key={rowIndex}
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: 'rgba(33, 150, 243, 0.02)',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.05)',
                            },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          {tableData.headers.map((header, cellIndex) => {
                            const cellValue = row[header] || '';
                            return (
                              <TableCell 
                                key={cellIndex}
                                sx={{
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  color: THEME_COLORS.secondary.contrastText,
                                }}
                              >
                                <Tooltip 
                                  title={cellValue.toString()} 
                                  arrow
                                  placement="top"
                                >
                                  <Typography variant="body2" noWrap>
                                    {cellValue.toString()}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              ) : (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    mb: 3,
                    textAlign: 'center',
                    color: 'text.secondary',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography>
                    暂无数据显示
                  </Typography>
                </Paper>
              )}

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                justifyContent: 'center',
                mt: 3
              }}>
                <AnimatedChip
                  icon={<ContentCopyIcon />}
                  label="复制"
                  onClick={handleCopyResult}
                  variant="outlined"
                  disabled={!result || result.length === 0 || loading}
                />
                <AnimatedChip
                  icon={<FileDownloadIcon />}
                  label="导出Excel"
                  onClick={handleExportExcel}
                  variant="outlined"
                  disabled={!result || result.length === 0 || loading}
                />
                <AnimatedChip
                  icon={<DownloadIcon />}
                  label="下载HTML"
                  onClick={handleDownloadHTML}
                  variant="outlined"
                  disabled={!result || result.length === 0 || loading}
                />
                <AnimatedChip
                  icon={<TableChartIcon />}
                  label={`总计: ${result ? result.length : 0} 条数据`}
                  variant="filled"
                />
                <AnimatedChip
                  icon={<FilterListIcon />}
                  label="筛选"
                  variant="outlined"
                  onClick={() => {
                    setSnackbar({
                      open: true,
                      message: '筛选功能开发中',
                      severity: 'info'
                    });
                  }}
                />
                <AnimatedChip
                  icon={<ViewColumnIcon />}
                  label="列设置"
                  variant="outlined"
                  onClick={() => {
                    setSnackbar({
                      open: true,
                      message: '列设置功能开发中',
                      severity: 'info'
                    });
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </DialogContent>

        <DialogActions 
          sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            bgcolor: 'rgba(33, 150, 243, 0.02)',
          }}
        >
          <Button 
            onClick={onClose}
            variant="contained"
            startIcon={<CloseIcon />}
            sx={{
              minWidth: 120,
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: THEME_COLORS.primary.main,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: THEME_COLORS.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
              },
            }}
          >
            关闭
          </Button>
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'success' ? THEME_COLORS.success :
                           snackbar.severity === 'error' ? THEME_COLORS.error :
                           snackbar.severity === 'warning' ? THEME_COLORS.warning :
                           THEME_COLORS.primary.main
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResultDialog;