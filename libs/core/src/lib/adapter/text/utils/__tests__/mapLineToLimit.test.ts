// write vitest on mapLineToLimit.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getDiff,
  mapLinesToLimit,
  mapLineToLimit,
  type UpdateLineFn,
} from '../mapLineToLimit';
import { type TextLine } from '../../../../model';
import { isIntersection } from '../../../../compute/utils/intersect';
import { type Limit } from '../../TextAdapter';

// Mock dependencies
vi.mock('../../../../compute/utils/intersect', () => ({
  isIntersection: vi.fn(),
}));

vi.mock('../../../../model', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    textLineSchema: {
      parse: vi.fn((line) => line),
    },
  };
});

describe('getDiff', () => {
  const text = 'Lorem ipsum dolor sit amet, **consectetur** adipiscing elit.';

  describe('basic calculations', () => {
    it.each`
      lineStart | lineEnd | limitStart | limitEnd | expected
      ${0}      | ${10}   | ${0}       | ${10}    | ${{ start: 0, end: 10 }}
      ${72}     | ${100}  | ${72}      | ${85}    | ${{ start: 0, end: 13 }}
      ${54}     | ${100}  | ${1}       | ${89}    | ${{ start: 0, end: 35 }}
      ${54}     | ${100}  | ${44}      | ${57}    | ${{ start: 0, end: 3 }}
      ${44}     | ${100}  | ${54}      | ${57}    | ${{ start: 10, end: 13 }}
      ${44}     | ${100}  | ${54}      | ${105}   | ${{ start: 10, end: 56 }}
    `(
      'returns $expected for line: [$lineStart, $lineEnd] and limit: [$limitStart, $limitEnd]',
      ({ lineStart, lineEnd, limitStart, limitEnd, expected }) => {
        const line = { start: lineStart, end: lineEnd, text } as TextLine;
        const limit = { start: limitStart, end: limitEnd };
        expect(getDiff(line, limit)).toEqual(expected);
      },
    );
  });

  describe('edge cases', () => {
    it('returns full line range when limit completely contains line', () => {
      const line = { start: 5, end: 10, text: 'hello' } as TextLine;
      const limit = { start: 0, end: 20 };
      expect(getDiff(line, limit)).toEqual({ start: 0, end: 5 });
    });

    it('returns partial range when line starts at limit start', () => {
      const line = { start: 10, end: 20, text: 'helloworld' } as TextLine;
      const limit = { start: 10, end: 15 };
      expect(getDiff(line, limit)).toEqual({ start: 0, end: 5 });
    });

    it('returns partial range when line ends at limit end', () => {
      const line = { start: 5, end: 15, text: 'helloworld' } as TextLine;
      const limit = { start: 10, end: 15 };
      expect(getDiff(line, limit)).toEqual({ start: 5, end: 10 });
    });

    it('handles zero-length line', () => {
      const line = { start: 5, end: 5, text: '' } as TextLine;
      const limit = { start: 0, end: 10 };
      expect(getDiff(line, limit)).toEqual({ start: 0, end: 0 });
    });

    it('handles limit starting after line start', () => {
      const line = { start: 0, end: 20, text: 'twelve characters' } as TextLine;
      const limit = { start: 5, end: 15 };
      expect(getDiff(line, limit)).toEqual({ start: 5, end: 15 });
    });

    it('handles adjacent ranges (line end equals limit start)', () => {
      const line = { start: 0, end: 10, text: 'helloworld' } as TextLine;
      const limit = { start: 10, end: 20 };
      expect(getDiff(line, limit)).toEqual({ start: 10, end: 10 });
    });

    it('handles single character line', () => {
      const line = { start: 5, end: 6, text: 'a' } as TextLine;
      const limit = { start: 0, end: 10 };
      expect(getDiff(line, limit)).toEqual({ start: 0, end: 1 });
    });

    it('handles single character limit', () => {
      const line = { start: 0, end: 10, text: 'helloworld' } as TextLine;
      const limit = { start: 5, end: 6 };
      expect(getDiff(line, limit)).toEqual({ start: 5, end: 6 });
    });

    it('handles large offset values', () => {
      const line = { start: 10000, end: 10100, text: 'x'.repeat(100) } as TextLine;
      const limit = { start: 10050, end: 10075 };
      expect(getDiff(line, limit)).toEqual({ start: 50, end: 75 });
    });
  });
});

