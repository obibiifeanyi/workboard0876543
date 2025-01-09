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