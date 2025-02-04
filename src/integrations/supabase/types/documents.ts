import { Database } from './base';

export interface DocumentAnalysis {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  analysis_status: string;
  analysis_result: {
    summary: string;
    keyPoints: string[];
    suggestedActions: string[];
    categories?: string[];
  } | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];