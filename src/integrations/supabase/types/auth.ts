import { Json } from './base';

export interface AuthTypes {
  users: {
    Row: {
      id: string;
      email: string;
      role: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      email: string;
      role?: string;
      created_at?: string;
    };
    Update: {
      email?: string;
      role?: string;
    };
  };
}