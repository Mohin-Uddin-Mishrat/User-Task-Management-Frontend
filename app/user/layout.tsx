import { DashboardShell } from "@/components/dashboard-shell";

const userNavItems = [{ href: "/user", label: "Dashboard" }];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell title="User Dashboard" role="USER" navItems={userNavItems}>
      {children}
    </DashboardShell>
  );
}
