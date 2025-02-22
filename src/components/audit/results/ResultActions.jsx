// components/audit/results/ResultActions.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  Copy, 
  FileDown, 
  Download, 
  Table2, 
  Filter,
  Columns,
  Network,
  ArrowUpRight
} from 'lucide-react';

export const ResultActions = ({ 
  result, 
  loading, 
  onCopy, 
  onExportExcel, 
  onDownloadHTML,
  onShowKnowledgeGraph,
  handleGraphPreview,
  disabled 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      <ActionButton
        icon={<Copy className="w-4 h-4" />}
        label="复制"
        onClick={onCopy}
        disabled={disabled || loading}
      />
      <ActionButton
        icon={<FileDown className="w-4 h-4" />}
        label="导出Excel"
        onClick={onExportExcel}
        disabled={disabled || loading}
      />
      <ActionButton
        icon={<Download className="w-4 h-4" />}
        label="下载HTML"
        onClick={onDownloadHTML}
        disabled={disabled || loading}
      />
      <ActionButton
        icon={<Network className="w-4 h-4" />}
        label="知识图谱"
        onClick={handleGraphPreview}
        variant="gradient"
        className="relative group"
        disabled={disabled || loading}
      />
      <div className="flex gap-2">
        <Tooltip content={`总计: ${result?.length || 0} 条数据`}>
          <Button variant="outline" className="gap-2" disabled>
            <Table2 className="w-4 h-4" />
            <span>{result?.length || 0}</span>
          </Button>
        </Tooltip>
        <Tooltip content="筛选功能开发中">
          <Button variant="outline" className="gap-2" disabled>
            <Filter className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="列设置功能开发中">
          <Button variant="outline" className="gap-2" disabled>
            <Columns className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

const ActionButton = ({ 
  icon, 
  label, 
  onClick, 
  disabled, 
  variant = "outline",
  className = ""
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className={cn(
        "relative h-10 px-4 gap-2",
        variant === "gradient" && "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
        variant === "gradient" && "text-white hover:text-white",
        variant === "gradient" && "border-0",
        "transition-all duration-200 group",
        className
      )}
    >
      {icon}
      <span>{label}</span>
      {variant === "gradient" && (
        <ArrowUpRight className="w-3.5 h-3.5 opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      )}
    </Button>
  );
};
