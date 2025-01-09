export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface CoreTables {
  departments: {
    Row: {
      id: string
      name: string
      description: string | null
      manager_id: string | null
      created_at: string
      updated_at: string
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
      id?: string
      name?: string
      description?: string | null
      manager_id?: string | null
      created_at?: string
      updated_at?: string
    }
    Relationships: [
      {
        foreignKeyName: "departments_manager_id_fkey"
        columns: ["manager_id"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      }
    ]
  }
  project_assignments: {
    Row: {
      id: string
      project_name: string
      description: string | null
      assigned_to: string
      department_id: string
      start_date: string
      end_date: string | null
      status: "pending" | "in_progress" | "completed" | "cancelled"
      priority: "low" | "medium" | "high"
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      project_name: string
      description?: string | null
      assigned_to: string
      department_id: string
      start_date: string
      end_date?: string | null
      status?: "pending" | "in_progress" | "completed" | "cancelled"
      priority?: "low" | "medium" | "high"
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      project_name?: string
      description?: string | null
      assigned_to?: string
      department_id?: string
      start_date?: string
      end_date?: string | null
      status?: "pending" | "in_progress" | "completed" | "cancelled"
      priority?: "low" | "medium" | "high"
      created_at?: string
      updated_at?: string
    }
    Relationships: [
      {
        foreignKeyName: "project_assignments_assigned_to_fkey"
        columns: ["assigned_to"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      },
      {
        foreignKeyName: "project_assignments_department_id_fkey"
        columns: ["department_id"]
        isOneToOne: false
        referencedRelation: "departments"
        referencedColumns: ["id"]
      }
    ]
  }
  document_archive: {
    Row: {
      id: string
      title: string
      description: string | null
      file_path: string
      file_type: string
      file_size: number
      uploaded_by: string
      department_id: string | null
      tags: string[] | null
      is_archived: boolean
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      title: string
      description?: string | null
      file_path: string
      file_type: string
      file_size: number
      uploaded_by: string
      department_id?: string | null
      tags?: string[] | null
      is_archived?: boolean
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      title?: string
      description?: string | null
      file_path?: string
      file_type?: string
      file_size?: number
      uploaded_by?: string
      department_id?: string | null
      tags?: string[] | null
      is_archived?: boolean
      created_at?: string
      updated_at?: string
    }
    Relationships: [
      {
        foreignKeyName: "document_archive_department_id_fkey"
        columns: ["department_id"]
        isOneToOne: false
        referencedRelation: "departments"
        referencedColumns: ["id"]
      },
      {
        foreignKeyName: "document_archive_uploaded_by_fkey"
        columns: ["uploaded_by"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      }
    ]
  }
}