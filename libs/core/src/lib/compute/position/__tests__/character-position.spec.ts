import RBush from 'rbush';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type CharacterPositionResult,
  getCharacterFromTextNodesAtPoint,
  getCharacterStartEndPosition,
} from '../character-position';
import { type TextRasterItem } from '../../draw/text/text-raster';
import {
  type DimensionsWithScale,
  getScaledDimensions,
} from '../unscaled';

// Mock the unscaled module
vi.mock('../unscaled');

beforeEach(() => {
  globalThis.getComputedStyle = vi.fn().mockReturnValue({
    getPropertyValue: vi.fn().mockReturnValue(''),
    lineHeight: '20px',
    fontSize: '16px',
  });
});

describe('getCharacterFromTextNodesAtPoint', () => {
  let mockTextElementDimensions: DimensionsWithScale;
  let mockTextTree: RBush<TextRasterItem>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTextTree = new RBush<TextRasterItem>();

    // Mock text element dimensions
    mockTextElementDimensions = {
      original: { x: 100, y: 50, width: 200, height: 100 },
      scaled: { x: 100, y: 50, width: 200, height: 100 },
      scale: 1,
    } as DimensionsWithScale;

    // Mock getScaledDimensions to convert absolute to relative coordinates
    // It subtracts container position from the input coordinates
    vi.mocked(getScaledDimensions).mockImplementation((containerDims, rect) => ({
      x: rect.x - containerDims.original.x,
      y: rect.y - containerDims.original.y,
      width: rect.width,
      height: rect.height,
    }));
  });

  it('should return null when no text is found at the point', () => {
    const result = getCharacterFromTextNodesAtPoint(
      150,
      75,
      mockTextElementDimensions,
      mockTextTree,
    );
    expect(result).toBeNull();
  });

  it('should return character on left side when point is left of center', () => {
    const textItem: TextRasterItem = {
      minX: 10,
      minY: 10,
      maxX: 50,
      maxY: 30,
      centerX: 30,
      textPosition: 5,
    } as TextRasterItem;

    mockTextTree.insert(textItem);

    // Point at x=120 (relative: 20), which is left of centerX (30)
    const result = getCharacterFromTextNodesAtPoint(
      120,
      70,
      mockTextElementDimensions,
      mockTextTree,
    );

    expect(result).not.toBeNull();
    expect(result?.characterPos).toBe(5);
    expect(result?.side).toBe('left');
    expect(result?.newIndex).toBe(5);
  });

  it('should return character on right side when point is right of center', () => {
    const textItem: TextRasterItem = {
      minX: 10,
      minY: 10,
      maxX: 50,
      maxY: 30,
      centerX: 30,
      textPosition: 5,
    } as TextRasterItem;

    mockTextTree.insert(textItem);

    // Point at x=140 (relative: 40), which is right of centerX (30)
    const result = getCharacterFromTextNodesAtPoint(
      140,
      70,
      mockTextElementDimensions,
      mockTextTree,
    );

    expect(result).not.toBeNull();
    expect(result?.characterPos).toBe(5);
    expect(result?.side).toBe('right');
  });

  it('should correctly calculate relative coordinates', () => {
    const textItem: TextRasterItem = {
      minX: 0,
      minY: 0,
      maxX: 20,
      maxY: 20,
      centerX: 10,
      textPosition: 0,
    } as TextRasterItem;

    mockTextTree.insert(textItem);

    // Absolute coords: (100, 50), Relative: (0, 0)
    const result = getCharacterFromTextNodesAtPoint(
      100,
      50,
      mockTextElementDimensions,
      mockTextTree,
    );

    expect(result).not.toBeNull();
  });

  it('should return null when point is outside all rectangles', () => {
    const textItem: TextRasterItem = {
      minX: 10,
      minY: 10,
      maxX: 20,
      maxY: 20,
      centerX: 15,
      textPosition: 0,
    } as TextRasterItem;

    mockTextTree.insert(textItem);

    // Point far outside the rectangle
    const result = getCharacterFromTextNodesAtPoint(
      500,
      500,
      mockTextElementDimensions,
      mockTextTree,
    );

    expect(result).toBeNull();
  });

  it('should handle multiple rectangles and return the correct one', () => {
    const textItem1: TextRasterItem = {
      minX: 0,
      minY: 0,
      maxX: 20,
      maxY: 20,
      centerX: 10,
      textPosition: 0,
    } as TextRasterItem;

    const textItem2: TextRasterItem = {
      minX: 30,
      minY: 0,
      maxX: 50,
      maxY: 20,
      centerX: 40,
      textPosition: 1,
    } as TextRasterItem;

    mockTextTree.insert(textItem1);
    mockTextTree.insert(textItem2);

    // Point in second rectangle (absolute: 135, relative: 35)
    const result = getCharacterFromTextNodesAtPoint(
      135,
      60,
      mockTextElementDimensions,
      mockTextTree,
    );

    expect(result).not.toBeNull();
    expect(result?.characterPos).toBe(1);
  });

  it('should handle point exactly on boundary', () => {
    const textItem: TextRasterItem = {
      minX: 10,
      minY: 10,
      maxX: 20,
      maxY: 20,
      centerX: 15,
      textPosition: 0,
    } as TextRasterItem;

    mockTextTree.insert(textItem);

    // Point exactly on minX boundary (absolute: 110, relative: 10)
    const result = getCharacterFromTextNodesAtPoint(
      110,
      60,
      mockTextElementDimensions,
      mockTextTree,
    );

    expect(result).not.toBeNull();
    expect(result!.characterPos).toBe(0);
  });
});

