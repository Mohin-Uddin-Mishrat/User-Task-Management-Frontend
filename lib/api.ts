export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type PaginatedData<T> = {
  meta: ApiMeta;
  data: T[];
};

export type PaginatedResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: PaginatedData<T>;
};

export function getApiMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
    ? error.data.message
    : fallback;
}
