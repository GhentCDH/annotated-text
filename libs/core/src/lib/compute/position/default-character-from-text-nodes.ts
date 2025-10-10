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

export function getCharacterFromTextNodesAtPoint(
  x: number,
  y: number,
  svgModel: SvgModel,
) {
  const container = svgModel.textElement;
  const rect = rectAtPointRTree(
    svgModel.textTree,
    x - container.getBoundingClientRect().x,
    y - container.getBoundingClientRect().y,
  );

  if (!rect) return null;

  return {
    newIndex: rect.textPosition,
  };
}