describe('getCharacterStartEndPosition', () => {
  describe('when target is "start"', () => {
    it('should update start position when clicking left side', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 5,
        newIndex: 5,
      };
      const originalPos = { start: 10, end: 15 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 5, end: 15 });
    });

    it('should move to next character when clicking right side at start', () => {
      const charResult: CharacterPositionResult = {
        side: 'right',
        characterPos: 5,
        newIndex: 5,
      };
      const originalPos = { start: 10, end: 15 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 6, end: 15 });
    });

    it('should maintain proper order when new start is after end', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 20,
        newIndex: 20,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      // Should swap to ensure start <= end
      expect(result).toEqual({ start: 10, end: 20 });
    });
  });

  describe('when target is \'end\'', () => {
    it('should update end position when clicking left side', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 15,
        newIndex: 15,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'end',
      );

      expect(result).toEqual({ start: 5, end: 15 });
    });

    it('should move to next character when clicking right side at end', () => {
      const charResult: CharacterPositionResult = {
        side: 'right',
        characterPos: 15,
        newIndex: 15,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'end',
      );

      expect(result).toEqual({ start: 5, end: 16 });
    });

    it('should maintain proper order when new end is before start', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 3,
        newIndex: 3,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'end',
      );

      // Should swap to ensure start <= end
      expect(result).toEqual({ start: 3, end: 5 });
    });
  });

  describe('edge cases', () => {
    it('should handle same start and end positions', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 5,
        newIndex: 5,
      };
      const originalPos = { start: 5, end: 5 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 5, end: 5 });
    });

    it('should handle position at 0', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 0,
        newIndex: 0,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 0, end: 10 });
    });

    it('should handle right side click at position 0', () => {
      const charResult: CharacterPositionResult = {
        side: 'right',
        characterPos: 0,
        newIndex: 0,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 1, end: 10 });
    });

    it('should handle backward selection (dragging right to left)', () => {
      const charResult: CharacterPositionResult = {
        side: 'left',
        characterPos: 3,
        newIndex: 3,
      };
      const originalPos = { start: 10, end: 15 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 3, end: 15 });
    });
  });

  describe('complex selection scenarios', () => {
    it('should handle extending selection to the right with right side click', () => {
      const charResult: CharacterPositionResult = {
        side: 'right',
        characterPos: 20,
        newIndex: 20,
      };
      const originalPos = { start: 5, end: 10 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'end',
      );

      expect(result).toEqual({ start: 5, end: 21 });
    });

    it('should handle shrinking selection from the left', () => {
      const charResult: CharacterPositionResult = {
        side: 'right',
        characterPos: 7,
        newIndex: 7,
      };
      const originalPos = { start: 5, end: 15 };

      const result = getCharacterStartEndPosition(
        charResult,
        originalPos,
        'start',
      );

      expect(result).toEqual({ start: 8, end: 15 });
    });
  });
});