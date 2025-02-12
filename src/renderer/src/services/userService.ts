import { apiRequest, apiRequestAuth } from '../apiClient'
import { IChangePassword, ILogin, IResponse, IUser } from '../type'

export const login = async (data: ILogin): Promise<string> => {
  return await apiRequest<string>('/login', 'POST', data)
}

export const current = async (token: string | null): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/user', 'GET', token)
}

export const getUsers = async (token: string | null): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/users', 'GET', token)
}

export const getRoles = async (token: string | null): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/roles', 'GET', token)
}

export const createUser = async (token: string | null, user: IUser): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/register', 'POST', token, user)
}

export const getUser = async (token: string | null, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/users/' + id, 'GET', token)
}

export const deleteUser = async (token: string | null, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/users/' + id, 'DELETE', token)
}

export const updateUser = async (token: string | null, id: number , user: IUser): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/users/' + id, 'POST', token, user)
}

export const changePasswordUser = async (token: string | null, id: number , password: IChangePassword): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/users/' + id + '/password', 'POST', token, password)
}
