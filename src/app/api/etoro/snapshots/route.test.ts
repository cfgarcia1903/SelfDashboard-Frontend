import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { backendRequest } from "@/lib/api/server";
import { GET } from "./route";

vi.mock("@/lib/api/server", () => ({ backendRequest: vi.fn() }));

describe("snapshots route", () => {
  beforeEach(() => vi.mocked(backendRequest).mockClear().mockResolvedValue(NextResponse.json({})));

  it("forwards a valid period to the backend", async () => {
    await GET(new Request("http://localhost/api/etoro/snapshots?period=3M"));
    expect(backendRequest).toHaveBeenCalledWith("/api/etoro/snapshots?period=3M");
  });

  it("leaves the backend default untouched when period is missing", async () => {
    await GET(new Request("http://localhost/api/etoro/snapshots"));
    expect(backendRequest).toHaveBeenCalledWith("/api/etoro/snapshots");
  });

  it("rejects periods outside the OpenAPI enum", async () => {
    const response = await GET(new Request("http://localhost/api/etoro/snapshots?period=all"));
    expect(response.status).toBe(400);
    expect(backendRequest).not.toHaveBeenCalled();
  });
});