describe('mapLineToLimit', () => {
  const text = 'abcdefghij';
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
    vi.mocked(isIntersection).mockReset();
  });

  describe('when limit is null or undefined', () => {
    it('returns parsed line when no limit is provided', () => {
      const result = mapLineToLimit(baseLine, null, mockUpdateLine);
      expect(result).toEqual(baseLine);
    });

    it('returns parsed line when limit is undefined', () => {
      const result = mapLineToLimit(baseLine, undefined as any, mockUpdateLine);
      expect(result).toEqual(baseLine);
    });

    it('does not call updateLine when no limit', () => {
      mapLineToLimit(baseLine, null, mockUpdateLine);
      expect(mockUpdateLine).not.toHaveBeenCalled();
    });
  });

  describe('when line does not intersect with limit', () => {
    it('returns null if line doesn\'t intersect with limit', () => {
      vi.mocked(isIntersection).mockReturnValue(false);
      const result = mapLineToLimit(
        baseLine,
        { start: 20, end: 30, ignoreLines: true },
        mockUpdateLine,
      );
      expect(result).toBeNull();
    });

    it('returns null when line is completely before limit', () => {
      vi.mocked(isIntersection).mockReturnValue(false);
      const line = { start: 0, end: 10, text: 'abcdefghij' } as TextLine;
      const result = mapLineToLimit(
        line,
        { start: 50, end: 100, ignoreLines: true },
        mockUpdateLine,
      );
      expect(result).toBeNull();
    });

    it('returns null when line is completely after limit', () => {
      vi.mocked(isIntersection).mockReturnValue(false);
      const line = { start: 100, end: 110, text: 'abcdefghij' } as TextLine;
      const result = mapLineToLimit(
        line,
        { start: 0, end: 50, ignoreLines: true },
        mockUpdateLine,
      );
      expect(result).toBeNull();
    });
  });

  describe('when ignoreLines is false', () => {
    it('returns parsed line if ignoreLines is false and intersects', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const result = mapLineToLimit(
        baseLine,
        { start: 2, end: 8, ignoreLines: false },
        mockUpdateLine,
      );
      expect(result).toEqual(baseLine);
    });

    it('does not modify line when ignoreLines is false', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const result = mapLineToLimit(
        baseLine,
        { start: 2, end: 8, ignoreLines: false },
        mockUpdateLine,
      );
      expect(mockUpdateLine).not.toHaveBeenCalled();
      expect(result).toEqual(baseLine);
    });

    it('returns full line when ignoreLines is undefined (falsy)', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const result = mapLineToLimit(
        baseLine,
        { start: 2, end: 8 } as Limit,
        mockUpdateLine,
      );
      expect(result).toEqual(baseLine);
    });
  });

  describe('when ignoreLines is true', () => {
    it('updates start and end when both out of limit', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const limit: Limit = { start: 2, end: 8, ignoreLines: true };

      const result = mapLineToLimit(baseLine, limit, mockUpdateLine);

      expect(mockUpdateLine).toHaveBeenCalledTimes(2);
      expect(result.start).toBe(2);
      expect(result.end).toBe(8);
      expect(result.text).toBe('cdefgh');
    });

    it('updates only start when start < limit.start', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const limit: Limit = { start: 2, end: 10, ignoreLines: true };

      const result = mapLineToLimit(baseLine, limit, mockUpdateLine);

      expect(mockUpdateLine).toHaveBeenCalledTimes(1);
      expect(result.start).toBe(2);
      expect(result.end).toBe(10);
      expect(result.text).toBe('cdefghij');
    });

    it('updates only end when end > limit.end', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 2, end: 12, text: 'cdefghijkl' } as TextLine;
      const limit: Limit = { start: 2, end: 8, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(mockUpdateLine).toHaveBeenCalledTimes(1);
      expect(result.start).toBe(2);
      expect(result.end).toBe(8);
      expect(result.text).toBe('cdefgh');
    });

    it('does not modify line when it exactly matches limit', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 5, end: 10, text: 'fghij' } as TextLine;
      const limit: Limit = { start: 5, end: 10, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(mockUpdateLine).not.toHaveBeenCalled();
      expect(result).toEqual(line);
    });

    it('does not modify line when it is completely within limit', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 5, end: 8, text: 'fgh' } as TextLine;
      const limit: Limit = { start: 0, end: 20, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(mockUpdateLine).not.toHaveBeenCalled();
      expect(result).toEqual(line);
    });
  });

  describe('edge cases with ignoreLines true', () => {
    it('handles single character extraction', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 0, end: 10, text: 'abcdefghij' } as TextLine;
      const limit: Limit = { start: 5, end: 6, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(result.start).toBe(5);
      expect(result.end).toBe(6);
      expect(result.text).toBe('f');
    });

    it('handles line starting exactly at limit start', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 5, end: 15, text: 'fghijklmno' } as TextLine;
      const limit: Limit = { start: 5, end: 10, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(mockUpdateLine).toHaveBeenCalledTimes(1);
      expect(result.start).toBe(5);
      expect(result.end).toBe(10);
    });

    it('handles line ending exactly at limit end', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 0, end: 10, text: 'abcdefghij' } as TextLine;
      const limit: Limit = { start: 5, end: 10, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(mockUpdateLine).toHaveBeenCalledTimes(1);
      expect(result.start).toBe(5);
      expect(result.end).toBe(10);
    });

    it('handles multiline text content', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 0, end: 20, text: 'line1\nline2\nline3\n' } as TextLine;
      const limit: Limit = { start: 6, end: 11, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(result.start).toBe(6);
      expect(result.end).toBe(11);
      expect(result.text).toBe('line2');
    });

    it('preserves unicode characters when slicing', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 0, end: 10, text: '你好世界αβγδ' } as TextLine;
      const limit: Limit = { start: 2, end: 6, ignoreLines: true };

      const result = mapLineToLimit(line, limit, mockUpdateLine);

      expect(result.text).toBe('世界αβ');
    });
  });
});

