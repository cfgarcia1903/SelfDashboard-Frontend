import { ApiError } from "./errors";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, cache: "no-store" });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string" ? payload.message : "No pudimos cargar la información.";
    throw new ApiError(message, response.status);
  }
  return payload as T;
}
