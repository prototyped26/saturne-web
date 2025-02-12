import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INotification } from '../type'

type stateType = {
  success: string | null,
  message: string | null,
  error: string | null,
  notifications: INotification[]
}

const initialState: stateType = {
  success: null,
  error: null,
  message: null,
  notifications: []
}

export const informationSlice = createSlice({
  name: 'information',
  initialState: initialState,
  reducers: {
    setSuccess: (state, action: PayloadAction<string|null>) => {
      state.success = action.payload
    },
    setError: (state, action: PayloadAction<string|null>) => {
      state.error = action.payload
    },
    setInformationMessage: (state, action: PayloadAction<string|null>) => {
      state.message = action.payload
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<INotification>) => {
      const newArr: INotification[] = state.notifications.filter((notif) => notif.id !== action.payload.id)
      state.notifications = newArr
    }
  }
})

export const { setSuccess, setError, addNotification, removeNotification, setInformationMessage } = informationSlice.actions

export default informationSlice.reducer
