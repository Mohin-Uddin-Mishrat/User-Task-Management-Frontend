"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearPersistedAuthToken } from "@/lib/auth-token";
import { logoutLocal } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type DashboardRole = "ADMIN" | "USER";

type DashboardShellProps = {
  title: string;
  role: DashboardRole;
  navItems: Array<{
    href: string;
    label: string;
  }>;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  role,
  navItems,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isHydrated, role: currentRole, userEmail } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (currentRole !== role) {
      router.replace(currentRole === "ADMIN" ? "/admin" : "/user");
    }
  }, [currentRole, isAuthenticated, isHydrated, role, router]);

  function handleLogout() {
    clearPersistedAuthToken();
    dispatch(logoutLocal());
    router.replace("/");
  }

  if (!isHydrated || !isAuthenticated || currentRole !== role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
        Loading dashboard...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#dff2ff_0%,#f8fafc_48%,#fff1df_100%)] text-slate-950">
      <div className="grid min-h-screen grid-cols-1 gap-0 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex min-h-screen flex-col bg-slate-950 px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Task Manager
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Signed in as {userEmail ?? "Unknown user"}
          </p>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-400 text-slate-950"
                      : "border border-white/5 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Logout
          </button>
        </aside>

        <main className="min-h-screen p-4 md:p-6 xl:p-8">
          <div className="min-h-[calc(100vh-2rem)] rounded-[32px] border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur md:min-h-[calc(100vh-3rem)] md:p-8 xl:min-h-[calc(100vh-4rem)] xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
