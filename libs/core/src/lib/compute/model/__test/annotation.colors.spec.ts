import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AnnotationId, TextAnnotation } from '../../../model';
import type { SvgModel } from '../svg.types';
import { AnnotationColors } from '../annotation.colors';

describe('AnnotationColors', () => {
  let colors: AnnotationColors;
  let svgModel: SvgModel & { resetAnnotationColor: ReturnType<typeof vi.fn> };

  const makeAnnotation = (
    id: AnnotationId,
    palette = { default: 'gray', hover: 'blue', active: 'red' },
  ): TextAnnotation =>
    ({
      id,
      _drawMetadata: { color: palette },
    }) as unknown as TextAnnotation;

  beforeEach(() => {
    colors = new AnnotationColors();
    svgModel = {
      // other SvgModel props are not required for these tests
      resetAnnotationColor: vi.fn(),
    } as unknown as SvgModel & {
      resetAnnotationColor: ReturnType<typeof vi.fn>;
    };
  });

  describe('highlightAnnotations', () => {
    it('replaces highlighted set, colors new and resets old; returns this', () => {
      // First highlight to establish 'oldIds'
      colors.highlightAnnotations(['a', 'b'], svgModel);
      svgModel.resetAnnotationColor.mockClear();

      // Now replace highlights with ['b','c']
      const ret = colors.highlightAnnotations(['b', 'c'], svgModel);

      // color(svg): resets current highlighted first, then active (empty)
      // resetColors(oldIds): resets old highlighted ['a','b']
      expect(svgModel.resetAnnotationColor.mock.calls).toEqual([
        ['b'], // from color(): highlighted
        ['c'], // from color(): highlighted
        ['a'], // from resetColors(oldIds)
        ['b'], // from resetColors(oldIds)
      ]);

      expect(ret).toBe(colors); // chainable
    });
  });

  describe('selectAnnotations', () => {
    it('moves ids from highlighted to active, colors in order: highlighted then active; returns this', () => {
      // Start with some highlighted
      colors.highlightAnnotations(['h1', 'h2'], svgModel);
      svgModel.resetAnnotationColor.mockClear();

      // Select: removes from highlighted, adds to active
      const ret = colors.selectAnnotations(['h2', 's1'], svgModel);

      // color(svg): reset remaining highlighted (h1), then active (h2, s1)
      // resetColors(oldActiveIds): none on first call (empty)
      expect(svgModel.resetAnnotationColor.mock.calls).toEqual([
        ['h1'], // remaining highlighted
        ['h2'], // newly active
        ['s1'], // newly active
      ]);

      expect(ret).toBe(colors); // chainable
    });

    it('when there were old active ids, they get reset after recoloring current sets', () => {
      // Establish some active ids first
      colors.selectAnnotations(['a1'], svgModel);
      svgModel.resetAnnotationColor.mockClear();

      // Now change selection to a different set
      colors.selectAnnotations(['a2'], svgModel);

      // Sequence:
      // 1) color(): reset highlighted (none), then active (a2)
      // 2) resetColors(oldActive) => a1
      expect(svgModel.resetAnnotationColor.mock.calls).toEqual([
        ['a2'],
        ['a1'],
      ]);
    });
  });

  describe('resetColors (direct)', () => {
    it('resets all given ids (Set or Array)', () => {
      colors.resetColors(new Set<AnnotationId>(['x', 'y']), svgModel);
      colors.resetColors(['z'], svgModel);

      expect(svgModel.resetAnnotationColor).toHaveBeenCalledTimes(3);
      expect(svgModel.resetAnnotationColor).toHaveBeenNthCalledWith(1, 'x');
      expect(svgModel.resetAnnotationColor).toHaveBeenNthCalledWith(2, 'y');
      expect(svgModel.resetAnnotationColor).toHaveBeenNthCalledWith(3, 'z');
    });
  });

  describe('color', () => {
    it('resets highlighted first, then active', () => {
      // highlighted -> ['h'], active -> ['a']
      colors.highlightAnnotations(['h'], svgModel);
      colors.selectAnnotations(['a'], svgModel);
      svgModel.resetAnnotationColor.mockClear();

      colors.color(svgModel);

      expect(svgModel.resetAnnotationColor.mock.calls).toEqual([
        ['h'], // highlighted first
        ['a'], // then active
      ]);
    });
  });

  describe('getAnnotationColor', () => {
    it('returns active color when in activeIds', () => {
      colors.selectAnnotations(['id1'], svgModel);
      const anno = makeAnnotation('id1');
      expect(
        colors.getAnnotationColor(anno, {
          default: 'gray',
          hover: 'blue',
          active: 'red',
        } as any),
      ).toBe('red');
    });

    it('returns hover color when in highlightedIds but not activeIds', () => {
      colors.highlightAnnotations(['id2'], svgModel);
      const anno = makeAnnotation('id2');
      expect(
        colors.getAnnotationColor(anno, {
          default: 'gray',
          hover: 'blue',
          active: 'red',
        } as any),
      ).toBe('blue');
    });

    it('returns default color when in neither set', () => {
      const anno = makeAnnotation('id3');
      expect(
        colors.getAnnotationColor(anno, {
          default: 'gray',
          hover: 'blue',
          active: 'red',
        } as any),
      ).toBe('gray');
    });

    it('active takes priority over highlighted', () => {
      colors.highlightAnnotations(['id4'], svgModel);
      colors.selectAnnotations(['id4'], svgModel); // same id now active
      const anno = makeAnnotation('id4');
      expect(
        colors.getAnnotationColor(anno, {
          default: 'gray',
          hover: 'blue',
          active: 'red',
        } as any),
      ).toBe('red');
    });
  });
});
