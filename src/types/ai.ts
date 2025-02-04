
export interface AIResult {
  id: string;
  query_text: string;
  result_data: any;
  model_used: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIKnowledgeBase {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentAnalysis {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  analysis_status: 'pending' | 'completed' | 'error';
  analysis_result?: {
    summary: string;
    keyPoints: string[];
    suggestedActions: string[];
    categories?: string[];
    risks?: string[];
  };
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
