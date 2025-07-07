// write vitest on mapLineToLimit.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDiff, mapLineToLimit, type UpdateLineFn } from "../mapLineToLimit";
import { type TextLine } from "../../../../model";
import { isIntersection } from "../../../../compute/utils/intersect";
import { type Limit } from "../../TextAdapter";

// Mock dependencies
vi.mock("../../../../compute/utils/intersect", () => ({
  isIntersection: vi.fn(),
}));

vi.mock("../../../../model", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    textLineSchema: {
      parse: vi.fn((line) => line),
    },
  };
});

describe("getDiff", () => {
  it("should return correct diff when start matches", () => {
    const line = { start: 0, end: 10, text: "abcdefghij" } as TextLine;
    const result = getDiff(line, { start: 0, end: 10 });
    expect(result).toEqual({ start: 0, end: 10 });
  });

  it("should calculate non-zero start diff and end diff", () => {
    const line = { start: 2, end: 10, text: "cdefghij" } as TextLine;
    const result = getDiff(line, { start: 4, end: 8 });
    // endDiff = 2 => e_diff = 8 - 2 + 1 = 7
    expect(result).toEqual({ start: 2, end: 7 });
  });
});

describe("mapLineToLimit", () => {
  const text = "abcdefghij";
  const baseLine: TextLine = {
    start: 0,
    end: 10,
    text,
  };

  const mockUpdateLine: UpdateLineFn = vi.fn((line, start, end, diff) => ({
    ...line,
    start,
    end,
    text: line.text.slice(diff.start, diff.end),
  }));

  beforeEach(() => {
    mockUpdateLine.mockClear();
  });

  it("returns parsed line when no limit is provided", () => {
    const result = mapLineToLimit(baseLine, null, mockUpdateLine);
    expect(result).toEqual(baseLine);
  });

  it("returns null if line doesn't intersect with limit", () => {
    (isIntersection as any).mockReturnValue(false);
    const result = mapLineToLimit(
      baseLine,
      { start: 20, end: 30, ignoreLines: true },
      mockUpdateLine,
    );
    expect(result).toBeNull();
  });

  it("returns parsed line if ignoreLines is false", () => {
    (isIntersection as any).mockReturnValue(true);
    const result = mapLineToLimit(
      baseLine,
      { start: 2, end: 8, ignoreLines: false },
      mockUpdateLine,
    );
    expect(result).toEqual(baseLine);
  });

  it("updates start and end when both out of limit", () => {
    (isIntersection as any).mockReturnValue(true);
    const limit: Limit = { start: 2, end: 8, ignoreLines: true };

    const result = mapLineToLimit(baseLine, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledTimes(2);
    expect(result.start).toBe(2);
    expect(result.end).toBe(8);
    expect(result.text).toBe("cdefgh");
  });

  it("updates only start when start < limit.start", () => {
    (isIntersection as any).mockReturnValue(true);
    const limit: Limit = { start: 2, end: 10, ignoreLines: true };

    const result = mapLineToLimit(baseLine, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledTimes(1);
    expect(result.start).toBe(2);
    expect(result.end).toBe(10);
    expect(result.text).toBe("cdefghij");
  });

  it("updates only end when end > limit.end", () => {
    (isIntersection as any).mockReturnValue(true);
    const line = { start: 2, end: 12, text: "cdefghijkl" } as TextLine;
    const limit: Limit = { start: 2, end: 8, ignoreLines: true };

    const result = mapLineToLimit(line, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledTimes(1);
    expect(result.start).toBe(2);
    expect(result.end).toBe(8);
    expect(result.text).toBe("cdefghi");
  });
});
