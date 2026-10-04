import { NextResponse } from "next/server";

const requiredEnv = ["BACKEND_URL", "BACKEND_USER_ID", "BACKEND_USER_PIN", "BACKEND_API_KEY"] as const;

export async function backendRequest(path: string, init?: RequestInit): Promise<NextResponse> {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    return NextResponse.json({ message: "El backend no está configurado.", missing }, { status: 503 });
  }
  const backendUrl = process.env.BACKEND_URL!.trim();
  const userId = process.env.BACKEND_USER_ID!.trim();
  const userPin = process.env.BACKEND_USER_PIN!.trim();
  const apiKey = process.env.BACKEND_API_KEY!.trim();

  try {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    headers.set("user_ID", userId);
    headers.set("user_PIN", userPin);
    headers.set("X-APIKEY", apiKey);
    const response = await fetch(`${backendUrl}${path}`, {
      ...init,
      headers,
      cache: "no-store"
    });
    const body = await response.text();
    return new NextResponse(body || null, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "No pudimos conectar con el backend." }, { status: 502 });
  }
}
