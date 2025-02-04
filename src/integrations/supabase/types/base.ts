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
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          manager_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          manager_id?: string | null
          updated_at?: string
        }
      }
      document_analysis: {
        Row: {
          id: string
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          analysis_status: string
          analysis_result: {
            summary: string
            keyPoints: string[]
            suggestedActions: string[]
            categories?: string[]
          } | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          analysis_status?: string
          analysis_result?: Json | null
          created_by?: string | null
        }
        Update: {
          analysis_status?: string
          analysis_result?: Json | null
          updated_at?: string
        }
      }
      project_assignments: {
        Row: {
          id: string
          project_id: string | null
          staff_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          project_id?: string | null
          staff_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          project_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
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
        Insert: {
          title: string
          description?: string | null
          file_url?: string | null
          file_type?: string | null
          uploaded_by?: string | null
          department_id?: string | null
          access_level?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          file_url?: string | null
          file_type?: string | null
          department_id?: string | null
          access_level?: string | null
        }
      }
    }
  }
}