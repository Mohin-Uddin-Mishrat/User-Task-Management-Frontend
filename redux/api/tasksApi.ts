import { createApi } from "@reduxjs/toolkit/query/react";
import type { PaginatedResponse } from "@/lib/api";
import { getApiBaseUrl } from "./apiBaseUrl";
import { createBaseQuery } from "./baseQuery";

export type CreateTaskRequest = {
  title: string;
  assigneeId: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
};

export type TaskStatus = CreateTaskRequest["status"];

export type CreateTaskResponse = {
  message?: string;
  id?: string;
  task?: {
    id?: string;
    title?: string;
    assigneeId?: string;
    status?: string;
  };
};

export type TaskRecord = {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
};

export type GetTasksRequest = {
  page?: number;
  limit?: number;
  status?: TaskStatus;
};

export type GetTasksResponse = PaginatedResponse<TaskRecord>;

export type GetMyTasksRequest = {
  page?: number;
  limit?: number;
};

export type GetMyTasksResponse = PaginatedResponse<TaskRecord>;

export type UpdateTaskRequest = {
  id: string;
  title: string;
};

export type UpdateTaskResponse = {
  message?: string;
  task?: TaskRecord;
};

export type UpdateTaskStatusRequest = {
  id: string;
  status: NonNullable<TaskStatus>;
};

export type UpdateTaskStatusResponse = {
  message?: string;
  task?: TaskRecord;
};

export type DeleteTaskResponse = {
  message?: string;
};

export type TaskLogRecord = {
  id: string;
  createdAt: string;
  action: string;
  details: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type GetTaskLogsRequest = {
  page?: number;
  limit?: number;
};

export type GetTaskLogsResponse = PaginatedResponse<TaskLogRecord>;

const taskListTag = { type: "Task" as const, id: "LIST" };

function provideTaskList(result?: PaginatedResponse<TaskRecord>) {
  return result
    ? [...result.data.data.map((task) => ({ type: "Task" as const, id: task.id })), taskListTag]
    : [taskListTag];
}

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: createBaseQuery({
    baseUrl: `${getApiBaseUrl()}/api/v1`,
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, GetTasksRequest | void>({
      query: (params) => ({
        url: "/tasks",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          ...(params?.status ? { status: params.status } : {}),
        },
      }),
      providesTags: provideTaskList,
    }),
    getMyTasks: builder.query<GetMyTasksResponse, GetMyTasksRequest | void>({
      query: (params) => ({
        url: "/tasks/my-tasks",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: provideTaskList,
    }),
    createTask: builder.mutation<CreateTaskResponse, CreateTaskRequest>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [taskListTag],
    }),
    updateTask: builder.mutation<UpdateTaskResponse, UpdateTaskRequest>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [taskListTag],
    }),
    updateTaskStatus: builder.mutation<
      UpdateTaskStatusResponse,
      UpdateTaskStatusRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [taskListTag],
    }),
    deleteTask: builder.mutation<DeleteTaskResponse, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [taskListTag],
    }),
    getTaskLogs: builder.query<GetTaskLogsResponse, GetTaskLogsRequest | void>({
      query: (params) => ({
        url: "/tasks/logs",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskLogsQuery,
  useGetMyTasksQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
