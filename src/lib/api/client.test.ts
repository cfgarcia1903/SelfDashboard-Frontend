import { afterEach, describe, expect, it, vi } from "vitest";
import { dashboardService } from "@/services/dashboard/dashboard.service";
import { etoroService } from "@/services/etoro/etoro.service";
import { ApiError } from "./errors";

describe("dashboard API client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns a typed success payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ snapshots: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(dashboardService.getSnapshots()).resolves.toEqual({ snapshots: [] });
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/etoro/snapshots");
  });

  it("forwards the OpenAPI snapshot period as a query parameter", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ snapshots: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await etoroService.getSnapshots("6M");
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/etoro/snapshots?period=6M");
  });

  it("exposes HTTP status and backend message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Invalid authorization" }), { status: 401 })));
    await expect(dashboardService.getSummary()).rejects.toMatchObject({ status: 401, message: "Invalid authorization" } satisfies Partial<ApiError>);
  });

  it("uses a safe message for malformed error responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not-json", { status: 500 })));
    await expect(etoroService.getDeposits()).rejects.toMatchObject({ status: 500, message: "No pudimos cargar la información." });
  });
});
