import { IAssetLine, IReqFindFundByRatio, IRequestHistoryLiquidationValue, IResponse } from '../type'
import { apiRequest, apiRequestAuth, apiRequestAuthUpload } from '../apiClient'

export const weekReport = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/opc/current-week', 'GET', token)
}

export const getFollowRules = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/analysis/follows/rules', 'GET')
}

export const getOpcvmTypes = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/opc/opcvm-types', 'GET')
}

export const getAssetLinesTypes = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/opc/assets-types', 'GET')
}

export const getInvestmentRuleTypes = async (): Promise<IResponse> => {
  return await apiRequest<IResponse>('/opc/investment-rule-types', 'GET')
}

export const loadWeekReport = async (token: string, file: FormData, weekId: number | null): Promise<IResponse> => {
  return await apiRequestAuthUpload<IResponse>('/opc/load/week/' + weekId, 'POST', token, file)
}

export const getFollowFundGrouped = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/analysis/opc/follows/rules', 'GET', token)
}

export const getFundByFollowInstructions = async (token: string, data: IReqFindFundByRatio): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/analysis/funds/follows/rules', 'POST', token, data)
}

export const getlastReportOfFund = async (token: string, fundId: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/opc/last-report/' + fundId, 'GET', token)
}

export const getReportOfFundAndWeek = async (token: string, fundId: number, weekId: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/opc/detail/' + fundId + '/week/' + weekId, 'GET', token)
}

export const generateReportAnalyze = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/analysis/opc/' + id, 'GET', token)
}

export const getReportResult = async (token: string, id: number): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/analysis/opc/' + id + '/result', 'GET', token)
}

export const getHistoryLiquidationValue = async (token: string, data: IRequestHistoryLiquidationValue): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/opc/history/liquidatives', 'POST', token, data)
}

export const getDashActifs = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/analysis/dash/actifs', 'GET', token)
}

export const getDashLiquidatives = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/analysis/dash/liquidatives', 'GET', token)
}

export const getActifNet = (lines: IAssetLine[]): number | null => {
  let val: number | null = null
  lines?.forEach((line) => {
    if (line?.label?.includes("VALEUR DE L'ACTIF NET")) {
      val = line.value as number
    }
  })
  return val
}

export const getValeurLiquid = (lines: IAssetLine[]): number | null => {
  let val: number | null = null
  lines?.forEach((line) => {
    if (line?.label?.includes("VALEUR LIQUIDATIVE")) {
      val = line.value as number
    }
  })
  return val !== null ? Number(val.toFixed(2)) : val
}

export const getActifSousGestion = (lines: IAssetLine[]): number | null => {
  let val: number | null = null
  lines?.forEach((line) => {
    if (line?.label?.includes("TOTAL DES ACTIFS SOUS GESTION")) {
      val = line.value as number
    }
  })
  return val !== null ? Number(val.toFixed(2)) : val
}
