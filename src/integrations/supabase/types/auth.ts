import { Database } from './base';

export interface Profile extends Database['public']['Tables']['profiles']['Row'] {
  full_name: string | null;
  avatar_url: string | null;
}

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];