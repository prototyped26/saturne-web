import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { informationSlice } from './informationSlice'
import { intermediarySlice } from './intermediarySlice'
import { fundSlice } from './fundSlice'
import { systemSlice } from './systemSlice'
import { opcSlice } from './opcSlice'
import { mandateSlice } from './mandateSlice'

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    information: informationSlice.reducer,
    intermediary: intermediarySlice.reducer,
    fund: fundSlice.reducer,
    system: systemSlice.reducer,
    opc: opcSlice.reducer,
    mandate: mandateSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
