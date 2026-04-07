"use client";

import { useState } from "react";
import { getApiMessage } from "@/lib/api";
import {
  TaskRecord,
  TaskStatus,
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/redux/api/tasksApi";

type DraftStatuses = Record<string, NonNullable<TaskStatus>>;

function getTaskStatus(task: TaskRecord): NonNullable<TaskStatus> {
  return task.status ?? "TODO";
}

export function MyTasksTable() {
  const [draftStatuses, setDraftStatuses] = useState<DraftStatuses>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const { data, isLoading, isFetching, isError, refetch } = useGetMyTasksQuery({
    page: 1,
    limit: 10,
  });
  const [updateTaskStatus, { isLoading: isUpdating }] =
    useUpdateTaskStatusMutation();

  const tasks = data?.data.data ?? [];
  const meta = data?.data.meta;

  async function handleStatusUpdate(
    taskId: string,
    status: NonNullable<TaskStatus>,
  ) {
    setFeedback(null);
    setDraftStatuses((current) => ({
      ...current,
      [taskId]: status,
    }));

    try {
      const response = await updateTaskStatus({ id: taskId, status }).unwrap();
      setFeedback(response.message ?? "Task status updated successfully.");
      setDraftStatuses((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[taskId];
        return nextDrafts;
      });
    } catch (error) {
      setFeedback(getApiMessage(error, "Task status update failed."));
    }
  }

  if (isLoading) {
    return (
      <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600">
        Loading your tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm text-rose-800">
          Could not load your tasks from the API.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {feedback ? (
        <p className="mb-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {feedback}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No tasks assigned to you yet.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <select
                        value={draftStatuses[task.id] ?? getTaskStatus(task)}
                        onChange={(event) =>
                          handleStatusUpdate(
                            task.id,
                            event.target.value as NonNullable<TaskStatus>,
                          )
                        }
                        disabled={isUpdating}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition focus:border-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
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
    </div>
  );
}