describe('mapLinesToLimit', () => {
  const mockUpdateLine: UpdateLineFn = vi.fn((line, start, end, diff) => ({
    ...line,
    start,
    end,
    text: line.text.slice(diff.start, diff.end),
  }));

  beforeEach(() => {
    vi.restoreAllMocks();
    (mockUpdateLine as any).mockClear();
  });

  describe('basic functionality', () => {
    const line1 = { start: 0, end: 5, text: 'abcde' } as TextLine;
    const line2 = { start: 5, end: 10, text: 'fghij' } as TextLine;
    const limit: Limit = { start: 2, end: 8 };

    it('filters out falsy results from mapLineToLimit', () => {
      vi.mocked(isIntersection)
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      const result = mapLinesToLimit([line1, line2], limit, mockUpdateLine);

      expect(result).toEqual([line2]);
    });

    it('returns an empty array if all lines are filtered out', () => {
      vi.mocked(isIntersection).mockReturnValue(false);
      const result = mapLinesToLimit([line1, line2], limit, mockUpdateLine);

      expect(result).toEqual([]);
    });

    it('returns all lines when all intersect', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const result = mapLinesToLimit(
        [line1, line2],
        { start: 0, end: 10 },
        mockUpdateLine,
      );

      expect(result).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('handles empty array input', () => {
      const result = mapLinesToLimit([], { start: 0, end: 10 }, mockUpdateLine);
      expect(result).toEqual([]);
    });

    it('handles single line input', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line = { start: 0, end: 10, text: 'helloworld' } as TextLine;
      const result = mapLinesToLimit([line], { start: 0, end: 10 }, mockUpdateLine);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(line);
    });

    it('handles null limit', () => {
      const line1 = { start: 0, end: 5, text: 'abcde' } as TextLine;
      const line2 = { start: 5, end: 10, text: 'fghij' } as TextLine;

      const result = mapLinesToLimit([line1, line2], null, mockUpdateLine);

      expect(result).toHaveLength(2);
      expect(result).toEqual([line1, line2]);
    });

    it('preserves order of lines', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line1 = { start: 0, end: 10, text: 'first' } as TextLine;
      const line2 = { start: 10, end: 20, text: 'second' } as TextLine;
      const line3 = { start: 20, end: 30, text: 'third' } as TextLine;

      const result = mapLinesToLimit(
        [line1, line2, line3],
        { start: 0, end: 30 },
        mockUpdateLine,
      );

      expect(result[0].text).toBe('first');
      expect(result[1].text).toBe('second');
      expect(result[2].text).toBe('third');
    });

    it('handles many lines with mixed intersection results', () => {
      const lines = [
        { start: 0, end: 10, text: 'line0' } as TextLine,
        { start: 10, end: 20, text: 'line1' } as TextLine,
        { start: 20, end: 30, text: 'line2' } as TextLine,
        { start: 30, end: 40, text: 'line3' } as TextLine,
        { start: 40, end: 50, text: 'line4' } as TextLine,
      ];

      // Only lines 1, 2, 3 intersect (indices 1, 2, 3)
      vi.mocked(isIntersection)
        .mockReturnValueOnce(false)  // line0
        .mockReturnValueOnce(true)   // line1
        .mockReturnValueOnce(true)   // line2
        .mockReturnValueOnce(true)   // line3
        .mockReturnValueOnce(false); // line4

      const result = mapLinesToLimit(
        lines,
        { start: 15, end: 35 },
        mockUpdateLine,
      );

      expect(result).toHaveLength(3);
    });

    it('handles lines with same start/end positions', () => {
      vi.mocked(isIntersection).mockReturnValue(true);
      const line1 = { start: 5, end: 10, text: 'hello' } as TextLine;
      const line2 = { start: 5, end: 10, text: 'world' } as TextLine;

      const result = mapLinesToLimit(
        [line1, line2],
        { start: 5, end: 10 },
        mockUpdateLine,
      );

      expect(result).toHaveLength(2);
    });
  });

  describe('integration with limit modifications', () => {
    it('correctly modifies multiple lines based on limit', () => {
      vi.mocked(isIntersection).mockReturnValue(true);

      const lines = [
        { start: 0, end: 10, text: 'abcdefghij' } as TextLine,
        { start: 10, end: 20, text: 'klmnopqrst' } as TextLine,
      ];

      const result = mapLinesToLimit(
        lines,
        { start: 5, end: 15, ignoreLines: true },
        mockUpdateLine,
      );

      expect(result).toHaveLength(2);
      // First line should be trimmed at start
      expect(result[0].start).toBe(5);
      expect(result[0].text).toBe('fghij');
      // Second line should be trimmed at end
      expect(result[1].end).toBe(15);
      expect(result[1].text).toBe('klmno');
    });
  });
});

