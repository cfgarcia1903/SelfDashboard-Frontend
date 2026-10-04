import { describe, expect, it } from "vitest";
import { toEtoroTimeline, toSnapshotTimeline } from "./transformers";

const snapshots = [
  { date: "2026-09-30", value_usd: 120, value_pen: 420 },
  { date: "2026-09-28", value_usd: 100, value_pen: 350 },
  { date: "2026-09-29", value_usd: 110, value_pen: 385 }
];

describe("snapshot transformers", () => {
  it("selects USD values and orders snapshots chronologically", () => {
    expect(toSnapshotTimeline(snapshots, "USD")).toEqual([
      { date: "2026-09-28", balance: 100, deposited: null, difference: null },
      { date: "2026-09-29", balance: 110, deposited: null, difference: null },
      { date: "2026-09-30", balance: 120, deposited: null, difference: null }
    ]);
  });

  it("selects PEN values without converting them", () => {
    expect(toSnapshotTimeline(snapshots, "PEN")[0]?.balance).toBe(350);
  });

  it("does not fall back to another currency", () => {
    expect(toSnapshotTimeline(snapshots, "EUR").every((point) => point.balance === null)).toBe(true);
  });

  it("keeps chronological order and finite deposit values in the eToro timeline", () => {
    expect(toEtoroTimeline(snapshots, [{ id: 1, amount: 50, currency: "USD", deposited_at: "28-09-2026", created_at: null }], "USD")).toEqual([
      { date: "2026-09-28", balance: 100, deposited: 50, difference: 50 },
      { date: "2026-09-29", balance: 110, deposited: 50, difference: 60 },
      { date: "2026-09-30", balance: 120, deposited: 50, difference: 70 }
    ]);
  });

  it("groups same-day deposits and applies withdrawals only on their date", () => {
    expect(toEtoroTimeline(snapshots, [
      { id: 1, amount: 100, currency: "USD", deposited_at: "29-09-2026", created_at: null },
      { id: 2, amount: -25, currency: "USD", deposited_at: "29-09-2026", created_at: null },
      { id: 3, amount: 50, currency: "USD", deposited_at: "28-09-2026", created_at: null }
    ], "USD")).toEqual([
      { date: "2026-09-28", balance: 100, deposited: 50, difference: 50 },
      { date: "2026-09-29", balance: 110, deposited: 125, difference: -15 },
      { date: "2026-09-30", balance: 120, deposited: 125, difference: -5 }
    ]);
  });

  it("adds a deposit-only date without interpolating its balance", () => {
    expect(toEtoroTimeline(snapshots, [{ id: 1, amount: 40, currency: "USD", deposited_at: "27-09-2026", created_at: null }], "USD")[0]).toEqual({ date: "2026-09-28", balance: 100, deposited: 40, difference: 60 });
  });

  it("does not mix currencies and marks deposits unavailable when one mismatches", () => {
    const points = toEtoroTimeline(snapshots, [
      { id: 1, amount: 40, currency: "USD", deposited_at: "28-09-2026", created_at: null },
      { id: 2, amount: 80, currency: "PEN", deposited_at: "29-09-2026", created_at: null }
    ], "USD");
    expect(points.every((point) => point.deposited === null)).toBe(true);
    expect(toEtoroTimeline(snapshots, [{ id: 1, amount: -20, currency: "PEN", deposited_at: "28-09-2026", created_at: null }], "PEN")[0]?.deposited).toBe(-20);
  });

  it("keeps only snapshot dates while carrying historical deposits into the visible domain", () => {
    const points = toEtoroTimeline([
      { date: "2026-09-29", value_usd: 110, value_pen: 385 },
      { date: "2026-09-30", value_usd: 120, value_pen: 420 }
    ], [
      { id: 1, amount: 40, currency: "USD", deposited_at: "27-09-2026", created_at: null },
      { id: 2, amount: 25, currency: "USD", deposited_at: "29-09-2026", created_at: null },
      { id: 3, amount: 100, currency: "USD", deposited_at: "01-10-2026", created_at: null }
    ], "USD");

    expect(points).toEqual([
      { date: "2026-09-29", balance: 110, deposited: 65, difference: 45 },
      { date: "2026-09-30", balance: 120, deposited: 65, difference: 55 }
    ]);
  });
});