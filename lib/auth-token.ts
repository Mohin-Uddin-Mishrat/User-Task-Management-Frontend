export type DecodedAuthToken = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  name?: string;
  iat?: number;
  exp?: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: DecodedAuthToken["role"];
};

export type UserOption = {
  id: string;
  name: string;
};

export type AuthResponseData = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

const AUTH_TOKEN_STORAGE_KEY = "task-manager-auth-token";

function normalizeRole(role: unknown): "ADMIN" | "USER" {
  return role === "ADMIN" ? "ADMIN" : "USER";
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function decodeAuthToken(token: string): DecodedAuthToken | null {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const parsed = JSON.parse(decodeBase64Url(payload)) as Partial<DecodedAuthToken>;

    if (!parsed.id || !parsed.email) {
      return null;
    }

    if (typeof parsed.exp === "number" && parsed.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      role: normalizeRole(parsed.role),
      name: parsed.name,
      iat: parsed.iat,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function extractTokenFromResponse(response: { data?: AuthResponseData }) {
  return response.data?.accessToken ?? null;
}

export function extractUserFromResponse(response: { data?: AuthResponseData }) {
  return response.data?.user ?? null;
}

export function persistAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearPersistedAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}
