import axios, { AxiosResponse } from 'axios'
axios.defaults.baseURL =  'http://localhost:9000/api'
const ax = axios
export const apiClient = ax.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

export const apiRequest = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) : Promise<T> => {
  const response: AxiosResponse<T> = await apiClient({
    method,
    url,
    data
  })

  return response.data
}

export const apiRequestAuth = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', token?: string | null, data?: any) : Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  const response: AxiosResponse<T> = await apiClient({
    method,
    url,
    data,
    headers
  })

  return response.data
}

export const apiRequestAuthUpload = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', token?: string | null, data?: any) : Promise<T> => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Bearer ' + token
  }
  const response: AxiosResponse<T> = await apiClient({
    method,
    url,
    data,
    headers
  })

  return response.data
}
