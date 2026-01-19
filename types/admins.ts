

export interface IAdmin {
  id: number;
  name: string;
  email: string;
  image?: string | null;
  mobile: string;
  roles: string;          // للعرض
  roles_ids: number[];    // للتعديل
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  message?: string;
}


export interface ICreateAdminPayload {
  name: string;
  email: string;
  mobile: string;
  role_id: number[];
  is_active: boolean;
  password: string;
  password_confirmation: string;
}

export interface IUpdateAdminPayload {
  name: string;
  email: string;
  mobile: string;
  role_id: number[];
  is_active: boolean;
}


export interface IApiMessageResponse {
  message: string;
}