// components/audit/results/ResultTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ResultTable = ({ headers, rows }) => {
  return (
    <ScrollArea className="h-[60vh] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead 
                key={index}
                className="bg-muted/50 font-semibold"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {header}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{header}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, cellIndex) => {
                const cellValue = row[header] || '';
                return (
                  <TableCell 
                    key={cellIndex}
                    className="max-w-[200px] truncate"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {cellValue.toString()}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{cellValue.toString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};