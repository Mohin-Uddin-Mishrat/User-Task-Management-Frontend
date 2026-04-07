import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/redux/api/authApi";

type AuthState = {
  isAuthenticated: boolean;
  isHydrated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  role: "ADMIN" | "USER" | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isHydrated: false,
  userId: null,
  userName: null,
  userEmail: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuthState: (
      state,
      action: {
        payload:
          | {
              id: string;
              email: string;
              role: "ADMIN" | "USER";
              name?: string;
            }
          | null;
      },
    ) => {
      state.isHydrated = true;

      if (!action.payload) {
        state.isAuthenticated = false;
        state.userId = null;
        state.userName = null;
        state.userEmail = null;
        state.role = null;
        return;
      }

      state.isAuthenticated = true;
      state.userId = action.payload.id;
      state.userName = action.payload.name ?? null;
      state.userEmail = action.payload.email;
      state.role = action.payload.role;
    },
    logoutLocal: (state) => {
      state.isAuthenticated = false;
      state.isHydrated = true;
      state.userId = null;
      state.userName = null;
      state.userEmail = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      const response = action.payload;
      const detectedRole =
        response.role ??
        response.user?.role ??
        response.data?.role ??
        response.data?.user?.role;

      state.isAuthenticated = true;
      state.isHydrated = true;
      state.userId = null;
      state.userName = null;
      state.userEmail =
        response.user?.email ??
        response.data?.user?.email ??
        action.meta.arg.originalArgs.email;
      state.role = detectedRole === "ADMIN" ? "ADMIN" : "USER";
    });
  },
});

export const { hydrateAuthState, logoutLocal } = authSlice.actions;
export const authReducer = authSlice.reducer;
