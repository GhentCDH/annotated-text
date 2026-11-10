import RBush from 'rbush';
import { type TextAdapter } from '../../../adapter/text';
import { calculateOffset, findLineElement } from '../utils/bounding-rect';
import { getScaledDimensions, getUnscaledRect } from '../../position/unscaled';

/**
 * Represents a character in the spatial index tree with its bounding box
 * and position information
 */
export type TextRasterItem = {
  minX: number; // Left edge of character bounding box
  minY: number; // Top edge of character bounding box
  maxX: number; // Right edge of character bounding box
  maxY: number; // Bottom edge of character bounding box
  textPosition: number; // Absolute position in the document text
  text: string; // The actual character
  centerX: number; // Horizontal center of the character
};

/**
 * Text position of the item closest to a point. The closest line wins, then the
 * closest character on it: a point next to a short line anchors on that line, not
 * on a longer line further away that happens to reach closer horizontally.
 */
export const findNearestTextPosition = (
  items: TextRasterItem[],
  x: number,
  y: number,
): number | null => {
  // ponytail: linear scan over all characters, fine for one call per zoom step.
  // Use a growing rbush search box if this ever runs per frame.
  let nearest: number | null = null;
  let nearestDy = Infinity;
  let nearestDx = Infinity;
  for (const item of items) {
    const dx = Math.max(item.minX - x, 0, x - item.maxX);
    const dy = Math.max(item.minY - y, 0, y - item.maxY);
    if (dy < nearestDy || (dy === nearestDy && dx < nearestDx)) {
      nearestDy = dy;
      nearestDx = dx;
      nearest = item.textPosition;
    }
  }
  return nearest;
};

/**
 * Creates a spatial index (R-tree) of all text characters in an SVG document.
 * This enables efficient spatial queries to find text at specific coordinates.
 *
 * @returns RBush tree with spatial index of all characters
 * @param textElement
 * @param textAdapter
 */
export const drawTextRaster = (
  textElement: HTMLElement,
  textAdapter: TextAdapter,
) => {
  // Initialize R-tree for spatial indexing of text characters
  const tree = new RBush<TextRasterItem>();

  const container = textElement;
  const containerDimensions = getUnscaledRect(container);

  // Create a tree walker to traverse all text nodes in the DOM
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let node: Text | null;
  let prevLineUid: string | null = null;
  let prevEnd = 0; // Track character position within current line

  // Walk through all text nodes in the container
  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent;
    if (!text) continue;

    // Find which line this text node belongs to
    const { lineUid, lineHeight } = findLineElement(node);
    if (!lineUid) {
      continue;
    }

    // Get line model data for position calculation
    const line = textAdapter.getLine(lineUid);
    if (!line) {
      continue;
    }

    // Reset position counter when moving to a new line
    if (lineUid !== prevLineUid) {
      prevEnd = 0;
    }
    prevLineUid = lineUid;

    // Process each character individually for precise spatial indexing
    for (let i = 0; i < text.length; i++) {
      // Create a DOM range for a single character
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + 1);

      // Get the character's bounding rectangle in viewport coordinates .
      const rectDimensions = getScaledDimensions(
        containerDimensions,
        range.getBoundingClientRect(),
      );
      // Calculate vertical offset adjustment based on line height
      const offset = calculateOffset(lineHeight, rectDimensions.height);

      // Calculate absolute position in document
      const textPosition = line.start + i + prevEnd;

      // Convert viewport coordinates to container-relative coordinates
      const minX = rectDimensions.x;
      const minY = rectDimensions.y - offset;
      const width = rectDimensions.width;
      const height = rectDimensions.height + offset * 2;
      const centerX = minX + width / 2;

      // Create spatial index item for this character
      const item = {
        minX: minX,
        minY: minY,
        maxX: minX + width,
        maxY: minY + height,
        textPosition,
        centerX,
        text: text[i],
      };

      // Insert character into spatial index
      tree.insert(item);
    }

    // Update position counter for next text node in same line
    prevEnd += text.length;
  }

  return tree;
};
