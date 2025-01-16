import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

import IAuth from '../../models/auth.model'

interface IAuthState {
  isAuthenticated: boolean
}

const initialState: IAuthState = {
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state) => {
      state.isAuthenticated = true
    },
    setLogout: (state) => {
      // logout
      state.isAuthenticated = false
    }
  }
})

export const { setLogin, setLogout } = authSlice.actions

export default authSlice
