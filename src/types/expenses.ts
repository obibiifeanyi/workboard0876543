
export interface ExpenseRecord {
  id: string;
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
  category: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  receipt_url?: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
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
