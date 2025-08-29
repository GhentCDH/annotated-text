import { SvgModel } from "../../model/svg.types";
import { calculateOffset, findLineElement } from "../utils/bounding-rect";
import RBush from "rbush";

export type TextRasterItem = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  textPosition: number;
  text: string;
};
export const drawTextRaster = (svgModel: SvgModel) => {
  // Go through all text elements on the page and add them to the tree, afterwards it will be searchable
  const tree = new RBush<TextRasterItem>();

  const container = svgModel.textElement;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );
  let node: Text | null;
  let prevLineUid: string | null = null;
  let prevEnd = 0;

  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent;
    if (!text) continue;
    const { lineUid, lineHeight } = findLineElement(node);
    if (!lineUid) {
      continue;
    }

    const line = svgModel.model.getLine(lineUid);
    if (!line) {
      continue;
    }
    if (lineUid !== prevLineUid) {
      prevEnd = 0;
    }
    prevLineUid = lineUid;

    for (let i = 0; i < text.length; i++) {
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + 1);

      const rect = range.getBoundingClientRect();
      const offset = calculateOffset(lineHeight, rect.height);
      const textPosition = line.start + i + prevEnd;
      const minX = rect.x - container.getBoundingClientRect().x;
      const minY = rect.y - container.getBoundingClientRect().y - offset;
      const width = rect.width;
      const height = rect.height + offset * 2;

      const item = {
        minX: minX,
        minY: minY,
        maxX: minX + width,
        maxY: minY + height,
        textPosition,
        text: text[i],
      };
      tree.insert(item);
    }

    prevEnd += text.length;
  }

  return tree;
};
