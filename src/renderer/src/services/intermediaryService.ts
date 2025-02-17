import { apiRequestAuth, apiRequestAuthUpload } from '../apiClient'
import { IHolder, IIntermediary, IOrganization, IResponse, ISearchIntermediary } from '../type'


export const getIntermediaries = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries', 'GET', token)
}

export const getSgos = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/sgo', 'GET', token)
}

export const searchIntermediaries = async (token: string, data: ISearchIntermediary): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/search/query', 'POST', token, data)
}

export const getCategories = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/categories', 'GET', token)
}

export const getOrganizations = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/organizations', 'GET', token)
}

export const getIntermediary = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/' + id, 'GET', token)
}

export const createIntermediary = async (token: string, inter: IIntermediary): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries', 'POST', token, inter)
}

export const updateIntermediary = async (token: string, id: number, inter: IIntermediary): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/' + id, 'POST', token, inter)
}

export const createOrganization = async (token: string, org: IOrganization): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/organizations', 'POST', token, org)
}

export const updateOrganization = async (token: string, id: number, org: IOrganization): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/organizations/' + id, 'POST', token, org)
}

export const deleteIntermediary = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/intermediaries/' + id, 'DELETE', token)
}

export const createHolder = async (token: string, hold: IHolder): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/holders', 'POST', token, hold)
}

export const updateHolder = async (token: string, id: number, hold: IHolder): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/holders/' + id, 'POST', token, hold)
}

export const deleteHolder = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/holders/' + id, 'DELETE', token)
}

export const importIntermediaries = async (token: string, file: FormData): Promise<IResponse> => {
  return await apiRequestAuthUpload<IResponse>('/intermediaries/import', 'POST', token, file)
}
