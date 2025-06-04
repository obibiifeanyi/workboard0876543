import { Database } from './base';
import { DocumentAnalysis as BaseDocumentAnalysis } from '@/types/ai';

// Re-export the DocumentAnalysis from the central type definition
export type { DocumentAnalysis } from '@/types/ai';

export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];