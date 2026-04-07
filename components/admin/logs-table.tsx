"use client";

import { useGetTaskLogsQuery } from "@/redux/api/tasksApi";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LogsTable() {
  const { data, isLoading, isFetching, isError, refetch } = useGetTaskLogsQuery({
    page: 1,
    limit: 10,
  });

  const logs = data?.data.data ?? [];
  const meta = data?.data.meta;

  if (isLoading) {
    return (
      <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600">
        Loading logs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm text-rose-800">Could not load logs from the API.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600">
        <p>
          Showing {logs.length} log{logs.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-3">
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
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                User Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Action Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  No logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {formatTimestamp(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">
                        {log.user?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {log.user?.email ?? log.userId}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{log.action}</p>
                      <p className="leading-6 text-slate-600">{log.details}</p>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFetching && !isLoading ? (
        <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
          Refreshing log data...
        </div>
      ) : null}
    </div>
  );
}
