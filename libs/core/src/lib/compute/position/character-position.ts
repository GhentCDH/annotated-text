import RBush from 'rbush';
import { SvgModel } from '../model/svg.types';
import { TextRasterItem } from '../draw/text/text-raster';
import { insideRange } from '../draw/utils/bounding-rect';

/**
 * Searches for a TextRasterItem at a specific point in the R-tree.
 *
 * Uses a two-phase approach:
 * 1. Query the R-tree for candidates (fast spatial index lookup)
 * 2. Exact check to ensure the point is truly inside the rectangle
 *
 * @param tree - The R-tree containing text raster items
 * @param x - X coordinate in the tree's coordinate space
 * @param y - Y coordinate in the tree's coordinate space
 * @returns The TextRasterItem at the point, or null if none found
 */
const rectAtPointRTree = (
  tree: RBush<TextRasterItem>,
  x: number,
  y: number,
) => {
  // Query R-tree with a zero-area bounding box (a point)
  const candidates = tree.search({ minX: x, minY: y, maxX: x, maxY: y });

  // R-tree returns candidates that might contain the point, so we need exact verification
  for (const c of candidates) {
    if (insideRange(c.minX, c.maxX, x) && insideRange(c.minY, c.maxY, y)) {
      return c;
    }
  }
  return null;
};

/**
 * Result object containing information about a character position in text.
 */
export type CharacterPositionResult = {
  /** Which side of the character's center the click occurred */
  side: 'left' | 'right';
  /** The position of the character in the text (0-indexed) */
  characterPos: number;
  /** @deprecated use characterPos instead */
  newIndex: number;
};

/**
 * Determines which character in the text is at a given point on the screen.
 *
 * This function:
 * 1. Converts screen coordinates to SVG container-relative coordinates
 * 2. Searches the R-tree for text at that position
 * 3. Determines which side of the character was clicked (left or right of center)
 *
 * @param x - Absolute X coordinate (screen space)
 * @param y - Absolute Y coordinate (screen space)
 * @param svgModel - The SVG model containing the text element and spatial index
 * @returns Character position info, or null if no text at that point
 */
export function getCharacterFromTextNodesAtPoint(
  x: number,
  y: number,
  svgModel: SvgModel,
) {
  const container = svgModel.textElement;

  // Convert from absolute screen coordinates to container-relative coordinates
  const relativeX = x - container.getBoundingClientRect().x;
  const relativeY = y - container.getBoundingClientRect().y;

  // Search for text at this position in the spatial index
  const rect = rectAtPointRTree(svgModel.textTree, relativeX, relativeY);

  if (!rect) return null;

  const characterPos = rect.textPosition;

  // Determine if click was on left or right side of character's center
  // This is useful for cursor placement and selection behavior
  const side = relativeX < rect.centerX ? 'left' : 'right';

  // Deprecated field for backward compatibility
  const newIndex = rect.textPosition;

  return {
    newIndex,
    characterPos,
    side,
  } as CharacterPositionResult;
}

/**
 * Calculates the new start/end positions for a text selection based on a character click.
 *
 * This function handles the logic for extending or modifying a text selection:
 * - When clicking on the "right" side of a character, it moves to the next position
 * - It ensures the returned range always has start <= end (handles backward selections)
 * - It intelligently updates either the start or end of the selection based on the target
 *
 * @param characterPos - The position result from clicking on a character
 * @param originalPos - The current selection start and end positions
 * @param target - Whether we're updating the 'start' or 'end' of the selection
 * @returns New selection range with start <= end
 *
 * @example
 * // Extending selection to the right
 * getCharacterStartEndPosition(
 *   { characterPos: 10, side: 'right' },
 *   { start: 5, end: 8 },
 *   'end'
 * )
 * // Returns: { start: 5, end: 11 } (moved to position after character 10)
 */
export const getCharacterStartEndPosition = (
  { characterPos, side }: CharacterPositionResult,
  originalPos: { start: number; end: number },
  target: 'start' | 'end',
) => {
  // Determine which boundary we're modifying
  const _start = target === 'start' ? characterPos : originalPos?.start;
  const _end = target === 'end' ? characterPos : originalPos?.end;

  // Normalize the range so start is always <= end
  // This handles backward selections (dragging right-to-left)
  const start = Math.min(_start, _end);
  const end = Math.max(_start, _end);

  // Special handling for clicking the "right" side of a character
  // The cursor should be positioned AFTER the character, not on it
  if (start === characterPos) {
    // We're modifying the start position
    if (side === 'right') {
      // Move to the next character (between this char and the next)
      return { start: start + 1, end };
    }
  } else {
    // We're modifying the end position
    if (side === 'right') {
      // Move to the next character (between this char and the next)
      return { start, end: end + 1 };
    }
  }

  // Default: use the character position as-is (clicked on left side)
  return { start, end };
};
