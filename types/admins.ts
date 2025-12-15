export interface IAdmin {
  id: number;
  name: string;
  email?: string;
  image?: string | null;
  mobile?: string;
  roles?: string | string[]; 
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}


export interface ICreateAdminPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile: string;
  role_id: number[];   // ✅ correct
  is_active: boolean;
}
