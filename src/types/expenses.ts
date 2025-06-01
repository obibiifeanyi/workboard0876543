
export interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  payment_method?: string;
  reference_number?: string;
  department?: string;
  project_id?: string;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  created_by: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DynamicExpenseTable {
  id: string;
  table_name: string;
  display_name: string;
  columns: ExpenseColumn[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseColumn {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required: boolean;
  display_name: string;
}

export interface ExpenseImport {
  id: string;
  file_name: string;
  file_url: string;
  table_name: string;
  status: 'processing' | 'completed' | 'failed';
  records_imported: number;
  errors?: string[];
  created_by: string;
  created_at: string;
}
