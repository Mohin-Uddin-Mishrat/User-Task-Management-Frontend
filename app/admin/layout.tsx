import { DashboardShell } from "@/components/dashboard-shell";

const adminNavItems = [
  { href: "/admin/get-all-task", label: "Get All Task" },
  { href: "/admin/logs", label: "Get Logs" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell title="Admin Dashboard" role="ADMIN" navItems={adminNavItems}>
      {children}
    </DashboardShell>
  );
}
