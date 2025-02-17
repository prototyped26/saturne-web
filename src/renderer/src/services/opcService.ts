import { IAssetLine, IResponse } from '../type'
import { apiRequestAuth, apiRequestAuthUpload } from '../apiClient'

export const weekReport = async (token: string): Promise<IResponse> => {
  return await apiRequestAuth<IResponse>('/opc/current-week', 'GET', token)
}

export const loadWeekReport = async (token: string, file: FormData, weekId: number | null): Promise<IResponse> => {
  return await apiRequestAuthUpload<IResponse>('/opc/load/week/' + weekId, 'POST', token, file)
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
  return val
}

export const getActifSousGestion = (lines: IAssetLine[]): number | null => {
  let val: number | null = null
  lines?.forEach((line) => {
    if (line?.label?.includes("TOTAL DES ACTIFS SOUS GESTION")) {
      val = line.value as number
    }
  })
  return val
}
