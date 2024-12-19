import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { initialState } from '../types/AuthState';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ isLoggedIn: boolean; user: User | null }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;