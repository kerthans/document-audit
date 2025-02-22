// components/audit/results/ResultDialog.jsx
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ResultActions } from './ResultActions';
import { ResultTable } from './ResultTable';
import { KnowledgeGraphPreview } from './KnowledgeGraphPreview';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const API_URL = 'http://localhost:8888';

export function ResultDialog({ open, onClose, result }) {
  const [loading, setLoading] = useState(false);
  const [graphDialog, setGraphDialog] = useState(false);
  const [graphHtml, setGraphHtml] = useState('');
  const { toast } = useToast();

  const tableData = useMemo(() => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      return { headers: [], rows: [] };
    }
    const headers = Array.from(new Set(result.flatMap(obj => Object.keys(obj))));
    return { headers, rows: result };
  }, [result]);

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const workbook = generateExcel(result);
      XLSX.writeFile(workbook, `分析结果_${new Date().toISOString().slice(0,10)}.xlsx`);
      toast({ title: "Excel文件导出成功" });
    } catch (error) {
      toast({ title: "导出失败，请重试", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = async () => {
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
      toast({ title: "已成功复制到剪贴板" });
    } catch (error) {
      toast({ title: "复制失败，请重试", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = () => {
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
      toast({ title: "HTML文件下载成功" });
    } catch (error) {
      toast({ title: "下载失败，请重试", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGraphPreview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/run-script`);
      setGraphHtml(response.data);
      setGraphDialog(true);
    } catch (error) {
      toast({ 
        title: "获取知识图谱失败", 
        description: error.response?.data || "请稍后重试",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <div className="space-y-6 flex-1 overflow-hidden">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                分析结果
              </h2>
              <p className="text-sm text-muted-foreground">
                共计 {result?.length || 0} 条数据
              </p>
            </div>

            {result?.length > 0 ? (
              <ResultTable 
                headers={tableData.headers} 
                rows={tableData.rows} 
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无数据显示
              </div>
            )}

            <ResultActions
              result={result}
              loading={loading}
              onCopy={handleCopyResult}
              onExportExcel={handleExportExcel}
              onDownloadHTML={handleDownloadHTML}
              handleGraphPreview={handleGraphPreview}
              disabled={!result?.length}
            />
          </div>
        </DialogContent>
      </Dialog>

      <KnowledgeGraphPreview
        open={graphDialog}
        onOpenChange={setGraphDialog}
        htmlContent={graphHtml}
      />
    </>
  );
}