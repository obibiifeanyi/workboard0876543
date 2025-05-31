
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  role: string;
  department_id: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  position: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
}

export type ProfileUpdate = {
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string;
  role?: string;
  department_id?: string | null;
  status?: string | null;
  position?: string | null;
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
};
