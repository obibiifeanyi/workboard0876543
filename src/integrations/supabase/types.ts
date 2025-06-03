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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      battery_reports: {
        Row: {
          backup_time_remaining: number | null
          battery_id: string | null
          battery_voltage: number | null
          charging_status: string | null
          created_at: string
          current_capacity: number | null
          health_status: string | null
          id: string
          issues_reported: string | null
          load_current: number | null
          maintenance_notes: string | null
          maintenance_required: boolean | null
          next_maintenance_date: string | null
          photos: string[] | null
          recommendations: string | null
          report_date: string
          reporter_id: string
          runtime_hours: number | null
          site_id: string | null
          site_name: string | null
          temperature: number | null
          updated_at: string
        }
        Insert: {
          backup_time_remaining?: number | null
          battery_id?: string | null
          battery_voltage?: number | null
          charging_status?: string | null
          created_at?: string
          current_capacity?: number | null
          health_status?: string | null
          id?: string
          issues_reported?: string | null
          load_current?: number | null
          maintenance_notes?: string | null
          maintenance_required?: boolean | null
          next_maintenance_date?: string | null
          photos?: string[] | null
          recommendations?: string | null
          report_date?: string
          reporter_id: string
          runtime_hours?: number | null
          site_id?: string | null
          site_name?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          backup_time_remaining?: number | null
          battery_id?: string | null
          battery_voltage?: number | null
          charging_status?: string | null
          created_at?: string
          current_capacity?: number | null
          health_status?: string | null
          id?: string
          issues_reported?: string | null
          load_current?: number | null
          maintenance_notes?: string | null
          maintenance_required?: boolean | null
          next_maintenance_date?: string | null
          photos?: string[] | null
          recommendations?: string | null
          report_date?: string
          reporter_id?: string
          runtime_hours?: number | null
          site_id?: string | null
          site_name?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "battery_reports_battery_id_fkey"
            columns: ["battery_id"]
            isOneToOne: false
            referencedRelation: "battery_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battery_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battery_reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "telecom_sites"
            referencedColumns: ["id"]
          },
        ]
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
      construction_reports: {
        Row: {
          created_at: string
          created_by: string
          equipment_used: Json | null
          id: string
          issues_encountered: string | null
          materials_used: Json | null
          photos: string[] | null
          progress_percentage: number | null
          quality_rating: string | null
          report_date: string | null
          report_title: string
          report_type: string
          safety_incidents: number | null
          safety_notes: string | null
          site_id: string
          supervisor_signature: string | null
          updated_at: string
          weather_conditions: string | null
          work_performed: string | null
          workforce_count: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          equipment_used?: Json | null
          id?: string
          issues_encountered?: string | null
          materials_used?: Json | null
          photos?: string[] | null
          progress_percentage?: number | null
          quality_rating?: string | null
          report_date?: string | null
          report_title: string
          report_type: string
          safety_incidents?: number | null
          safety_notes?: string | null
          site_id: string
          supervisor_signature?: string | null
          updated_at?: string
          weather_conditions?: string | null
          work_performed?: string | null
          workforce_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          equipment_used?: Json | null
          id?: string
          issues_encountered?: string | null
          materials_used?: Json | null
          photos?: string[] | null
          progress_percentage?: number | null
          quality_rating?: string | null
          report_date?: string | null
          report_title?: string
          report_type?: string
          safety_incidents?: number | null
          safety_notes?: string | null
          site_id?: string
          supervisor_signature?: string | null
          updated_at?: string
          weather_conditions?: string | null
          work_performed?: string | null
          workforce_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "construction_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "construction_reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "construction_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      construction_sites: {
        Row: {
          actual_completion: string | null
          address: string | null
          budget_allocated: number | null
          budget_spent: number | null
          contractor_contact: string | null
          contractor_name: string | null
          coordinates: unknown | null
          created_at: string
          expected_completion: string | null
          id: string
          last_inspection: string | null
          location: string
          next_inspection: string | null
          notes: string | null
          project_id: string | null
          safety_rating: string | null
          site_code: string | null
          site_manager_id: string | null
          site_name: string
          site_type: string
          start_date: string | null
          status: string | null
          updated_at: string
          weather_dependent: boolean | null
        }
        Insert: {
          actual_completion?: string | null
          address?: string | null
          budget_allocated?: number | null
          budget_spent?: number | null
          contractor_contact?: string | null
          contractor_name?: string | null
          coordinates?: unknown | null
          created_at?: string
          expected_completion?: string | null
          id?: string
          last_inspection?: string | null
          location: string
          next_inspection?: string | null
          notes?: string | null
          project_id?: string | null
          safety_rating?: string | null
          site_code?: string | null
          site_manager_id?: string | null
          site_name: string
          site_type: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
          weather_dependent?: boolean | null
        }
        Update: {
          actual_completion?: string | null
          address?: string | null
          budget_allocated?: number | null
          budget_spent?: number | null
          contractor_contact?: string | null
          contractor_name?: string | null
          coordinates?: unknown | null
          created_at?: string
          expected_completion?: string | null
          id?: string
          last_inspection?: string | null
          location?: string
          next_inspection?: string | null
          notes?: string | null
          project_id?: string | null
          safety_rating?: string | null
          site_code?: string | null
          site_manager_id?: string | null
          site_name?: string
          site_type?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
          weather_dependent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "construction_sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "construction_sites_site_manager_id_fkey"
            columns: ["site_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ct_power_reports: {
        Row: {
          battery_status: string | null
          comments: string | null
          created_at: string
          created_by: string | null
          diesel_level: number
          generator_runtime: number
          id: string
          power_reading: number | null
          report_datetime: string
          report_number: string | null
          site_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          battery_status?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          diesel_level: number
          generator_runtime: number
          id?: string
          power_reading?: number | null
          report_datetime: string
          report_number?: string | null
          site_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          battery_status?: string | null
          comments?: string | null
          created_at?: string
          created_by?: string | null
          diesel_level?: number
          generator_runtime?: number
          id?: string
          power_reading?: number | null
          report_datetime?: string
          report_number?: string | null
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
          {
            foreignKeyName: "fk_ct_power_reports_site_id"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "telecom_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      data_retention_policies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_cleanup: string | null
          retention_days: number
          table_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_cleanup?: string | null
          retention_days: number
          table_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_cleanup?: string | null
          retention_days?: number
          table_name?: string
          updated_at?: string
        }
        Relationships: []
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
      driver_licenses: {
        Row: {
          created_at: string
          driver_id: string
          expiry_date: string
          id: string
          issue_date: string
          issuing_authority: string | null
          license_class: string
          license_number: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          expiry_date: string
          id?: string
          issue_date: string
          issuing_authority?: string | null
          license_class: string
          license_number: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          expiry_date?: string
          id?: string
          issue_date?: string
          issuing_authority?: string | null
          license_class?: string
          license_number?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_licenses_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      error_logs: {
        Row: {
          created_at: string
          error_message: string
          error_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resolved: boolean | null
          severity: string | null
          stack_trace: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          error_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved?: boolean | null
          severity?: string | null
          stack_trace?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          error_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved?: boolean | null
          severity?: string | null
          stack_trace?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
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
      fleet_vehicles: {
        Row: {
          assigned_driver_id: string | null
          color: string | null
          created_at: string
          current_mileage: number | null
          department_id: string | null
          fuel_type: string | null
          id: string
          insurance_expiry: string | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          license_plate: string
          make: string
          model: string
          notes: string | null
          purchase_date: string | null
          purchase_price: number | null
          registration_expiry: string | null
          status: string | null
          updated_at: string
          vehicle_number: string
          vin: string | null
          year: number
        }
        Insert: {
          assigned_driver_id?: string | null
          color?: string | null
          created_at?: string
          current_mileage?: number | null
          department_id?: string | null
          fuel_type?: string | null
          id?: string
          insurance_expiry?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          license_plate: string
          make: string
          model: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          status?: string | null
          updated_at?: string
          vehicle_number: string
          vin?: string | null
          year: number
        }
        Update: {
          assigned_driver_id?: string | null
          color?: string | null
          created_at?: string
          current_mileage?: number | null
          department_id?: string | null
          fuel_type?: string | null
          id?: string
          insurance_expiry?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          license_plate?: string
          make?: string
          model?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          status?: string | null
          updated_at?: string
          vehicle_number?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_vehicles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_transactions: {
        Row: {
          cost_per_unit: number
          created_at: string
          created_by: string | null
          driver_id: string | null
          fuel_amount: number
          fuel_station: string | null
          id: string
          mileage: number | null
          notes: string | null
          receipt_url: string | null
          total_cost: number
          transaction_date: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cost_per_unit: number
          created_at?: string
          created_by?: string | null
          driver_id?: string | null
          fuel_amount: number
          fuel_station?: string | null
          id?: string
          mileage?: number | null
          notes?: string | null
          receipt_url?: string | null
          total_cost: number
          transaction_date: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          created_by?: string | null
          driver_id?: string | null
          fuel_amount?: number
          fuel_station?: string | null
          id?: string
          mileage?: number | null
          notes?: string | null
          receipt_url?: string | null
          total_cost?: number
          transaction_date?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
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
      invoices: {
        Row: {
          amount: number
          client_address: string | null
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          client_address?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount?: number
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      meeting_participants: {
        Row: {
          attendance_status: string | null
          created_at: string
          id: string
          joined_at: string | null
          left_at: string | null
          meeting_id: string
          participant_id: string
          response: string | null
        }
        Insert: {
          attendance_status?: string | null
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          meeting_id: string
          participant_id: string
          response?: string | null
        }
        Update: {
          attendance_status?: string | null
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          meeting_id?: string
          participant_id?: string
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda: string | null
          created_at: string
          department_id: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          meeting_type: string | null
          meeting_url: string | null
          notes: string | null
          organizer_id: string
          project_id: string | null
          recording_url: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          meeting_type?: string | null
          meeting_url?: string | null
          notes?: string | null
          organizer_id: string
          project_id?: string | null
          recording_url?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          meeting_type?: string | null
          meeting_url?: string | null
          notes?: string | null
          organizer_id?: string
          project_id?: string | null
          recording_url?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
          meeting_notifications: boolean | null
          memo_notifications: boolean | null
          push_enabled: boolean | null
          report_notifications: boolean | null
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
          meeting_notifications?: boolean | null
          memo_notifications?: boolean | null
          push_enabled?: boolean | null
          report_notifications?: boolean | null
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
          meeting_notifications?: boolean | null
          memo_notifications?: boolean | null
          push_enabled?: boolean | null
          report_notifications?: boolean | null
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
      performance_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          department_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          full_name: string | null
          hire_date: string | null
          id: string
          location: string | null
          new_id: string | null
          phone: string | null
          phone_number: string | null
          phone_verified: boolean | null
          position: string | null
          role: string | null
          role_id: string | null
          salary: number | null
          settings: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          department_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          full_name?: string | null
          hire_date?: string | null
          id: string
          location?: string | null
          new_id?: string | null
          phone?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          position?: string | null
          role?: string | null
          role_id?: string | null
          salary?: number | null
          settings?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          department_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          full_name?: string | null
          hire_date?: string | null
          id?: string
          location?: string | null
          new_id?: string | null
          phone?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          position?: string | null
          role?: string | null
          role_id?: string | null
          salary?: number | null
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
      project_reports: {
        Row: {
          attachments: string[] | null
          budget_remaining: number | null
          budget_used: number | null
          created_at: string
          created_by: string
          id: string
          issues_encountered: string | null
          next_steps: string | null
          progress_percentage: number | null
          project_id: string
          report_content: string
          report_date: string | null
          report_title: string
          report_type: string
          review_comments: string | null
          review_status: string | null
          reviewed_by: string | null
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          budget_remaining?: number | null
          budget_used?: number | null
          created_at?: string
          created_by: string
          id?: string
          issues_encountered?: string | null
          next_steps?: string | null
          progress_percentage?: number | null
          project_id: string
          report_content: string
          report_date?: string | null
          report_title: string
          report_type: string
          review_comments?: string | null
          review_status?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          budget_remaining?: number | null
          budget_used?: number | null
          created_at?: string
          created_by?: string
          id?: string
          issues_encountered?: string | null
          next_steps?: string | null
          progress_percentage?: number | null
          project_id?: string
          report_content?: string
          report_date?: string | null
          report_title?: string
          report_type?: string
          review_comments?: string | null
          review_status?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
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
      security_settings: {
        Row: {
          created_at: string
          id: string
          lockout_duration_minutes: number | null
          login_attempt_limit: number | null
          max_concurrent_sessions: number | null
          password_min_length: number | null
          password_require_lowercase: boolean | null
          password_require_numbers: boolean | null
          password_require_symbols: boolean | null
          password_require_uppercase: boolean | null
          session_timeout_minutes: number | null
          two_factor_required: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lockout_duration_minutes?: number | null
          login_attempt_limit?: number | null
          max_concurrent_sessions?: number | null
          password_min_length?: number | null
          password_require_lowercase?: boolean | null
          password_require_numbers?: boolean | null
          password_require_symbols?: boolean | null
          password_require_uppercase?: boolean | null
          session_timeout_minutes?: number | null
          two_factor_required?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lockout_duration_minutes?: number | null
          login_attempt_limit?: number | null
          max_concurrent_sessions?: number | null
          password_min_length?: number | null
          password_require_lowercase?: boolean | null
          password_require_numbers?: boolean | null
          password_require_symbols?: boolean | null
          password_require_uppercase?: boolean | null
          session_timeout_minutes?: number | null
          two_factor_required?: boolean | null
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
            foreignKeyName: "fk_site_reports_site_id"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "telecom_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "telecom_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          coordinates: unknown | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          site_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          site_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          site_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_logs: {
        Row: {
          activity_description: string
          activity_type: string
          created_at: string
          duration_hours: number | null
          id: string
          location: string | null
          metadata: Json | null
          project_id: string | null
          staff_id: string
          task_id: string | null
        }
        Insert: {
          activity_description: string
          activity_type: string
          created_at?: string
          duration_hours?: number | null
          id?: string
          location?: string | null
          metadata?: Json | null
          project_id?: string | null
          staff_id: string
          task_id?: string | null
        }
        Update: {
          activity_description?: string
          activity_type?: string
          created_at?: string
          duration_hours?: number | null
          id?: string
          location?: string | null
          metadata?: Json | null
          project_id?: string | null
          staff_id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_memos: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          memo_type: string | null
          priority: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          memo_type?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          memo_type?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_memos_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_memos_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      system_health: {
        Row: {
          checked_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: string
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status?: string
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
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
      telecom_reports: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          customer_complaint_details: string | null
          diesel_level: number | null
          equipment_status: string | null
          generator_runtime: number | null
          id: string
          issues_reported: string | null
          maintenance_required: boolean | null
          network_status: string | null
          photos: string[] | null
          power_status: string | null
          priority_level: string | null
          recommendations: string | null
          report_category: string | null
          report_date: string | null
          reporter_id: string
          resolution_status: string | null
          security_details: string | null
          security_incident_type: string | null
          signal_strength: number | null
          site_id: string | null
          uncategorized_type: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          customer_complaint_details?: string | null
          diesel_level?: number | null
          equipment_status?: string | null
          generator_runtime?: number | null
          id?: string
          issues_reported?: string | null
          maintenance_required?: boolean | null
          network_status?: string | null
          photos?: string[] | null
          power_status?: string | null
          priority_level?: string | null
          recommendations?: string | null
          report_category?: string | null
          report_date?: string | null
          reporter_id: string
          resolution_status?: string | null
          security_details?: string | null
          security_incident_type?: string | null
          signal_strength?: number | null
          site_id?: string | null
          uncategorized_type?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          customer_complaint_details?: string | null
          diesel_level?: number | null
          equipment_status?: string | null
          generator_runtime?: number | null
          id?: string
          issues_reported?: string | null
          maintenance_required?: boolean | null
          network_status?: string | null
          photos?: string[] | null
          power_status?: string | null
          priority_level?: string | null
          recommendations?: string | null
          report_category?: string | null
          report_date?: string | null
          reporter_id?: string
          resolution_status?: string | null
          security_details?: string | null
          security_incident_type?: string | null
          signal_strength?: number | null
          site_id?: string | null
          uncategorized_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_telecom_reports_assigned_to"
            columns: ["assigned_to"]
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
      trip_logs: {
        Row: {
          created_at: string
          driver_id: string
          end_location: string
          end_mileage: number | null
          end_time: string | null
          id: string
          notes: string | null
          project_id: string | null
          purpose: string
          site_id: string | null
          start_location: string
          start_mileage: number
          start_time: string
          status: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          end_location: string
          end_mileage?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          purpose: string
          site_id?: string | null
          start_location: string
          start_mileage: number
          start_time: string
          status?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          end_location?: string
          end_mileage?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          purpose?: string
          site_id?: string | null
          start_location?: string
          start_mileage?: number
          start_time?: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_logs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_logs_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "telecom_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
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
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_maintenance: {
        Row: {
          cost: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          maintenance_type: string
          mileage_at_service: number | null
          next_service_date: string | null
          next_service_mileage: number | null
          receipt_url: string | null
          service_date: string
          service_provider: string | null
          status: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cost?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          maintenance_type: string
          mileage_at_service?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          receipt_url?: string | null
          service_date: string
          service_provider?: string | null
          status?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          maintenance_type?: string
          mileage_at_service?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          receipt_url?: string | null
          service_date?: string
          service_provider?: string | null
          status?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_maintenance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          accomplishments: string | null
          challenges: string | null
          created_at: string
          hours_worked: number | null
          id: string
          next_week_goals: string | null
          projects_worked_on: string[] | null
          review_comments: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          accomplishments?: string | null
          challenges?: string | null
          created_at?: string
          hours_worked?: number | null
          id?: string
          next_week_goals?: string | null
          projects_worked_on?: string[] | null
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          accomplishments?: string | null
          challenges?: string | null
          created_at?: string
          hours_worked?: number | null
          id?: string
          next_week_goals?: string | null
          projects_worked_on?: string[] | null
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_user_action: {
        Args: {
          p_action: string
          p_table_name?: string
          p_record_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: string
      }
      record_health_check: {
        Args: {
          p_service_name: string
          p_status: string
          p_response_time_ms?: number
          p_error_message?: string
          p_metadata?: Json
        }
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
