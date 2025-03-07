import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accountType?: "student" | "teacher" | null;
}

// This is the initial state of the auth slice
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  accountType: null,
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
      state.accountType = null;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
    setAccountType: (state, action) => {
      state.accountType = action.payload;
    },
  },
});

// Export the actions and the reducer
export const { setAuth, logout, finishInitialLoad, setAccountType } =
  authSlice.actions;
export default authSlice.reducer;
