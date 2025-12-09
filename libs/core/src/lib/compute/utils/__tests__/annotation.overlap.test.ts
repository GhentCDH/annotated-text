import { describe, expect, it } from 'vitest';
import { AnnotationOverlap, type OverlapTextAnnotation } from '../annotation.overlap';

const a1 = { id: 'a1', start: 0, end: 10 } as OverlapTextAnnotation;
const a2 = { id: 'a2', start: 5, end: 15 } as OverlapTextAnnotation;
const a3 = { id: 'a3', start: 20, end: 30 } as OverlapTextAnnotation;
const a4 = { id: 'a4', start: 25, end: 35 } as OverlapTextAnnotation;
const a5 = { id: 'a5', start: 100, end: 110 } as OverlapTextAnnotation;
const annotations: OverlapTextAnnotation[] = [a1, a2, a3, a4, a5];
type TestParams = {
  id: string;
  start: number;
  end: number;
  result: OverlapTextAnnotation[];
};

describe('AnnotationOverlap', () => {
  describe('constructor', () => {
    it('should handle empty annotations array', () => {
      const overlap = AnnotationOverlap.init([]);
      expect(
        overlap.getOverlaps({
          id: 'q1',
          start: 0,
          end: 10,
        } as OverlapTextAnnotation),
      ).toEqual([]);
    });

    it('should handle single annotation', () => {
      const overlap = AnnotationOverlap.init([{ id: 'a1', start: 5, end: 15 }]);
      expect(
        overlap.getOverlaps({ id: 'q1', start: 10, end: 20 }),
      ).toHaveLength(1);
    });
  });

  describe('handles multiple annotations', () => {
    const annotations = [
      { id: 'm1', start: 0, end: 100 },
      { id: 'm2', start: 10, end: 20 },
      { id: 'm3', start: 30, end: 40 },
    ];

    it.each`
      annotation        | expectedCount
      ${annotations[0]} | ${2}
      ${annotations[1]} | ${1}
      ${annotations[2]} | ${1}
    `(
      'should find overlaps for annotation $annotation.id - $expectedCount',
      ({
        annotation,
        expectedCount,
      }: {
        annotation: OverlapTextAnnotation;
        expectedCount: number;
      }) => {
        const overlap = AnnotationOverlap.init(annotations);
        const result = overlap.getOverlaps(annotation as any);
        expect(result).toHaveLength(expectedCount);
      },
    );
  });

  describe('getOverlaps', () => {
    const testGetOverlaps = ({ id, start, end, result }: TestParams) => {
      const overlap = AnnotationOverlap.init(annotations);
      const annotation = { id, start, end };
      const overlaps = overlap.getOverlaps(annotation);
      expect(overlaps).toHaveLength(result.length);
      result.forEach((r) => {
        expect(overlaps).toContainEqual(r);
      });

      const ids = result.map((a) => a.id);
      expect(ids).not.toContainEqual(id);
      expect(overlaps).not.toContainEqual(annotation);
    };

    it.each`
      id          | start  | end    | result      | description
      ${'query1'} | ${8}   | ${10}  | ${[a1, a2]} | ${'find overlapping annotations'}
      ${'a1'}     | ${0}   | ${10}  | ${[a2]}     | ${'exclude itself from results'}
      ${'a1'}     | ${5}   | ${15}  | ${[a2]}     | ${'exclude itself even with different position'}
      ${'query2'} | ${50}  | ${60}  | ${[]}       | ${'no overlaps'}
      ${'query3'} | ${200} | ${210} | ${[]}       | ${'query after all annotations'}
    `('should $description - $id start: $start end: $end -', testGetOverlaps);

    it('should return empty array for query before all annotations', () => {
      const overlapWithGap = AnnotationOverlap.init([
        { id: 'a1', start: 100, end: 110 },
        { id: 'a2', start: 120, end: 130 },
      ] as OverlapTextAnnotation[]);

      const result = overlapWithGap.getOverlaps({
        id: 'query',
        start: 0,
        end: 10,
      });
      expect(result).toEqual([]);
    });

    describe('edge cases - adjacent annotations', () => {
      it.each`
        id         | start | end   | result  | description
        ${'query'} | ${10} | ${20} | ${[a2]} | ${'NOT consider adjacent annotations as overlapping (end equals start)'}
        ${'query'} | ${15} | ${20} | ${[]}   | ${'NOT overlap when query.end === annotation.start'}
        ${'query'} | ${30} | ${40} | ${[a4]} | ${'NOT overlap when query.start === annotation.end'}
      `('should $description - $id start: $start end: $end -', testGetOverlaps);
    });

    describe('containment scenarios', () => {
      it.each`
        id         | start | end   | result              | description
        ${'query'} | ${0}  | ${40} | ${[a1, a2, a3, a4]} | ${'find annotations completely inside query'}
        ${'query'} | ${7}  | ${9}  | ${[a1, a2]}         | ${'find annotations that completely contain query'}
        ${'query'} | ${0}  | ${10} | ${[a1, a2]}         | ${'find annotations equal to query but different id'}
      `('should $description - $id start: $start end: $end -', testGetOverlaps);
    });

    describe('partial overlaps', () => {
      it.each`
        id         | start | end   | result      | description
        ${'query'} | ${8}  | ${12} | ${[a1, a2]} | ${'find left partial overlaps'}
        ${'query'} | ${2}  | ${7}  | ${[a1, a2]} | ${'find right partial overlaps'}
      `('should $description - $id start: $start end: $end -', testGetOverlaps);
    });

    describe('zero-width queries', () => {
      it.each`
        id         | start | end  | result | description
        ${'query'} | ${5}  | ${5} | ${[]}  | ${'return empty for zero-width query inside annotation'}
      `('should $description - $id start: $start end: $end -', testGetOverlaps);
      const overlap = AnnotationOverlap.init(annotations);
      it('should return empty for zero-width query', () => {
        const result = overlap.getOverlaps({ id: 'query', start: 5, end: 5 });
        expect(result).toEqual([]);
      });
    });

    describe('single character overlaps', () => {
      const overlap = AnnotationOverlap.init(annotations);
      it('should detect single character overlap', () => {
        const result = overlap.getOverlaps({ id: 'query', start: 9, end: 10 });
        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ id: 'a1', start: 0, end: 10 });
        expect(result).toContainEqual({ id: 'a2', start: 5, end: 15 });
      });
    });
  });

  describe('hasOverlap', () => {
    const annotations = [
      { id: 'a1', start: 0, end: 10 },
      { id: 'a2', start: 20, end: 30 },
      { id: 'a3', start: 50, end: 60 },
    ];

    const testHasOverlap = ({
      id,
      start,
      end,
      result,
    }: {
      id: string;
      start: number;
      end: number;
      result: boolean;
    }) => {
      const overlap = AnnotationOverlap.init(annotations);
      const annotation = { id, start, end };
      expect(overlap.hasOverlap(annotation)).toBe(result);
    };

    it.each`
      id         | start | end   | result   | description
      ${'query'} | ${5}  | ${15} | ${true}  | ${'overlap exists at start'}
      ${'query'} | ${15} | ${25} | ${true}  | ${'overlap exists at end'}
      ${'query'} | ${30} | ${40} | ${false} | ${'no overlap between annotations'}
      ${'query'} | ${60} | ${70} | ${false} | ${'no overlap after all annotations'}
      ${'query'} | ${10} | ${20} | ${false} | ${'no adjacent annotations'}
      ${'a1'}    | ${0}  | ${10} | ${false} | ${'exclude itself from overlap check'}
      ${'a1'}    | ${0}  | ${30} | ${true}  | ${'exclude itself from overlap check'}
    `('should $description - $id start: $start end: $end -', testHasOverlap);
  });

  it('should return false for empty annotations', () => {
    const emptyOverlap = AnnotationOverlap.init([]);
    expect(emptyOverlap.hasOverlap({ id: 'query', start: 0, end: 10 })).toBe(
      false,
    );
  });

  it('should exclude itself from overlap check', () => {
    // a1 overlaps with position 0-10, but querying with same id should exclude itself
    const singleOverlap = AnnotationOverlap.init([
      { id: 'a1', start: 0, end: 10 },
    ]);
    expect(singleOverlap.hasOverlap({ id: 'a1', start: 0, end: 10 })).toBe(
      false,
    );
  });
});
describe('performance with large datasets', () => {
  it('should handle large number of annotations', () => {
    const largeAnnotations: OverlapTextAnnotation[] = [];
    for (let i = 0; i < 10000; i++) {
      largeAnnotations.push({ id: `a${i}`, start: i * 10, end: i * 10 + 15 });
    }

    const overlap = AnnotationOverlap.init(largeAnnotations);

    const start = performance.now();
    const result = overlap.getOverlaps({
      id: 'query',
      start: 50000,
      end: 50020,
    });
    const duration = performance.now() - start;

    expect(result.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(50);
  });

  it('should handle many overlapping annotations efficiently', () => {
    const overlappingAnnotations: OverlapTextAnnotation[] = [];
    for (let i = 0; i < 1000; i++) {
      overlappingAnnotations.push({
        id: `a${i}`,
        start: 500 - i,
        end: 500 + i + 1,
      });
    }

    const overlap = AnnotationOverlap.init(overlappingAnnotations);

    const start = performance.now();
    const result = overlap.getOverlaps({ id: 'query', start: 499, end: 501 });
    const duration = performance.now() - start;

    expect(result).toHaveLength(1000);
    expect(duration).toBeLessThan(100);
  });
});
