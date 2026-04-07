import { MyTasksTable } from "@/components/user/my-tasks-table";

export default function UserPage() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
        Personal Workspace
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        Dashboard
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        Review your assigned tasks here and update the status directly from the
        dashboard.
      </p>

      <MyTasksTable />
    </section>
  );
}
