export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      document_analysis: {
        Row: {
          id: string
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          analysis_status: string
          analysis_result: Json | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['document_analysis']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['document_analysis']['Insert']>
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string | null
          file_type: string | null
          uploaded_by: string | null
          department_id: string | null
          access_level: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      // Add other tables here as needed
    }
  }
}
