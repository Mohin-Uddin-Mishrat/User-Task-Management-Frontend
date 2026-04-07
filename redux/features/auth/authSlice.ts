import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/redux/api/authApi";

type AuthState = {
  isAuthenticated: boolean;
  userEmail: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.userEmail = action.meta.arg.originalArgs.email;
    });
  },
});

export const { logoutLocal } = authSlice.actions;
export const authReducer = authSlice.reducer;
