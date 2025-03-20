import { IAssetLine, IFund, IOpc, IOperation, IResponse, IShareholder } from '../type'
import { apiRequestAuth, apiRequestAuthUpload } from '../apiClient'
import { getActifNet, getValeurLiquid } from './opcService'

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

export const getFundsBySgo = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/funds/sgo/' + id, 'GET', token)
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
// Poeteurs de parts, souscriptions et rachats
export const getAllShareholders = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders', 'GET', token)
}

export const getShareholdersTypes = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/types', 'GET', token)
}

export const getShareholdersOfFund = async (token: string, fundId: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/fund/' + fundId, 'GET', token)
}

export const getHistoryShareholdersOfFund = async (token: string, fundId: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/fund/' + fundId + '/history', 'GET', token)
}

export const createNewShareholder = async (token: string, data: IShareholder): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders', 'POST', token, data)
}

export const updateShareholder = async (token: string, id: number, data: IShareholder): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/' + id, 'POST', token, data)
}

export const deleteShareholder = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/' + id, 'DELETE', token)
}

export const subscribeHolder = async (token: string, holderId: number, fundId: number, data: IOperation): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/' + holderId + '/fund/' + fundId + '/subscribe', 'POST', token, data)
}

export const purshaceHolder = async (token: string, holderId: number, fundId: number, data: IOperation): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/shareholders/' + holderId + '/fund/' + fundId + '/purchase', 'POST', token, data)
}

// méthode avec calcul des éléménts de gestion des fonds

export const determineTotalPartFund = (opc: IOpc): number => {
  let res = 0
  const actifNet = getActifNet(opc.assetLines as IAssetLine[])
  const vl = getValeurLiquid(opc.assetLines as IAssetLine[])

  if (actifNet !== null && vl !== null) {
    res = Math.round(actifNet / vl)
  }

  return res
}
// LES porteurs de parts
export const determineNumberOfPartShareholder = (shareholder: IShareholder): number => {
  let res = 0
  let souscription = 0
  let purchase = 0

  shareholder?.operations?.forEach((operation) => {
    if (operation?.type?.code === 'SOUSCRIPTION') souscription += operation.shares
    else purchase += operation.shares
  })
  res = souscription - purchase
  return res
}

export const determinePercentOfShareholder = (parts: number, partShareholder: number): number => {
  let res = 0

  res = Number(((partShareholder / parts) * 100).toFixed(2))

  return res
}



