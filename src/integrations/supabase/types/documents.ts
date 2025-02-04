import { Json } from './base';

export interface DocumentTypes {
  documents: {
    Row: {
      id: string;
      title: string;
      description: string | null;
      file_url: string | null;
      file_type: string | null;
      uploaded_by: string | null;
      department_id: string | null;
      access_level: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      title: string;
      description?: string | null;
      file_url?: string | null;
      file_type?: string | null;
      uploaded_by?: string | null;
      department_id?: string | null;
      access_level?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      title?: string;
      description?: string | null;
      file_url?: string | null;
      file_type?: string | null;
      uploaded_by?: string | null;
      department_id?: string | null;
      access_level?: string | null;
      updated_at?: string;
    };
  };
}