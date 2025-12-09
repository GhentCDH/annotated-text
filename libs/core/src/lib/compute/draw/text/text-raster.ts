import RBush from 'rbush';
import { SvgModel } from '../../model/svg.types';
import { calculateOffset, findLineElement } from '../utils/bounding-rect';

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
 * Creates a spatial index (R-tree) of all text characters in an SVG document.
 * This enables efficient spatial queries to find text at specific coordinates.
 *
 * @param svgModel - The SVG model containing text elements and line data
 * @returns RBush tree with spatial index of all characters
 */
export const drawTextRaster = (svgModel: SvgModel) => {
  // Initialize R-tree for spatial indexing of text characters
  const tree = new RBush<TextRasterItem>();

  const container = svgModel.textElement;

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
    const line = svgModel.model.getLine(lineUid);
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

      // Get the character's bounding rectangle in viewport coordinates
      const rect = range.getBoundingClientRect();

      // Calculate vertical offset adjustment based on line height
      const offset = calculateOffset(lineHeight, rect.height);

      // Calculate absolute position in document
      const textPosition = line.start + i + prevEnd;

      // Convert viewport coordinates to container-relative coordinates
      const minX = rect.x - container.getBoundingClientRect().x;
      const minY = rect.y - container.getBoundingClientRect().y - offset;
      const width = rect.width;
      const height = rect.height + offset * 2;
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
