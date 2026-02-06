const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8888";

export type ApiError = { detail?: string } | { message?: string } | any;

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let data: ApiError = {};
    try {
      data = await res.json();
    } catch {
      // ignore
    }
    const msg =
      (typeof data?.detail === "string" && data.detail) ||
      (typeof data?.message === "string" && data.message) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return (await res.json()) as T;
}
