import { IResponse, IYear } from '../type'
import { apiRequest, apiRequestAuth } from '../apiClient'

export const getManagedYears = async (token: string | null): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years', 'GET', token)
}

export const getManagedYear = async (token: string | null, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years/' + id, 'GET', token)
}

export const getCurrentInformation = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/system/informations', 'GET')
}

export const getPeriodicities = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/system/periodicities', 'GET')
}

export const getTypesComponentsReport = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/system/types-components', 'GET')
}

export const createYear = async (token: string | null, data: IYear): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years', 'POST', token, data)
}

export const updateYear = async (token: string | null, id: number, data: IYear): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years/' + id, 'POST', token, data)
}

export const deleteYear = async (token: string | null, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years/' + id, 'DELETE', token)
}

export const activeYear = async (token: string | null, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years/' + id + '/active', 'POST', token)
}

export const desactiveYear = async (token: string | null, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years/' + id + '/desactive', 'POST', token)
}

export const generateWeek = async (token: string | null, code: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/system/years/' + code + '/weeks-generate', 'POST', token)
}




