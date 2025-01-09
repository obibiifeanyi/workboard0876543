export interface CoreTables {
  ai_results: {
    Row: {
      id: string;
      query_text: string;
      result_data: any;
      model_used: string;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      query_text: string;
      result_data: any;
      model_used: string;
      created_by?: string | null;
    };
    Update: {
      query_text?: string;
      result_data?: any;
      model_used?: string;
      created_by?: string | null;
    };
  };
  ai_knowledge_base: {
    Row: {
      id: string;
      title: string;
      content: string;
      category: string | null;
      tags: string[] | null;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      title: string;
      content: string;
      category?: string | null;
      tags?: string[] | null;
      created_by?: string | null;
    };
    Update: {
      title?: string;
      content?: string;
      category?: string | null;
      tags?: string[] | null;
      created_by?: string | null;
    };
  };
  invoices: {
    Row: {
      id: string;
      invoice_number: string;
      client_name: string;
      amount: number;
      status: string;
      due_date: string | null;
      items: any;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      invoice_number?: string;
      client_name: string;
      amount: number;
      status?: string;
      due_date?: string | null;
      items: any;
      created_by?: string | null;
    };
    Update: {
      invoice_number?: string;
      client_name?: string;
      amount?: number;
      status?: string;
      due_date?: string | null;
      items?: any;
      created_by?: string | null;
    };
  };
  notifications: {
    Row: {
      id: string;
      user_id: string;
      title: string;
      message: string;
      type: string;
      read: boolean;
      link: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      title: string;
      message: string;
      type: string;
      read?: boolean;
      link?: string | null;
    };
    Update: {
      user_id?: string;
      title?: string;
      message?: string;
      type?: string;
      read?: boolean;
      link?: string | null;
    };
  };
}