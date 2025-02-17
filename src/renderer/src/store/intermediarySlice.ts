import { ICategory, IIntermediary, IOrganization } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type StateType = {
  intermediaries: IIntermediary[],
  intermediary: IIntermediary | null,
  categories: ICategory[]
  organizations: IOrganization[],
}

const initialState: StateType = {
  intermediaries: [],
  intermediary: null,
  categories: [],
  organizations: []
}

export const intermediarySlice = createSlice({
  name: 'intermediary',
  initialState: initialState,
  reducers: {
    addIntermediary: (state, action: PayloadAction<IIntermediary>) => {
      state.intermediaries?.push(action.payload)
    },
    addIntermediaries: (state, action: PayloadAction<IIntermediary[]>) => {
      const arr: IIntermediary[] = [...state.intermediaries, ...action.payload]
      state.intermediaries = arr
    },
    refreshIntermediary: (state, action: PayloadAction<IIntermediary>) => {
      state.intermediaries = state.intermediaries?.map((inter) => {
        inter.id === action.payload.id ? action.payload : inter
      })
    },
    removeIntermediary: (state, action: PayloadAction<IIntermediary>) => {
      const arr: IIntermediary[] = state.intermediaries?.filter((inter) => inter.id !== action.payload.id)
      state.intermediaries = arr
    },
    setIntermediary: (state, action: PayloadAction<IIntermediary>) => {
      state.intermediary = action.payload
    },
    setIntermediaries: (state, action: PayloadAction<IIntermediary[]>) => {
      state.intermediaries = action.payload
    },
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload
    },
    setOrganizations: (state, action: PayloadAction<IOrganization[]>) => {
      state.organizations = action.payload
    },
  }
})

export const { addIntermediary, refreshIntermediary, removeIntermediary, setIntermediary, setIntermediaries, setCategories, setOrganizations, addIntermediaries } = intermediarySlice.actions
export default intermediarySlice.reducer
