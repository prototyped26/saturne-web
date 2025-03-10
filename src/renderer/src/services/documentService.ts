import { IDocument, IResponse } from '../type'
import { apiClient, apiRequestAuth } from '../apiClient'
import { AxiosResponse } from 'axios'

export const getDocuments = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/documents', 'GET', token)
}

export const downloadDocument = async (document: IDocument): Promise<AxiosResponse> => {
  const response: AxiosResponse = await apiClient({
    method: 'GET',
    url: '/files/' + document.path,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob'
  })

  return response
}
