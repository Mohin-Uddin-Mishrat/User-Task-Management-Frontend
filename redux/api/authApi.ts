import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";
import { getApiBaseUrl } from "./apiBaseUrl";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message?: string;
  token?: string;
  accessToken?: string;
  role?: string;
  user?: {
    role?: string;
    email?: string;
  };
  data?: {
    token?: string;
    accessToken?: string;
    role?: string;
    user?: {
      role?: string;
      email?: string;
    };
  };
};

export type UserOption = {
  id: string;
  name: string;
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
