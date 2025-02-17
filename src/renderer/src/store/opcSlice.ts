import { IOpc } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type StateType = {
  opcs: IOpc[],
  opc: IOpc | null
}

const initialState: StateType = {
  opcs: [],
  opc: null
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
  }
})

export const { addOpcs, addOpc, setOpc, setOpcs } = opcSlice.actions
export default opcSlice.reducer

