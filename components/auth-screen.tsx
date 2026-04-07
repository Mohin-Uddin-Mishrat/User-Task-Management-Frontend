"use client";

import { FormEvent, useState } from "react";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutLocal } from "@/redux/features/auth/authSlice";

export function AuthScreen() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("123456");
  const [feedback, setFeedback] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { isAuthenticated, userEmail } = useAppSelector((state) => state.auth);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    try {
      const response = await login({ email, password }).unwrap();
      setFeedback(response.message ?? "Login successful.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Login failed. Please check your credentials and try again.";

      setFeedback(message);
    }
  }

  function handleLogout() {
    setFeedback(null);
    dispatch(logoutLocal());
    setFeedback("Local auth state cleared.");
  }

  return (
    <section className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)]">


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
      </p>
    </section>
  );
}
