export type DecodedAuthToken = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  name?: string;
  iat?: number;
  exp?: number;
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

export function extractTokenFromResponse(response: {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
}) {
  return (
    response.accessToken ??
    response.token ??
    response.data?.accessToken ??
    response.data?.token ??
    null
  );
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

function getCookieToken() {
  const possibleCookieNames = [
    "accessToken",
    "token",
    "authToken",
    "jwt",
    "refreshToken",
  ];

  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  for (const name of possibleCookieNames) {
    const matchedCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    if (matchedCookie) {
      return decodeURIComponent(matchedCookie.slice(name.length + 1));
    }
  }

  return null;
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const localToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (localToken) {
    return localToken;
  }

  return getCookieToken();
}
