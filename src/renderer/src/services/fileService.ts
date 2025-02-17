import { AxiosResponse } from 'axios'
import { apiClient } from '../apiClient'


export const downloadTemplateIntermediary = async (): Promise<AxiosResponse> => {
  const response: AxiosResponse = await apiClient({
    method: 'GET',
    url: '/files/download/templates/intermediary',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob'
  })

  return response
}

export const downloadTemplateFund = async (): Promise<AxiosResponse> => {
  const response: AxiosResponse = await apiClient({
    method: 'GET',
    url: '/files/download/templates/fund',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob'
  })

  return response
}




