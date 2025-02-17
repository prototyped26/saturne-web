import { IWeek, IYear } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type StateType = {
  years: IYear[],
  year: IYear | null,
  weeks: IWeek[],
  week: IWeek | null,
  currentWeek: IWeek | null,
  currentYear: IYear | null
}

const initialeState: StateType = {
  years: [],
  year: null,
  weeks: [],
  week: null,
  currentWeek: null,
  currentYear: null
}

export const systemSlice = createSlice({
  name: 'system',
  initialState: initialeState,
  reducers: {
    setYears: (state, action: PayloadAction<IYear[]>) => {
      state.years = action.payload
    },
    addYears: (state, action: PayloadAction<IYear[]>) => {
      const arr: IYear[] = [...state.years, ...action.payload]
      state.years = arr
    },
    addYear: (state, action: PayloadAction<IYear>) => {
      state.years?.push(action.payload)
    },
    setYear: (state, action: PayloadAction<IYear>) => {
      state.year = action.payload
    },
    setCurrentYear: (state, action: PayloadAction<IYear>) => {
      state.currentYear = action.payload
    },
    refreshYear: (state, action: PayloadAction<IYear>) => {
      state.years = state.years?.map((y) => {
        y.id === action.payload.id ? action.payload : y
      })
    },
    removeYear: (state, action: PayloadAction<IYear>) => {
      const arr: IYear[] = state.years.filter((y) => y.id !== action.payload.id)
      state.years = arr
    },
    setCurrentWeek: (state, action: PayloadAction<IWeek>) => {
      state.currentWeek = action.payload
    },
    setWeek: (state, action: PayloadAction<IWeek>) => {
      state.week = action.payload
    },
    setWeeks: (state, action: PayloadAction<IWeek[]>) => {
      state.weeks = action.payload
    },
  }
})

export const { setCurrentYear, addYear, refreshYear, removeYear, addYears, setCurrentWeek, setWeek, setYear,setWeeks, setYears } = systemSlice.actions
export default systemSlice.reducer
