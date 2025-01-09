import { Json } from './base';

export interface AIKnowledgeBaseRow {
  category: string | null;
  content: string;
  created_at: string;
  created_by: string | null;
  id: string;
  tags: string[] | null;
  title: string;
  updated_at: string;
}

export interface AIResultsRow {
  created_at: string;
  created_by: string | null;
  id: string;
  model_used: string;
  query_text: string;
  result_data: Json;
  updated_at: string;
}