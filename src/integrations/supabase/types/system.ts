import { Json } from './base';

export interface SystemActivityRow {
  id: string;
  type: string;
  description: string;
  user_id: string | null;
  metadata: Json | null;
  created_at: string;
}

export interface SystemActivityInsert {
  type: string;
  description: string;
  user_id?: string | null;
  metadata?: Json | null;
  created_at?: string;
}