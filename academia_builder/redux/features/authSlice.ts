import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// This is the initial state of the auth slice
const initialState = {
  isAuthenticated: false,
  isLoading: true,
} as AuthState;

// This is the slice that will handle the authentication state
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

// Export the actions and the reducer
export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
