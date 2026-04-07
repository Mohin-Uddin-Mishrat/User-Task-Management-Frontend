import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getStoredAuthToken } from "@/lib/auth-token";

type CreateBaseQueryOptions = {
  baseUrl: string;
};

export function createBaseQuery({ baseUrl }: CreateBaseQueryOptions) {
  return fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const accessToken = getStoredAuthToken();

      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  });
}
