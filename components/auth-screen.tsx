"use client";

import { FormEvent, useEffect, useState } from "react";
import { getApiMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  extractTokenFromResponse,
  extractUserFromResponse,
  persistAuthToken,
} from "@/lib/auth-token";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";

export function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("123456");
  const [feedback, setFeedback] = useState<string | null>(null);
  const { isAuthenticated, isHydrated, role } = useAppSelector((state) => state.auth);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      return;
    }

    router.replace(role === "ADMIN" ? "/admin" : "/user");
  }, [isAuthenticated, isHydrated, role, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    try {
      const response = await login({ email, password }).unwrap();
      const token = extractTokenFromResponse(response);
      const user = extractUserFromResponse(response);

      if (token) {
        persistAuthToken(token);
      }

      setFeedback(
        response.message ??
          `Login successful. Redirecting to the ${(user?.role ?? "USER").toLowerCase()} dashboard...`,
      );
    } catch (error) {
      setFeedback(
        getApiMessage(
          error,
          "Login failed. Please check your credentials and try again.",
        ),
      );
    }
  }

  if (!isHydrated) {
    return (
      <section className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)]">
        <p className="text-sm text-slate-500">Checking your session...</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)]">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-600">
          Task Management
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to continue
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Users go to the user dashboard and admins land in the admin dashboard
          automatically after login.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="123456"
            autoComplete="current-password"
            required
          />
        </label>

        <div className="flex gap-3 pt-2">
          <button
            className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      {feedback ? (
        <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {feedback}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Use an admin account to open the admin routes, or a regular user account
        to open the user dashboard.
      </p>
    </section>
  );
}
