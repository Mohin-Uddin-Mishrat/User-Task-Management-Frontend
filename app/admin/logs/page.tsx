import { LogsTable } from "@/components/admin/logs-table";

export default function LogsPage() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
        Admin Workspace
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        Get Logs
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        Review task activity logs from the backend with timestamp, user name, and
        action details in one table.
      </p>

      <LogsTable />
    </section>
  );
}
