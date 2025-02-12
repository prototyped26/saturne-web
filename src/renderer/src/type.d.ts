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
