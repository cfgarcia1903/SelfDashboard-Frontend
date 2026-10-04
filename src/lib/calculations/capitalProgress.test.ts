import { describe, expect, it } from "vitest";
import { calculateCapitalProgress, getProgressPosition, getProgressScale } from "./capitalProgress";

describe("capital progress", () => {
  it("calculates a linear gain", () => {
    const result = calculateCapitalProgress({ deposited: 7000, balance: 8245.32 });
    expect(result.difference).toBeCloseTo(1245.32);
    expect(result.returnPercentage).toBeCloseTo(17.7902857);
    expect(result.scale).toBe("linear");
  });

  it("represents a loss below the deposited reference", () => {
    const result = calculateCapitalProgress({ deposited: 7000, balance: 6000 });
    expect(result.balanceVisualPercent).toBeCloseTo(85.714);
    expect(result.difference).toBe(-1000);
  });

  it("uses the monotonic logarithmic visual scale for a small deposit", () => {
    const result = calculateCapitalProgress({ deposited: 1000, balance: 3000 });
    expect(result.scale).toBe("logarithmic");
    expect(result.depositedVisualPercent).toBe(100);
    expect(result.balanceVisualPercent).toBeGreaterThan(100);
  });

  it("handles zero, negative and missing values without invalid numbers", () => {
    expect(calculateCapitalProgress({ deposited: 0, balance: 100 }).returnPercentage).toBeNull();
    expect(getProgressScale({ deposited: 0, balance: 0 })).toBe("linear");
    expect(getProgressScale({ deposited: -1, balance: 100 })).toBe("unavailable");
    expect(calculateCapitalProgress({ deposited: undefined, balance: undefined }).scale).toBe("unavailable");
  });

  it("clamps the visual balance position to the stable viewport", () => {
    expect(getProgressPosition(100)).toBe(50);
    expect(getProgressPosition(-100)).toBe(8);
    expect(getProgressPosition(1000)).toBe(92);
    expect(getProgressPosition(null)).toBeNull();
  });
});
