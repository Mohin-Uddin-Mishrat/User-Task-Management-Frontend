import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message?: string;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKENR_URL ??
    "https://task-management-9epb.onrender.com"
  );
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getApiBaseUrl()}/api/v1/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
