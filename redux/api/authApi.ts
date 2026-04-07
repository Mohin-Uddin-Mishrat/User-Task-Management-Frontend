import { createApi } from "@reduxjs/toolkit/query/react";
import type { AuthResponseData, UserOption } from "@/lib/auth-token";
import { createBaseQuery } from "./baseQuery";
import { getApiBaseUrl } from "./apiBaseUrl";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: AuthResponseData;
};

export type GetUsersResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserOption[];
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery({
    baseUrl: `${getApiBaseUrl()}/api/v1/auth`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    getUsers: builder.query<GetUsersResponse, void>({
      query: () => ({
        url: "/users",
      }),
    }),
  }),
});

export const { useGetUsersQuery, useLoginMutation } = authApi;
