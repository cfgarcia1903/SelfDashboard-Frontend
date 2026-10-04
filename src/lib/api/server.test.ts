import { afterEach, describe, expect, it, vi } from "vitest";
import { backendRequest } from "./server";

const requiredValues = {
  BACKEND_URL: "http://backend.test",
  BACKEND_USER_ID: "server-user",
  BACKEND_USER_PIN: "server-pin",
  BACKEND_API_KEY: "server-key"
};

describe("server backend proxy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns 503 with only missing variable names for empty configuration", async () => {
    vi.stubEnv("BACKEND_URL", " ");
    vi.stubEnv("BACKEND_USER_ID", "present");
    const response = await backendRequest("/summary");
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      message: "El backend no está configurado.",
      missing: ["BACKEND_URL", "BACKEND_USER_PIN", "BACKEND_API_KEY"]
    });
  });

  it("keeps server credentials when optional headers try to override them", async () => {
    vi.stubEnv("BACKEND_URL", requiredValues.BACKEND_URL);
    vi.stubEnv("BACKEND_USER_ID", requiredValues.BACKEND_USER_ID);
    vi.stubEnv("BACKEND_USER_PIN", requiredValues.BACKEND_USER_PIN);
    vi.stubEnv("BACKEND_API_KEY", requiredValues.BACKEND_API_KEY);
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await backendRequest("/summary", { headers: { user_ID: "client-user", "X-APIKEY": "client-key", "X-Trace": "trace" } });
    expect(response.status).toBe(200);
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = new Headers(requestInit.headers);
    expect(headers.get("user_id")).toBe("server-user");
    expect(headers.get("x-apikey")).toBe("server-key");
    expect(headers.get("x-trace")).toBe("trace");
  });
});