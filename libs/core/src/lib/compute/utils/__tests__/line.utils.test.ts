// LineSearch.spec.ts

import { describe, expect, it } from "vitest";
import { getLinesForAnnotation } from "../line.utils";
import type { TextLine } from "../../../model";

describe("LineSearch", () => {
  const createLine = (start: number, end: number) =>
    ({ start, end }) as TextLine;
  const createLines = (...ranges: [number, number][]) =>
    ranges.map(([start, end]) => createLine(start, end));

  describe("getLinesForAnnotation", () => {
    it("should return empty array when no lines provided", () => {
      expect(getLinesForAnnotation([], { start: 0, end: 10 })).toEqual([]);
    });

    describe("single line [0, 100]", () => {
      const lines = createLines([0, 100]);

      it.each`
        start  | end    | expected      | description
        ${10}  | ${50}  | ${[[0, 100]]} | ${"annotation fully within line"}
        ${0}   | ${100} | ${[[0, 100]]} | ${"annotation exactly matches line"}
        ${-10} | ${200} | ${[[0, 100]]} | ${"annotation spans beyond line"}
        ${100} | ${150} | ${[]}         | ${"annotation after line"}
        ${-50} | ${0}   | ${[]}         | ${"annotation before line"}
        ${50}  | ${50}  | ${[]}         | ${"zero-width annotation"}
      `(
        "should return $expected when $description (start=$start, end=$end)",
        ({ start, end, expected }) => {
          const result = getLinesForAnnotation(lines, { start, end });
          expect(result).toEqual(createLines(...expected));
        },
      );
    });

    describe("contiguous lines [0,10], [10,20], [20,30], [30,40], [40,50]", () => {
      const lines = createLines(
        [0, 10],
        [10, 20],
        [20, 30],
        [30, 40],
        [40, 50],
      );

      it.each`
        start  | end   | expected                                             | description
        ${12}  | ${18} | ${[[10, 20]]}                                        | ${"within single middle line"}
        ${0}   | ${5}  | ${[[0, 10]]}                                         | ${"within first line"}
        ${45}  | ${50} | ${[[40, 50]]}                                        | ${"within last line"}
        ${15}  | ${35} | ${[[10, 20], [20, 30], [30, 40]]}                    | ${"spans three middle lines"}
        ${0}   | ${50} | ${[[0, 10], [10, 20], [20, 30], [30, 40], [40, 50]]} | ${"spans all lines"}
        ${5}   | ${15} | ${[[0, 10], [10, 20]]}                               | ${"spans first two lines"}
        ${35}  | ${50} | ${[[30, 40], [40, 50]]}                              | ${"spans last two lines"}
        ${10}  | ${20} | ${[[10, 20]]}                                        | ${"exactly matches one line"}
        ${10}  | ${30} | ${[[10, 20], [20, 30]]}                              | ${"exactly matches two lines"}
        ${50}  | ${60} | ${[]}                                                | ${"after all lines"}
        ${-10} | ${0}  | ${[]}                                                | ${"before all lines"}
      `(
        "should return $expected.length line(s) when $description",
        ({ start, end, expected }) => {
          const result = getLinesForAnnotation(lines, { start, end });
          expect(result).toEqual(createLines(...expected));
        },
      );
    });

    describe("boundary conditions", () => {
      const lines = createLines([0, 10], [10, 20], [20, 30]);

      it.each`
        start | end   | expected               | description
        ${10} | ${15} | ${[[10, 20]]}          | ${"starts at line boundary"}
        ${15} | ${20} | ${[[10, 20]]}          | ${"ends at line boundary"}
        ${10} | ${20} | ${[[10, 20]]}          | ${"matches line boundaries exactly"}
        ${9}  | ${11} | ${[[0, 10], [10, 20]]} | ${"crosses boundary by 1"}
        ${10} | ${10} | ${[]}                  | ${"zero-width at boundary"}
        ${0}  | ${0}  | ${[]}                  | ${"zero-width at start"}
        ${30} | ${30} | ${[]}                  | ${"zero-width at end"}
      `(
        "should handle $description (start=$start, end=$end)",
        ({ start, end, expected }) => {
          const result = getLinesForAnnotation(lines, { start, end });
          expect(result).toEqual(createLines(...expected));
        },
      );
    });

    describe("non-contiguous lines with gaps", () => {
      const lines = createLines([0, 10], [20, 30], [40, 50]);

      it.each`
        start | end   | expected                         | description
        ${5}  | ${45} | ${[[0, 10], [20, 30], [40, 50]]} | ${"spans all lines including gaps"}
        ${12} | ${18} | ${[]}                            | ${"entirely within first gap"}
        ${32} | ${38} | ${[]}                            | ${"entirely within second gap"}
        ${8}  | ${25} | ${[[0, 10], [20, 30]]}           | ${"spans first line, gap, and second line"}
        ${15} | ${25} | ${[[20, 30]]}                    | ${"starts in gap, ends in line"}
        ${25} | ${35} | ${[[20, 30]]}                    | ${"starts in line, ends in gap"}
      `("should handle $description", ({ start, end, expected }) => {
        const result = getLinesForAnnotation(lines, { start, end });
        expect(result).toEqual(createLines(...expected));
      });
    });

    describe("large dataset performance", () => {
      const createLargeLineSet = (count: number) =>
        Array.from({ length: count }, (_, i) =>
          createLine(i * 10, (i + 1) * 10),
        );

      it.each`
        lineCount | start    | end      | expectedCount | description
        ${100}    | ${5}     | ${15}    | ${2}          | ${"matches at beginning"}
        ${100}    | ${505}   | ${515}   | ${2}          | ${"matches in middle"}
        ${100}    | ${985}   | ${995}   | ${2}          | ${"matches at end"}
        ${1000}   | ${4995}  | ${5015}  | ${3}          | ${"matches in large array"}
        ${100}    | ${1000}  | ${1010}  | ${0}          | ${"no match beyond range"}
        ${10000}  | ${50000} | ${50025} | ${3}          | ${"matches in very large array"}
      `(
        "should find $expectedCount lines in array of $lineCount ($description)",
        ({ lineCount, start, end, expectedCount }) => {
          const lines = createLargeLineSet(lineCount);

          const result = getLinesForAnnotation(lines, { start, end });

          expect(result).toHaveLength(expectedCount);
          result.forEach((line) => {
            expect(line.start).toBeLessThan(end);
            expect(line.end).toBeGreaterThan(start);
          });
        },
      );
    });

    describe("extended line properties", () => {
      it("should preserve additional line properties", () => {
        const lines = [
          { start: 0, end: 10, id: "1", content: "Hello" },
          { start: 10, end: 20, id: "2", content: "World" },
          { start: 20, end: 30, id: "3", content: "!" },
        ] as unknown as TextLine[];

        const result = getLinesForAnnotation(lines, { start: 5, end: 25 });

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
          start: 0,
          end: 10,
          id: "1",
          content: "Hello",
        });
        expect(result[1]).toEqual({
          start: 10,
          end: 20,
          id: "2",
          content: "World",
        });
        expect(result[2]).toEqual({
          start: 20,
          end: 30,
          id: "3",
          content: "!",
        });
      });
    });
  });
});
