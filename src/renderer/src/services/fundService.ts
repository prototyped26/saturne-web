import { IFund, IResponse } from '../type'
import { apiRequestAuth, apiRequestAuthUpload } from '../apiClient'

export const getFunds = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds', 'GET', token)
}

export const getClassifications = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/classifications', 'GET', token)
}

export const getTypesOpc = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/types-opc', 'GET', token)
}

export const getDepositaries = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/depositaries', 'GET', token)
}

export const importFunds = async (token: string, file: FormData): Promise<IResponse> => {
  return await apiRequestAuthUpload<IResponse>('/funds/import', 'POST', token, file)
}

export const getDistributions = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/distributions', 'GET', token)
}

export const getFund = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/' + id, 'GET', token)
}

export const createFund = async (token: string, data: IFund): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds', 'POST', token, data)
}

export const updateFund = async (token: string, id: number, data: IFund): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/' + id, 'POST', token, data)
}

export const deleteFund = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/' + id, 'DELETE', token)
}



