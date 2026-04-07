"use client";

import { useState } from "react";
import { getApiMessage } from "@/lib/api";
import { TaskModal } from "@/components/admin/task-modal";
import {
  TaskRecord,
  TaskStatus,
  useDeleteTaskMutation,
  useGetTasksQuery,
} from "@/redux/api/tasksApi";

const statusClasses: Record<NonNullable<TaskStatus>, string> = {
  TODO: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800",
  DONE: "bg-emerald-100 text-emerald-800",
};

type EditingTask = {
  id: string;
  title: string;
  assigneeId: string;
};

function getTaskStatus(task: TaskRecord): NonNullable<TaskStatus> {
  return task.status ?? "TODO";
}

export function TasksTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { data, isLoading, isFetching, isError, refetch } = useGetTasksQuery({
    page: 1,
    limit: 10,
  });
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const tasks = data?.data.data ?? [];
  const meta = data?.data.meta;

  async function handleDelete(taskId: string) {
    setFeedback(null);

    try {
      const response = await deleteTask(taskId).unwrap();
      setFeedback(response.message ?? "Task deleted successfully.");
    } catch (error) {
      setFeedback(getApiMessage(error, "Task delete failed."));
    }
  }

  if (isLoading) {
    return (
      <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600">
        Loading tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 rounded-[28px] border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm text-rose-800">
          Could not load tasks from the API.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {feedback ? (
        <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {feedback}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600">
          <p>
            Showing {tasks.length} task{tasks.length === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {meta ? (
              <p>
                Page {meta.page} of {meta.totalPage} · Total {meta.total}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Assignee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Edit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">
                          {task.assignee?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {task.assignee?.email ?? task.assigneeId}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[getTaskStatus(task)]}`}
                      >
                        {getTaskStatus(task)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingTask({
                            id: task.id,
                            title: task.title,
                            assigneeId: task.assigneeId,
                          })
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        disabled={isDeleting}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isFetching ? (
          <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
            Refreshing task data...
          </div>
        ) : null}
      </div>

      <TaskModal
        key={isAddModalOpen ? "add-open" : "add-closed"}
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={setFeedback}
      />

      <TaskModal
        key={editingTask?.id ?? "edit-closed"}
        isOpen={Boolean(editingTask)}
        mode="edit"
        initialValues={editingTask ?? undefined}
        onClose={() => setEditingTask(null)}
        onSuccess={setFeedback}
      />
    </div>
  );
}
