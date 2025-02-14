export interface IRole {
  id: number,
  label: string,
  code: string
}

export interface IUser {
  id?: number,
  email: string,
  password?: string,
  first_name: string,
  last_name: string,
  created_at?: string,
  login?: string,
  role?: IRole,
  role_id: number | null
}

export interface ILogin {
  email: string | null,
  password: string | null
}

export interface IResponse {
  message: string,
  status: number,
  errors: string[],
  data: any | null
}

export interface INotification {
  id: string,
  message: string,
  data: any
}

export interface IChangePassword {
  new_password: string | null,
  confirm_password: string | null,
  old_password?: string | null,
}

export interface ICategory {
  id?: number,
  code: string,
  label?: string
}

export interface IOrganization {
  id?: number,
  label?: string,
  header?: string,
  capital?: string,
  status?: string
}

export interface IHolder {
  id?: number,
  first_name?: string,
  last_name?: string,
  shares?: number,
  value?: number,
  percent?: number,
  capital?: number,
  current?: boolean,
  created_at?: string
  organization_id?: number,
  ligne?: number,
  oragization?: IOrganization
}

export interface IIntermediary {
  id?: number,
  label: string,
  head: string,
  approval_number: string,
  approval_date: string,
  leader_name?: string,
  leader_status?: string,
  approval_number_two?: string,
  approval_date_two?: string,
  adress?: string,
  contacts?: string
  category_id?: number,
  category?: ICategory
  organization_id?: number,
  organization?: IOrganization
}

export interface IVisaApplication {
  id?: number,
  label?: string,
  reason?: string,
  status?: string,
  other?: string,
  intermediary_id?: number,
  decision?: string,
  created_at?: string
}
