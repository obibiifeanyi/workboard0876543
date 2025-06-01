
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface FileUploadProcessorProps {
  onDataProcessed: (data: any[], columns: string[]) => void;
}

export const FileUploadProcessor = ({ onDataProcessed }: FileUploadProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        await processExcelFile(file);
      } else if (fileExtension === 'csv') {
        await processCSVFile(file);
      } else {
        throw new Error('Unsupported file format. Please upload Excel (.xlsx, .xls) or CSV files.');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const processExcelFile = async (file: File) => {
    const reader = new FileReader();
    
    return new Promise<void>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          setProgress(25);
          
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          setProgress(50);
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          setProgress(75);
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const [headers, ...rows] = jsonData as any[][];
          
          // Clean and normalize headers
          const cleanHeaders = headers.map((header: string) => 
            header.toString().trim().toLowerCase().replace(/\s+/g, '_')
          );
          
          // Convert rows to objects
          const processedData = rows
            .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
            .map(row => {
              const obj: any = {};
              cleanHeaders.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
          
          setProgress(100);
          
          onDataProcessed(processedData, cleanHeaders);
          
          toast({
            title: "Success",
            description: `Processed ${processedData.length} records from Excel file`,
          });
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processCSVFile = async (file: File) => {
    const reader = new FileReader();
    
    return new Promise<void>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          setProgress(25);
          
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim());
          
          setProgress(50);
          
          if (lines.length === 0) {
            throw new Error('Empty CSV file');
          }
          
          const headers = lines[0].split(',').map(header => 
            header.trim().replace(/"/g, '').toLowerCase().replace(/\s+/g, '_')
          );
          
          setProgress(75);
          
          const processedData = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            return obj;
          });
          
          setProgress(100);
          
          onDataProcessed(processedData, headers);
          
          toast({
            title: "Success",
            description: `Processed ${processedData.length} records from CSV file`,
          });
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload & Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Upload Excel or CSV File</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            ref={fileInputRef}
            disabled={isProcessing}
          />
        </div>
        
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="text-sm">Processing {fileName}...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Supported formats: Excel (.xlsx, .xls), CSV (.csv)
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            First row should contain column headers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
