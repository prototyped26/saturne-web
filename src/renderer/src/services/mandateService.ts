import { IResponse } from '../type'
import { apiRequestAuth, apiRequestAuthUpload } from '../apiClient'

export const loadWeekMandateReport = async (token: string, file: FormData, periodicityId: number | null): Promise<IResponse> => {
  return await apiRequestAuthUpload<IResponse>('/mandates/load/' + periodicityId, 'POST', token, file)
}

export const weekMandates = async (token: string, page: number = 0): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/mandates/current-week' + (page === 0 ? '?page=' + page : '?page=' + (page - 1)), 'GET', token)
}

export const deleteMandate = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/mandates/' + id, 'DELETE', token)
}
