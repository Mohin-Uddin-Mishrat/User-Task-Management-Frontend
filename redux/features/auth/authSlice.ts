import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser, DecodedAuthToken } from "@/lib/auth-token";
import { authApi } from "@/redux/api/authApi";

type AuthState = {
  isAuthenticated: boolean;
  isHydrated: boolean;
  userEmail: string | null;
  userName: string | null;
  role: DecodedAuthToken["role"] | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isHydrated: false,
  userEmail: null,
  userName: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuthState: (
      state,
      action: {
        payload: DecodedAuthToken | null;
      },
    ) => {
      state.isHydrated = true;

      if (!action.payload) {
        state.isAuthenticated = false;
        state.userEmail = null;
        state.userName = null;
        state.role = null;
        return;
      }

      state.isAuthenticated = true;
      state.userEmail = action.payload.email;
      state.userName = action.payload.name ?? null;
      state.role = action.payload.role;
    },
    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.isHydrated = true;
      state.userEmail = null;
      state.userName = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      const user = action.payload.data.user as AuthUser;

      state.isAuthenticated = true;
      state.isHydrated = true;
      state.userEmail = user.email;
      state.userName = user.name;
      state.role = user.role;
    });
  },
});

export const { hydrateAuthState, logoutLocal } = authSlice.actions;
export const authReducer = authSlice.reducer;
