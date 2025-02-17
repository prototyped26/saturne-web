import { IClassification, IDepository, IDistribution, IFund, IIntermediary, ITypeOpc } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type StateType = {
  funds: IFund[],
  fund: IFund | null,
  typesOpc: ITypeOpc[],
  classifications: IClassification[],
  depositaries: IDepository[],
  distributions: IDistribution[]
}

const initialState: StateType = {
  funds: [],
  fund: null,
  typesOpc: [],
  classifications: [],
  depositaries: [],
  distributions: []
}

export const fundSlice = createSlice({
  name: 'slice',
  initialState: initialState,
  reducers: {
    addFunds: (state, action: PayloadAction<IFund[]>) => {
      const arr = [...state.funds, ...action.payload]
      state.funds = arr
    },
    addFund: (state, action: PayloadAction<IFund>) => {
      state.fund = action.payload
    },
    refreshFund: (state, action: PayloadAction<IFund>) => {
      state.funds = state.funds?.map((fund) => {
        fund.id === action.payload.id ? action.payload : fund
      })
    },
    setFunds: (state, action: PayloadAction<IFund[]>) => {
      state.funds = action.payload
    },
    setFund: (state, action: PayloadAction<IFund>) => {
      state.fund = action.payload
    },
    removeFund: (state, action: PayloadAction<IFund>) => {
      const arr = state.funds.filter((fund) => fund.id !== action.payload.id)
      state.funds = arr
    },
    setTypesOpc: (state, action: PayloadAction<ITypeOpc[]>) => {
      state.typesOpc = action.payload
    },
    setDepositaries: (state, action: PayloadAction<IDepository[]>) => {
      state.depositaries = action.payload
    },
    setDistributions: (state, action: PayloadAction<IDistribution[]>) => {
      state.distributions = action.payload
    },
    setClassifications: (state, action: PayloadAction<IClassification[]>) => {
      state.classifications = action.payload
    },
  }
})

export const { addFunds, addFund, removeFund, refreshFund, setFund, setFunds, setClassifications, setTypesOpc, setDistributions, setDepositaries } = fundSlice.actions
export default fundSlice.reducer
