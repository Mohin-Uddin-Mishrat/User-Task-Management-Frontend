"use client";

import { FormEvent, useState } from "react";
import { getApiMessage } from "@/lib/api";
import { useGetUsersQuery } from "@/redux/api/authApi";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/api/tasksApi";

type TaskModalProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  initialValues?: {
    id?: string;
    title?: string;
    assigneeId?: string;
  };
  onClose: () => void;
  onSuccess: (message: string) => void;
};

type FormState = {
  title: string;
  assigneeId: string;
};

export function TaskModal({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSuccess,
}: TaskModalProps) {
  const [form, setForm] = useState<FormState>({
    title: initialValues?.title ?? "",
    assigneeId: initialValues?.assigneeId ?? "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery(
    undefined,
    {
      skip: !isOpen || mode !== "add",
    },
  );

  if (!isOpen) {
    return null;
  }

  const isAddMode = mode === "add";
  const isSubmitting = isCreating || isUpdating;
  const users = usersResponse?.data ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      if (isAddMode) {
        const response = await createTask({
          title: form.title,
          assigneeId: form.assigneeId,
          status: "TODO",
        }).unwrap();

        onSuccess(response.message ?? "Task created successfully.");
        onClose();
        return;
      }

      if (!initialValues?.id) {
        setErrorMessage("Task id is missing.");
        return;
      }

      const response = await updateTask({
        id: initialValues.id,
        title: form.title,
      }).unwrap();

      onSuccess(response.message ?? "Task updated successfully.");
      onClose();
    } catch (error) {
      setErrorMessage(
        getApiMessage(
          error,
          isAddMode ? "Task creation failed." : "Task update failed.",
        ),
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              {isAddMode ? "Add Task" : "Edit Task"}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {isAddMode ? "Create a new task" : "Update task title"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isAddMode
                ? "Create a task here. New tasks use TODO status by default."
                : "Edit the task title here."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </span>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
              placeholder="Fix Bug #123"
              required
            />
          </label>

          {isAddMode ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Assignee
              </span>
              <select
                value={form.assigneeId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    assigneeId: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
                disabled={isLoadingUsers}
                required
              >
                <option value="">
                  {isLoadingUsers ? "Loading users..." : "Select assignee"}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {errorMessage ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting
                ? isAddMode
                  ? "Creating..."
                  : "Saving..."
                : isAddMode
                  ? "Create Task"
                  : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
