import { IAssetLineType, IFollowFund, IFollowRule, IInvestmentRuleType, IOpc, IOpcvmType } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type StateType = {
  opcs: IOpc[],
  opc: IOpc | null,
  followsRules: IFollowRule[],
  follows: IFollowFund[],
  opcvmTypes: IOpcvmType[],
  assetsTypes: IAssetLineType[],
  investmentsTypes: IInvestmentRuleType[]
}

const initialState: StateType = {
  opcs: [],
  opc: null,
  followsRules: [],
  follows: [],
  opcvmTypes: [],
  assetsTypes: [],
  investmentsTypes: []
}

export const opcSlice = createSlice({
  name: 'opc',
  initialState: initialState,
  reducers: {
    addOpcs: (state, action: PayloadAction<IOpc[]>) => {
      const arr = [...state.opcs, ...action.payload]
      state.opcs = arr
    },
    addOpc: (state, action: PayloadAction<IOpc>) => {
      state.opcs?.push(action.payload)
    },
    setOpc: (state, action: PayloadAction<IOpc>) => {
      state.opc = action.payload
    },
    setOpcs: (state, action: PayloadAction<IOpc[]>) => {
      state.opcs = action.payload
    },
    setFollowsRules: (state, action: PayloadAction<IFollowRule[]>) => {
      state.followsRules = action.payload
    },
    setFollows: (state, action: PayloadAction<IFollowFund[]>) => {
      state.follows = action.payload
    },
    setOpcvmTypes: (state, action: PayloadAction<IOpcvmType[]>) => {
      state.opcvmTypes = action.payload
    },
    setAssetLineTypes: (state, action: PayloadAction<IAssetLineType[]>) => {
      state.assetsTypes = action.payload
    },
    setInvestmentRuleTypes: (state, action: PayloadAction<IInvestmentRuleType[]>) => {
      state.investmentsTypes = action.payload
    }
  }
})

export const { addOpcs, addOpc, setOpc, setOpcs, setFollowsRules, setFollows, setOpcvmTypes, setAssetLineTypes, setInvestmentRuleTypes } = opcSlice.actions
export default opcSlice.reducer

