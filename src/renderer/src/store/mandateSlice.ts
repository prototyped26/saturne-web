import { ICustomer, IMandate } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type StateType = {
  mandates: IMandate[],
  mandate: IMandate | null,
  customers: ICustomer[],
  customer: ICustomer | null
}

const initialState: StateType = {
  mandates: [],
  mandate: null,
  customers: [],
  customer: null,
}

export const mandateSlice = createSlice({
  name: 'mandate',
  initialState: initialState,
  reducers: {
    setMandates: (state, action: PayloadAction<IMandate[]>) => {
      state.mandates = action.payload
    },
    setMandate: (state, action: PayloadAction<IMandate>) => {
      state.mandate = action.payload
    },
    addMandate: (state, action: PayloadAction<IMandate>) => {
      const res = state.mandates
      res.push(action.payload)
      state.mandates = res
    },
    removeMandate: (state, action: PayloadAction<IMandate>) => {
      const arr = state.mandates.filter((mandate) => mandate.id !== action.payload.id)
      state.mandates = arr
    }
  }
})

export const { removeMandate, setMandate, setMandates, addMandate } = mandateSlice.actions
export default mandateSlice.reducer
