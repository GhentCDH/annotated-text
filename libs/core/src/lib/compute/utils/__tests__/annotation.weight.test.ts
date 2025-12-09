import { describe, expect, it } from 'vitest';
import { AnnotationWeight } from '../annotation.weight';
import { type TextAnnotation, type TextLine, type TextRender } from '../../../model';
import { type AnnotationRender } from '../../../adapter/annotation/renderer/annotation-render';

// Helper to create annotations
const createAnnotation = (
  id: string,
  start: number,
  end: number,
  render: string,
  lines: TextLine[] = [],
) => {
  return {
    id,
    start,
    end,
    _render: {
      render,
      lines,
    } as TextRender,
  } as TextAnnotation;
};

// Helper to create lines
function createLine(lineNumber: number): TextLine {
  return { lineNumber } as TextLine;
}

// Helper to create render config
function createRender(
  name: string,
  weightOrder: number,
): AnnotationRender<any> {
  return { name, weightOrder } as AnnotationRender<any>;
}

describe('AnnotationWeight', () => {
  describe('basic weight calculation', () => {
    it('should assign weight 0 to non-overlapping annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 20, 30, 'highlight'),
        createAnnotation('a3', 40, 50, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(0);
      expect(annotations[2]._render.weight).toBe(0);
    });

    it('should increment weight for overlapping annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 5, 15, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
    });

    it('should handle chain of overlapping annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 5, 15, 'highlight'),
        createAnnotation('a3', 10, 20, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // a1: weight 0 (no prior overlaps)
      // a2: overlaps a1, weight 1
      // a3: overlaps a2 (not a1, since a1 ends at 10 and a3 starts at 10), weight 2
      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
      expect(annotations[2]._render.weight).toBe(2);
    });

    it('should handle multiple annotations overlapping the same region', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 20, 'highlight'),
        createAnnotation('a2', 5, 15, 'highlight'),
        createAnnotation('a3', 8, 12, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // a1: weight 0
      // a2: overlaps a1, weight 1
      // a3: overlaps a1 (w:0) and a2 (w:1), weight 2
      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
      expect(annotations[2]._render.weight).toBe(2);
    });

    it('should handle nested annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 100, 'highlight'),
        createAnnotation('a2', 10, 20, 'highlight'),
        createAnnotation('a3', 30, 40, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // a1: weight 0
      // a2: inside a1, weight 1
      // a3: inside a1, overlaps with a1 (w:0), weight 1
      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
      expect(annotations[2]._render.weight).toBe(1);
    });
  });

  describe('multiple render types', () => {
    it('should group annotations by render type', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 0, 10, 'underline'),
      ];
      const renders = [
        createRender('highlight', 0),
        createRender('underline', 1),
      ];

      AnnotationWeight.calculate(annotations, renders);

      // Same position but different render types
      // They still overlap, so weights should be affected
      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
    });

    it('should process render types in weightOrder sequence', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'underline'), // weightOrder 1, processed second
        createAnnotation('a2', 0, 10, 'highlight'), // weightOrder 0, processed first
      ];
      const renders = [
        createRender('highlight', 0),
        createRender('underline', 1),
      ];

      AnnotationWeight.calculate(annotations, renders);

      // highlight processed first (weightOrder 0)
      // underline processed second (weightOrder 1)
      expect(annotations[1]._render.weight).toBe(0); // highlight
      expect(annotations[0]._render.weight).toBe(1); // underline
    });

    it('should affect weights across different render groups when overlapping', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 5, 15, 'underline'),
        createAnnotation('a3', 8, 20, 'highlight'),
      ];
      const renders = [
        createRender('highlight', 0),
        createRender('underline', 1),
      ];

      AnnotationWeight.calculate(annotations, renders);

      // Group 0 (highlight): a1, a3 processed first
      // a1: weight 0
      // a3: overlaps a1, weight 1

      // Group 1 (underline): a2 processed second
      // a2: overlaps a1 (w:0) and a3 (w:1), weight 2

      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[2]._render.weight).toBe(1);
      expect(annotations[1]._render.weight).toBe(2);
    });
  });

  describe('maxWeight', () => {
    it('should return 0 for non-overlapping annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 20, 30, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      const result = AnnotationWeight.calculate(annotations, renders);

      expect(result.maxWeight).toBe(0);
    });

    it('should return correct max weight for overlapping annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 5, 15, 'highlight'),
        createAnnotation('a3', 8, 12, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      const result = AnnotationWeight.calculate(annotations, renders);

      expect(result.maxWeight).toBe(2);
    });

    it('should return 0 for empty annotations', () => {
      const annotations: TextAnnotation[] = [];
      const renders = [createRender('highlight', 0)];

      const result = AnnotationWeight.calculate(annotations, renders);

      expect(result.maxWeight).toBe(0);
    });
  });

  describe('line maxLineWeight', () => {
    it('should set maxLineWeight on lines', () => {
      const line1 = createLine(1);
      const line2 = createLine(2);

      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight', [line1]),
        createAnnotation('a2', 5, 15, 'highlight', [line1, line2]),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // line1 is used by a1 (w:0) and a2 (w:1), max should be 1
      expect(line1.maxLineWeight).toBe(1);
      // line2 is only used by a2 (w:1)
      expect(line2.maxLineWeight).toBe(1);
    });

    it('should track maxLineWeight per line independently', () => {
      const line1 = createLine(1);
      const line2 = createLine(2);
      const line3 = createLine(3);

      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight', [line1]),
        createAnnotation('a2', 20, 30, 'highlight', [line2]),
        createAnnotation('a3', 0, 10, 'highlight', [line1, line3]),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // line1: a1 (w:0), a3 (w:1) -> max 1
      // line2: a2 (w:0) -> max 0
      // line3: a3 (w:1) -> max 1
      expect(line1.maxLineWeight).toBe(1);
      expect(line2.maxLineWeight).toBe(0);
      expect(line3.maxLineWeight).toBe(1);
    });

    it('should initialize maxLineWeight to 0 if undefined', () => {
      const line1 = createLine(1);
      expect(line1.maxLineWeight).toBeUndefined();

      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight', [line1]),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      expect(line1.maxLineWeight).toBe(0);
    });

    it('should handle shared lines across annotations', () => {
      const sharedLine = createLine(1);

      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 20, 'highlight', [sharedLine]),
        createAnnotation('a2', 5, 15, 'highlight', [sharedLine]),
        createAnnotation('a3', 8, 12, 'highlight', [sharedLine]),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // All on same line, weights are 0, 1, 2
      expect(sharedLine.maxLineWeight).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle single annotation', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      const result = AnnotationWeight.calculate(annotations, renders);

      expect(annotations[0]._render.weight).toBe(0);
      expect(result.maxWeight).toBe(0);
    });

    it('should handle adjacent (non-overlapping) annotations', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 10, 20, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // Adjacent annotations don't overlap
      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(0);
    });

    it('should handle annotation with unknown render type', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'unknown-render'),
      ];
      const renders = [createRender('highlight', 0)];

      // Should default to weightOrder 0
      AnnotationWeight.calculate(annotations, renders);

      expect(annotations[0]._render.weight).toBe(0);
    });

    it('should handle empty renders array', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
      ];
      const renders = [] as AnnotationRender<any>[];

      AnnotationWeight.calculate(annotations, renders);

      expect(annotations[0]._render.weight).toBe(0);
    });

    it('should handle identical annotations with different ids', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 0, 10, 'highlight'),
        createAnnotation('a3', 0, 10, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
      expect(annotations[2]._render.weight).toBe(2);
    });
  });

  describe('sorting behavior', () => {
    it('should process annotations sorted by start then end position', () => {
      // Deliberately unsorted input
      const annotations: TextAnnotation[] = [
        createAnnotation('a3', 10, 20, 'highlight'),
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 5, 15, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // After sorting: a1 (0-10), a2 (5-15), a3 (10-20)
      // a1: weight 0
      // a2: overlaps a1, weight 1
      // a3: overlaps a2 (not a1), weight 2
      const a1 = annotations.find((a) => a.id === 'a1')!;
      const a2 = annotations.find((a) => a.id === 'a2')!;
      const a3 = annotations.find((a) => a.id === 'a3')!;

      expect(a1._render.weight).toBe(0);
      expect(a2._render.weight).toBe(1);
      expect(a3._render.weight).toBe(2);
    });

    it('should handle same start position, different end positions', () => {
      const annotations: TextAnnotation[] = [
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 0, 20, 'highlight'),
        createAnnotation('a3', 0, 5, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      AnnotationWeight.calculate(annotations, renders);

      // After sorting by start then end: a3 (0-5), a1 (0-10), a2 (0-20)
      // All overlap each other
      const a1 = annotations.find((a) => a.id === 'a1')!;
      const a2 = annotations.find((a) => a.id === 'a2')!;
      const a3 = annotations.find((a) => a.id === 'a3')!;

      expect(a3._render.weight).toBe(2);
      expect(a1._render.weight).toBe(1);
      expect(a2._render.weight).toBe(0);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple non-overlapping groups', () => {
      const annotations: TextAnnotation[] = [
        // Group 1: 0-30
        createAnnotation('a1', 0, 10, 'highlight'),
        createAnnotation('a2', 5, 15, 'highlight'),
        createAnnotation('a3', 10, 20, 'highlight'),
        // Group 2: 50-80 (separate, no overlap with group 1)
        createAnnotation('a4', 50, 60, 'highlight'),
        createAnnotation('a5', 55, 65, 'highlight'),
      ];
      const renders = [createRender('highlight', 0)];

      const result = AnnotationWeight.calculate(annotations, renders);

      // Group 1
      expect(annotations[0]._render.weight).toBe(0);
      expect(annotations[1]._render.weight).toBe(1);
      expect(annotations[2]._render.weight).toBe(2);

      // Group 2 (independent weights)
      expect(annotations[3]._render.weight).toBe(0);
      expect(annotations[4]._render.weight).toBe(1);

      expect(result.maxWeight).toBe(2);
    });

    it('should handle real-world entity annotation scenario', () => {
      const line1 = createLine(1);

      // "New York City is a great place"
      const annotations: TextAnnotation[] = [
        createAnnotation('loc', 0, 13, 'entity', [line1]), // "New York City"
        createAnnotation('city', 0, 8, 'entity', [line1]), // "New York"
        createAnnotation('place', 4, 13, 'entity', [line1]), // "York City"
      ];
      const renders = [createRender('entity', 0)];

      const result = AnnotationWeight.calculate(annotations, renders);

      // Sorted: city (0-8), loc (0-13), place (4-13)
      const city = annotations.find((a) => a.id === 'city')!;
      const loc = annotations.find((a) => a.id === 'loc')!;
      const place = annotations.find((a) => a.id === 'place')!;

      expect(city._render.weight).toBe(1);
      expect(loc._render.weight).toBe(0);
      expect(place._render.weight).toBe(2);

      expect(line1.maxLineWeight).toBe(2);
      expect(result.maxWeight).toBe(2);
    });

    it('should handle mixed render types with complex overlaps', () => {
      const line1 = createLine(1);

      const annotations: TextAnnotation[] = [
        createAnnotation('h1', 0, 20, 'highlight', [line1]),
        createAnnotation('h2', 10, 30, 'highlight', [line1]),
        createAnnotation('u1', 5, 25, 'underline', [line1]),
        createAnnotation('u2', 15, 35, 'underline', [line1]),
      ];
      const renders = [
        createRender('highlight', 0),
        createRender('underline', 1),
      ];

      const result = AnnotationWeight.calculate(annotations, renders);

      // First pass (highlight, weightOrder 0):
      // h1: weight 0
      // h2: overlaps h1, weight 1

      // Second pass (underline, weightOrder 1):
      // u1: overlaps h1(0), h2(1) -> weight 2
      // u2: overlaps h1(0), h2(1), u1(2) -> weight 3

      const h1 = annotations.find((a) => a.id === 'h1')!;
      const h2 = annotations.find((a) => a.id === 'h2')!;
      const u1 = annotations.find((a) => a.id === 'u1')!;
      const u2 = annotations.find((a) => a.id === 'u2')!;

      expect(h1._render.weight).toBe(0);
      expect(h2._render.weight).toBe(1);
      expect(u1._render.weight).toBe(2);
      expect(u2._render.weight).toBe(3);

      expect(result.maxWeight).toBe(3);
      expect(line1.maxLineWeight).toBe(3);
    });
  });
});
