import { Database } from './base';

export interface DocumentAnalysis extends Database['public']['Tables']['document_analysis']['Row'] {
  summary?: string;
  keyPoints?: string[];
  suggestedActions?: string[];
  categories?: string[];
}

export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];