describe('updateLine callback', () => {
  beforeEach(() => {
    vi.mocked(isIntersection).mockReturnValue(true);
  });

  it('receives correct parameters when updating start', () => {
    const mockUpdateLine = vi.fn((line, start, end, diff) => ({
      ...line,
      start,
      end,
      text: line.text.slice(diff.start, diff.end),
    }));

    const line = { start: 0, end: 10, text: 'abcdefghij' } as TextLine;
    const limit: Limit = { start: 3, end: 10, ignoreLines: true };

    mapLineToLimit(line, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledWith(
      line,
      3,  // new start
      10, // original end
      { start: 3, end: 10 }, // diff
    );
  });

  it('receives correct parameters when updating end', () => {
    const mockUpdateLine = vi.fn((line, start, end, diff) => ({
      ...line,
      start,
      end,
      text: line.text.slice(diff.start, diff.end),
    }));

    const line = { start: 5, end: 15, text: 'fghijklmno' } as TextLine;
    const limit: Limit = { start: 5, end: 10, ignoreLines: true };

    mapLineToLimit(line, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledWith(
      line,
      5,  // original start
      10, // new end
      { start: 0, end: 5 }, // diff
    );
  });

  it('is called twice when both start and end need updating', () => {
    const mockUpdateLine = vi.fn((line, start, end, diff) => ({
      ...line,
      start,
      end,
      text: line.text.slice(diff.start, diff.end),
    }));

    const line = { start: 0, end: 20, text: 'abcdefghijklmnopqrst' } as TextLine;
    const limit: Limit = { start: 5, end: 15, ignoreLines: true };

    mapLineToLimit(line, limit, mockUpdateLine);

    expect(mockUpdateLine).toHaveBeenCalledTimes(2);
  });
});
