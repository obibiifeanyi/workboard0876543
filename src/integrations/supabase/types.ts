export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accountant_settings: {
        Row: {
          auto_approve_limit: number | null
          created_at: string | null
          default_approval_workflow: string | null
          email_notifications: boolean | null
          id: string
          notification_preferences: Json | null
          require_dual_approval: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_approve_limit?: number | null
          created_at?: string | null
          default_approval_workflow?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_preferences?: Json | null
          require_dual_approval?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_approve_limit?: number | null
          created_at?: string | null
          default_approval_workflow?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_preferences?: Json | null
          require_dual_approval?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accountant_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_invoices: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          invoice_number: string
          paid_date: string | null
          payment_reference: string | null
          payment_status: string | null
          updated_at: string
          vendor_name: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_number: string
          paid_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          updated_at?: string
          vendor_name: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_number?: string
          paid_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          updated_at?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_documents: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          cost_per_request: number
          created_at: string
          created_by: string | null
          current_usage: number
          id: string
          is_active: boolean
          key_type: string
          last_used: string | null
          name: string
          total_cost: number
          updated_at: string
          usage_limit: number
        }
        Insert: {
          cost_per_request?: number
          created_at?: string
          created_by?: string | null
          current_usage?: number
          id?: string
          is_active?: boolean
          key_type: string
          last_used?: string | null
          name: string
          total_cost?: number
          updated_at?: string
          usage_limit?: number
        }
        Update: {
          cost_per_request?: number
          created_at?: string
          created_by?: string | null
          current_usage?: number
          id?: string
          is_active?: boolean
          key_type?: string
          last_used?: string | null
          name?: string
          total_cost?: number
          updated_at?: string
          usage_limit?: number
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string | null
          cost: number
          created_at: string
          date: string
          endpoint: string
          id: string
          request_count: number
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          cost?: number
          created_at?: string
          date?: string
          endpoint: string
          id?: string
          request_count?: number
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          cost?: number
          created_at?: string
          date?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      assets_inventory: {
        Row: {
          condition: string | null
          created_at: string
          created_by: string | null
          department_id: string | null
          id: string
          location: string | null
          name: string
          purchase_date: string | null
          purchase_price: number | null
          status: string | null
          type: string
          updated_at: string
        }
        Insert: {
          condition?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          id?: string
          location?: string | null
          name: string
          purchase_date?: string | null
          purchase_price?: number | null
          status?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          condition?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          id?: string
          location?: string | null
          name?: string
          purchase_date?: string | null
          purchase_price?: number | null
          status?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_inventory_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_inventory_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      battery_inventory: {
        Row: {
          capacity_kwh: number | null
          condition: string | null
          created_at: string
          id: string
          location: string | null
          manufacturer: string
          model_name: string
          purchase_date: string | null
          status: string | null
          updated_at: string
          voltage: number | null
          warranty_expiry: string | null
        }
        Insert: {
          capacity_kwh?: number | null
          condition?: string | null
          created_at?: string
          id?: string
          location?: string | null
          manufacturer: string
          model_name: string
          purchase_date?: string | null
          status?: string | null
          updated_at?: string
          voltage?: number | null
          warranty_expiry?: string | null
        }
        Update: {
          capacity_kwh?: number | null
          condition?: string | null
          created_at?: string
          id?: string
          location?: string | null
          manufacturer?: string
          model_name?: string
          purchase_date?: string | null
          status?: string | null
          updated_at?: string
          voltage?: number | null
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      battery_sales: {
        Row: {
          battery_id: string | null
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          sale_date: string
          sale_price: number
          updated_at: string
        }
        Insert: {
          battery_id?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          sale_date: string
          sale_price: number
          updated_at?: string
        }
        Update: {
          battery_id?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          sale_date?: string
          sale_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "battery_sales_battery_id_fkey"
            columns: ["battery_id"]
            isOneToOne: false
            referencedRelation: "battery_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battery_sales_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ct_power_reports: {
        Row: {
          comments: string | null
          created_at: string
          created_by: string | null
          diesel_level: number
          generator_runtime: number
          id: string
          report_datetime: string
          site_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          created_by?: string | null
          diesel_level: number
          generator_runtime: number
          id?: string
          report_datetime: string
          site_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          created_by?: string | null
          diesel_level?: number
          generator_runtime?: number
          id?: string
          report_datetime?: string
          site_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ct_power_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          employee_count: number | null
          id: string
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_access_logs: {
        Row: {
          action: string
          created_at: string | null
          document_id: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analysis: {
        Row: {
          analysis_result: Json | null
          created_at: string
          created_by: string | null
          file_name: string
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string
          created_by?: string | null
          file_name: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string
          created_by?: string | null
          file_name?: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          access_level: string | null
          category: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          access_level?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          access_level?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_verification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          expense_date: string
          id: string
          receipt_url: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          expense_date: string
          id?: string
          receipt_url?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          expense_date?: string
          id?: string
          receipt_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          created_at: string | null
          generated_by: string | null
          id: string
          period_end: string
          period_start: string
          report_data: Json | null
          report_name: string
          report_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          period_end: string
          period_start: string
          report_data?: Json | null
          report_name: string
          report_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          period_end?: string
          period_start?: string
          report_data?: Json | null
          report_name?: string
          report_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_check: {
        Row: {
          checked_at: string | null
          id: number
        }
        Insert: {
          checked_at?: string | null
          id?: number
        }
        Update: {
          checked_at?: string | null
          id?: number
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memo_approvals: {
        Row: {
          approval_date: string | null
          approver_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          memo_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          memo_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          memo_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memo_approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memo_approvals_memo_id_fkey"
            columns: ["memo_id"]
            isOneToOne: false
            referencedRelation: "memos"
            referencedColumns: ["id"]
          },
        ]
      }
      memos: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          department: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          document_notifications: boolean | null
          email_enabled: boolean | null
          id: string
          leave_notifications: boolean | null
          memo_notifications: boolean | null
          push_enabled: boolean | null
          task_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_notifications?: boolean | null
          email_enabled?: boolean | null
          id?: string
          leave_notifications?: boolean | null
          memo_notifications?: boolean | null
          push_enabled?: boolean | null
          task_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_notifications?: boolean | null
          email_enabled?: boolean | null
          id?: string
          leave_notifications?: boolean | null
          memo_notifications?: boolean | null
          push_enabled?: boolean | null
          task_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          priority: string | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          priority?: string | null
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_method: string
          processed_by: string | null
          status: string | null
          transaction_date: string
          transaction_reference: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method: string
          processed_by?: string | null
          status?: string | null
          transaction_date: string
          transaction_reference?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_method?: string
          processed_by?: string | null
          status?: string | null
          transaction_date?: string
          transaction_reference?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "accounts_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          department_id: string | null
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          new_id: string | null
          phone: string | null
          phone_number: string | null
          position: string | null
          role: string | null
          role_id: string | null
          settings: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          department_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          new_id?: string | null
          phone?: string | null
          phone_number?: string | null
          position?: string | null
          role?: string | null
          role_id?: string | null
          settings?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          department_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          new_id?: string | null
          phone?: string | null
          phone_number?: string | null
          position?: string | null
          role?: string | null
          role_id?: string | null
          settings?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          staff_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          department_id: string | null
          description: string
          end_date: string | null
          id: string
          manager_id: string | null
          name: string
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          department_id?: string | null
          description: string
          end_date?: string | null
          id?: string
          manager_id?: string | null
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          department_id?: string | null
          description?: string
          end_date?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_reports: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          data: Json | null
          description: string | null
          id: string
          report_date: string
          report_type: string
          reported_by: string
          reviewed_by: string | null
          site_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          report_date: string
          report_type: string
          reported_by: string
          reviewed_by?: string | null
          site_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          report_date?: string
          report_type?: string
          reported_by?: string
          reviewed_by?: string | null
          site_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "telecom_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      system_activities: {
        Row: {
          created_at: string
          description: string
          id: string
          metadata: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to_id: string | null
          completion_notes: string | null
          created_at: string | null
          created_by_id: string | null
          department_id: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: string
          project_id: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to_id?: string | null
          completion_notes?: string | null
          created_at?: string | null
          created_by_id?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string
          project_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to_id?: string | null
          completion_notes?: string | null
          created_at?: string | null
          created_by_id?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string
          project_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telecom_sites: {
        Row: {
          address: string | null
          client_list: string[] | null
          coordinates: unknown | null
          created_at: string | null
          id: string
          installation_date: string | null
          last_maintenance: string | null
          location: string
          manager_id: string | null
          name: string
          next_maintenance: string | null
          notes: string | null
          region: string | null
          site_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          client_list?: string[] | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance?: string | null
          location: string
          manager_id?: string | null
          name: string
          next_maintenance?: string | null
          notes?: string | null
          region?: string | null
          site_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          client_list?: string[] | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance?: string | null
          location?: string
          manager_id?: string | null
          name?: string
          next_maintenance?: string | null
          notes?: string | null
          region?: string | null
          site_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string | null
          id: string
          notes: string | null
          project_id: string | null
          task_id: string | null
          total_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clock_in: string
          clock_out?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          task_id?: string | null
          total_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          task_id?: string | null
          total_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memos: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
