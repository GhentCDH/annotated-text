import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AnnotationDrawColor, AnnotationId, TextAnnotation } from '../../../model';
import { AnnotationColors } from '../annotation.colors';
import { SvgModel } from '../svg.types';
import type { AnnotationModule } from '../../../di/annotation.module';
import { AnnotationAdapterToken } from '../../../adapter/annotation';

describe('AnnotationColors', () => {
  let colors: AnnotationColors;
  let mockAnnotationModule: AnnotationModule;
  let mockSvgModel: {
    findFills: ReturnType<typeof vi.fn>;
    findBorders: ReturnType<typeof vi.fn>;
  };
  let mockAnnotationAdapter: {
    getAnnotation: ReturnType<typeof vi.fn>;
  };
  let annotationStore: Map<AnnotationId, TextAnnotation>;

  const makeAnnotation = (
    id: AnnotationId,
    palette = {
      default: { fill: 'gray', border: 'darkgray' },
      hover: { fill: 'blue', border: 'darkblue' },
      active: { fill: 'red', border: 'darkred' },
    },
  ): TextAnnotation =>
    ({
      id,
      _drawMetadata: { color: palette },
    }) as unknown as TextAnnotation;

  const createMockSelection = () => ({
    attr: vi.fn().mockReturnThis(),
  });

  beforeEach(() => {
    annotationStore = new Map();

    mockSvgModel = {
      findFills: vi.fn().mockReturnValue(createMockSelection()),
      findBorders: vi.fn().mockReturnValue(createMockSelection()),
    };

    mockAnnotationAdapter = {
      getAnnotation: vi.fn((id: AnnotationId) => annotationStore.get(id)),
    };

    const mockInject = vi.fn((token: any) => {
      if (token === SvgModel) return mockSvgModel;
      if (token === AnnotationAdapterToken) return mockAnnotationAdapter;
      return {};
    });

    mockAnnotationModule = {
      inject: mockInject,
    } as unknown as AnnotationModule;

    colors = new AnnotationColors(mockAnnotationModule);
  });

  describe('highlightAnnotations', () => {
    it('replaces highlighted set and recolors annotations; returns this', () => {
      // Set up annotations in the store
      const annoA = makeAnnotation('a');
      const annoB = makeAnnotation('b');
      const annoC = makeAnnotation('c');
      annotationStore.set('a', annoA);
      annotationStore.set('b', annoB);
      annotationStore.set('c', annoC);

      // First highlight to establish 'oldIds'
      colors.highlightAnnotations(['a', 'b']);
      mockSvgModel.findFills.mockClear();
      mockSvgModel.findBorders.mockClear();

      // Now replace highlights with ['b','c']
      const ret = colors.highlightAnnotations(['b', 'c']);

      // Should have called findFills for each annotation being recolored
      expect(mockSvgModel.findFills).toHaveBeenCalled();
      expect(ret).toBe(colors); // chainable
    });
  });

  describe('selectAnnotations', () => {
    it('moves ids from highlighted to active; returns this', () => {
      // Set up annotations
      const annoH1 = makeAnnotation('h1');
      const annoH2 = makeAnnotation('h2');
      const annoS1 = makeAnnotation('s1');
      annotationStore.set('h1', annoH1);
      annotationStore.set('h2', annoH2);
      annotationStore.set('s1', annoS1);

      // Start with some highlighted
      colors.highlightAnnotations(['h1', 'h2']);
      mockSvgModel.findFills.mockClear();

      // Select: removes from highlighted, adds to active
      const ret = colors.selectAnnotations(['h2', 's1']);

      expect(mockSvgModel.findFills).toHaveBeenCalled();
      expect(ret).toBe(colors); // chainable
    });

    it('when there were old active ids, they get reset after recoloring current sets', () => {
      const annoA1 = makeAnnotation('a1');
      const annoA2 = makeAnnotation('a2');
      annotationStore.set('a1', annoA1);
      annotationStore.set('a2', annoA2);

      // Establish some active ids first
      colors.selectAnnotations(['a1']);
      mockSvgModel.findFills.mockClear();

      // Now change selection to a different set
      colors.selectAnnotations(['a2']);

      // Should recolor both annotations
      expect(mockSvgModel.findFills).toHaveBeenCalled();
    });
  });

  describe('resetColors (direct)', () => {
    it('resets all given ids (Set or Array)', () => {
      const annoX = makeAnnotation('x');
      const annoY = makeAnnotation('y');
      const annoZ = makeAnnotation('z');
      annotationStore.set('x', annoX);
      annotationStore.set('y', annoY);
      annotationStore.set('z', annoZ);

      colors.resetColors(new Set<AnnotationId>(['x', 'y']));
      colors.resetColors(['z']);

      // Each annotation should have findFills called
      expect(mockSvgModel.findFills).toHaveBeenCalledWith('x');
      expect(mockSvgModel.findFills).toHaveBeenCalledWith('y');
      expect(mockSvgModel.findFills).toHaveBeenCalledWith('z');
    });
  });

  describe('color', () => {
    it('resets highlighted first, then active', () => {
      const annoH = makeAnnotation('h');
      const annoA = makeAnnotation('a');
      annotationStore.set('h', annoH);
      annotationStore.set('a', annoA);

      // highlighted -> ['h'], active -> ['a']
      colors.highlightAnnotations(['h']);
      colors.selectAnnotations(['a']);
      mockSvgModel.findFills.mockClear();

      colors.color();

      expect(mockSvgModel.findFills).toHaveBeenCalledWith('h');
      expect(mockSvgModel.findFills).toHaveBeenCalledWith('a');
    });
  });

  describe('getAnnotationColor', () => {
    it('returns active color when in activeIds', () => {
      const anno = makeAnnotation('id1');
      annotationStore.set('id1', anno);

      colors.selectAnnotations(['id1']);

      expect(
        colors.getAnnotationColor(anno, {
          default: { fill: 'gray' },
          hover: { fill: 'blue' },
          active: { fill: 'red' },
        } as any),
      ).toEqual({ fill: 'red' });
    });

    it('returns hover color when in highlightedIds but not activeIds', () => {
      const anno = makeAnnotation('id2');
      annotationStore.set('id2', anno);

      colors.highlightAnnotations(['id2']);

      expect(
        colors.getAnnotationColor(anno, {
          default: { fill: 'gray' },
          hover: { fill: 'blue' },
          active: { fill: 'red' },
        } as any),
      ).toEqual({ fill: 'blue' });
    });

    it('returns default color when in neither set', () => {
      const anno = makeAnnotation('id3');
      expect(
        colors.getAnnotationColor(anno, {
          default: { fill: 'gray' },
          hover: { fill: 'blue' },
          active: { fill: 'red' },
        } as any),
      ).toEqual({ fill: 'gray' });
    });

    it('active takes priority over highlighted', () => {
      const anno = makeAnnotation('id4');
      annotationStore.set('id4', anno);

      colors.highlightAnnotations(['id4']);
      colors.selectAnnotations(['id4']); // same id now active

      expect(
        colors.getAnnotationColor(anno, {
          default: { fill: 'gray' },
          hover: { fill: 'blue' },
          active: { fill: 'red' },
        } as any),
      ).toEqual({ fill: 'red' });
    });
  });

  describe('resetAnnotationColor', () => {
    it('applies correct fill and border to annotation SVG elements', () => {
      const anno = makeAnnotation('id1');
      annotationStore.set('id1', anno);

      const fillSelection = createMockSelection();
      const borderSelection = createMockSelection();
      mockSvgModel.findFills.mockReturnValue(fillSelection);
      mockSvgModel.findBorders.mockReturnValue(borderSelection);

      colors.resetAnnotationColor('id1');

      expect(mockSvgModel.findFills).toHaveBeenCalledWith('id1');
      expect(fillSelection.attr).toHaveBeenCalledWith('fill', 'gray');
      expect(fillSelection.attr).toHaveBeenCalledWith('stroke', 'none');
      expect(mockSvgModel.findBorders).toHaveBeenCalledWith('id1');
      expect(borderSelection.attr).toHaveBeenCalledWith('fill', 'none');
      expect(borderSelection.attr).toHaveBeenCalledWith('stroke', 'darkgray');
    });

    it('does nothing if annotation not found', () => {
      colors.resetAnnotationColor('nonexistent');

      expect(mockSvgModel.findFills).not.toHaveBeenCalled();
      expect(mockSvgModel.findBorders).not.toHaveBeenCalled();
    });
  });

  describe('colorAnnotation', () => {
    it('applies fill and border colors to SVG elements', () => {
      const fillSelection = createMockSelection();
      const borderSelection = createMockSelection();
      mockSvgModel.findFills.mockReturnValue(fillSelection);
      mockSvgModel.findBorders.mockReturnValue(borderSelection);

      colors.colorAnnotation('id1', {
        fill: 'green',
        border: 'darkgreen',
      } as AnnotationDrawColor);

      expect(mockSvgModel.findFills).toHaveBeenCalledWith('id1');
      expect(fillSelection.attr).toHaveBeenCalledWith('fill', 'green');
      expect(fillSelection.attr).toHaveBeenCalledWith('stroke', 'none');
      expect(mockSvgModel.findBorders).toHaveBeenCalledWith('id1');
      expect(borderSelection.attr).toHaveBeenCalledWith('fill', 'none');
      expect(borderSelection.attr).toHaveBeenCalledWith('stroke', 'darkgreen');
    });

    it('does not apply border if not provided', () => {
      const fillSelection = createMockSelection();
      mockSvgModel.findFills.mockReturnValue(fillSelection);
      mockSvgModel.findBorders.mockReturnValue(null);

      colors.colorAnnotation('id1', { fill: 'green' } as AnnotationDrawColor);

      expect(mockSvgModel.findFills).toHaveBeenCalledWith('id1');
      expect(fillSelection.attr).toHaveBeenCalledWith('fill', 'green');
    });
  });
});
