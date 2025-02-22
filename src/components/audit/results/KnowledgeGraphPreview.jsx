// components/audit/results/KnowledgeGraphPreview.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const KnowledgeGraphPreview = ({ 
  open, 
  onOpenChange, 
  htmlContent 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>知识图谱预览</DialogTitle>
        </DialogHeader>
        <div 
          className="flex-1 overflow-auto"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </DialogContent>
    </Dialog>
  );
};