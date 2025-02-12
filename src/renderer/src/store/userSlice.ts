import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IRole, IUser } from './../type'
//import { RootState } from './store'

type stateType = {
  users: IUser[],
  user: IUser | null,
  current: IUser | null | any,
  token: string | null,
  roles: IRole[]
}

const initialState: stateType = {
  users: [],
  user: null,
  current: null,
  token: null,
  roles: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    addNew: (state, action: PayloadAction<IUser>) => {
      state.users?.push(action.payload)
    },
    updateElt: (state, action: PayloadAction<IUser>) => {
      const { payload: { id, email, first_name, last_name, password, role_id } } = action

      state.users = state.users?.map((user) => {
        user.id === id ? { ...user, email, first_name, last_name, password, role_id  } : user
      })
    },
    removeElt: (state, action: PayloadAction<IUser>) => {
      const newArr: IUser[] = state.users.filter((user) => user.id !== action.payload.id)
      state.users = newArr
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setCurrent: (state, action: PayloadAction<IUser>) => {
      state.current = action.payload
    },
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      state.roles = action.payload
    },
    selectedUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload
    }
  }
})

export const { addNew, updateElt, removeElt, setToken, setCurrent, setRoles, setUsers, selectedUser } = userSlice.actions
//export const selectUsers = (state: RootState) => state.user.users
export default userSlice.reducer
