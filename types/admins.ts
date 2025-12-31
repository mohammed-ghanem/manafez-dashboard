

export interface IAdmin {
  message: string;
  id: number;
  name: string;
  email: string;
  mobile: string;
  image: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  roles?: string;       
  roles_ids?: number[]; 
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
