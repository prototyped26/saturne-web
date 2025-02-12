import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { informationSlice } from './informationSlice'

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    information: informationSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
