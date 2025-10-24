import RBush from "rbush";
import { SvgModel } from "../model/svg.types";
import { TextRasterItem } from "../draw/text/text-raster";
import { insideRange } from "../draw/utils/bounding-rect";

// Point query (as a 0-area box), then exact check
const rectAtPointRTree = (
  tree: RBush<TextRasterItem>,
  x: number,
  y: number,
) => {
  const candidates = tree.search({ minX: x, minY: y, maxX: x, maxY: y });

  for (const c of candidates) {
    if (insideRange(c.minX, c.maxX, x) && insideRange(c.minY, c.maxY, y)) {
      return c;
    }
  }
  return null;
};

export type CharacterPositionResult = {
  side: "left" | "right";
  characterPos: number;
  //@deprecated use characterPos instead
  newIndex: number;
};

export function getCharacterFromTextNodesAtPoint(
  x: number,
  y: number,
  svgModel: SvgModel,
) {
  const container = svgModel.textElement;
  const relativeX = x - container.getBoundingClientRect().x;
  const relativeY = y - container.getBoundingClientRect().y;
  const rect = rectAtPointRTree(svgModel.textTree, relativeX, relativeY);

  if (!rect) return null;

  const characterPos = rect.textPosition;
  const side = relativeX < rect.centerX ? "left" : "right";

  const newIndex = rect.textPosition;

  return {
    newIndex,
    characterPos,
    side,
  } as CharacterPositionResult;
}

export const getCharacterStartEndPosition = (
  { characterPos, side }: CharacterPositionResult,
  originalPos: { start: number; end: number },
  target: "start" | "end",
) => {
  const _start = target === "start" ? characterPos : originalPos?.start;
  const _end = target === "end" ? characterPos : originalPos?.end;
  const start = Math.min(_start, _end);
  const end = Math.max(_start, _end);

  if (start === characterPos) {
    if (side === "right") {
      // move to next character
      return { start: start + 1, end };
    }
  } else {
    if (side === "right") {
      // move to previous character
      return { start, end: end + 1 };
    }
  }

  return { start, end };
};
