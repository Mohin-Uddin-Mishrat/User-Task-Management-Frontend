import { TasksTable } from "@/components/admin/tasks-table";

export default function GetAllTaskPage() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
        Admin Workspace
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        Get All Task
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        Review all tasks from the backend in a table view and manage them from the
        admin workspace.
      </p>

      <TasksTable />
    </section>
  );
}
