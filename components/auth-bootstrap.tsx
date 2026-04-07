"use client";

import { useEffect } from "react";
import {
  clearPersistedAuthToken,
  decodeAuthToken,
  getStoredAuthToken,
} from "@/lib/auth-token";
import { hydrateAuthState } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getStoredAuthToken();

    if (!token) {
      dispatch(hydrateAuthState(null));
      return;
    }

    const decoded = decodeAuthToken(token);

    if (!decoded) {
      clearPersistedAuthToken();
      dispatch(hydrateAuthState(null));
      return;
    }

    dispatch(hydrateAuthState(decoded));
  }, [dispatch]);

  return null;
}
