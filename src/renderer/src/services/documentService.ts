import { IDocument, IFolder, IResponse } from '../type'
import { apiClient, apiRequestAuth, apiRequestAuthUpload } from '../apiClient'
import { AxiosResponse } from 'axios'

export const getDocuments = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/documents', 'GET', token)
}

export const loadDocuments = async (token: string, file: FormData, parent: number): Promise<IResponse> => {
  return await apiRequestAuthUpload<IResponse>('/documents/load', 'POST', token, file)
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


export const getFolders = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/folders', 'GET', token)
}

export const createFolders = async (token: string, parent: number, data: IFolder): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/folders/' + parent, 'POST', token, data)
}

export const updateFolders = async (token: string, id: number, parent: number, data: IFolder): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/folders/'+id+'/' + parent, 'POST', token, data)
}

export const deleteFolders = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/folders/' + id, 'DELETE', token)
}