// write vitest on mapLineToLimit.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getDiff,
  mapLinesToLimit,
  mapLineToLimit,
  type UpdateLineFn,
} from "../mapLineToLimit";
import { type TextLine } from "../../../../model";
import { isIntersection } from "../../../../compute/utils/intersect";
import { type Limit } from "../../TextAdapter";

// Mock dependencies
vi.mock("../../../../compute/utils/intersect", () => ({
  isIntersection: vi.fn(),
}));

vi.mock("../../../../model", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    textLineSchema: {
      parse: vi.fn((line) => line),
    },
  };
});

describe("getDiff", () => {
  const text = `Lorem ipsum dolor sit amet, **consectetur** adipiscing elit.`;
  it.each`
    lineStart | lineEnd | limitStart | limitEnd | expected
    ${0}      | ${10}   | ${0}       | ${10}    | ${{ start: 0, end: 10 }}
    ${72}     | ${100}  | ${72}      | ${85}    | ${{ start: 0, end: 13 }}
    ${54}     | ${100}  | ${1}       | ${89}    | ${{ start: 0, end: 35 }}
    ${54}     | ${100}  | ${44}      | ${57}    | ${{ start: 0, end: 3 }}
    ${44}     | ${100}  | ${54}      | ${57}    | ${{ start: 10, end: 13 }}
    ${44}     | ${100}  | ${54}      | ${105}   | ${{ start: 10, end: 56 }}
  `(
    "returns $expected for line: [$lineStart, $lineEnd] and limit: [$limitStart, $limitEnd]",
    ({ lineStart, lineEnd, limitStart, limitEnd, expected }) => {
      const line = { start: lineStart, end: lineEnd, text };
      const limit = { start: limitStart, end: limitEnd };
      expect(getDiff(line, limit)).toEqual(expected);
    },
  );
});

describe("mapLineToLimit", () => {
  const text = "abcdefghij";
  const baseLine = {
    start: 0,
    end: 10,
    text,
  } as TextLine;

  const mockUpdateLine: UpdateLineFn = vi.fn((line, start, end, diff) => ({
    ...line,
    start,
    end,
    text: line.text.slice(diff.start, diff.end),
  }));

  beforeEach(() => {
    (mockUpdateLine as any).mockClear();
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

  it("returns parsed line if ignoreLines is false and intersects", () => {
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
    const line = { start: 2, end: 12, text: "cdefghijkl" } as TextLine;
    const limit: Limit = { start: 2, end: 8, ignoreLines: true };

    const result = mapLineToLimit(line, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledTimes(1);
    expect(result.start).toBe(2);
    expect(result.end).toBe(8);
    expect(result.text).toBe("cdefgh");
  });

  describe("mapLinesToLimit", () => {
    const line1: TextLine = { start: 0, end: 5, text: "abcde" };
    const line2: TextLine = { start: 5, end: 10, text: "fghij" };
    const limit: Limit = { start: 2, end: 8 };

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("filters out falsy results from mapLineToLimit", () => {
      (isIntersection as any)
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      const result = mapLinesToLimit(
        [line1, line2],
        { start: 2, end: 8 },
        mockUpdateLine,
      );

      expect(result).toEqual([line2]);
    });

    it("returns an empty array if all lines are filtered out", () => {
      (isIntersection as any).mockReturnValue(false);
      const result = mapLinesToLimit([line1, line2], limit, mockUpdateLine);

      expect(result).toEqual([]);
    });
  });
});
