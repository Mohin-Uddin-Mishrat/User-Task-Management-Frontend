export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKENR_URL ??
    "https://task-management-9epb.onrender.com"
  );
}
