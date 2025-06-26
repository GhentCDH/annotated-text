import { BaseAdapter } from "../BaseAdapter";
import { type TextLine } from "../../model";
import { getRanges } from "../../compute/utils/ranges/get-range";

export type TextDirection = "ltr" | "rtl";

export abstract class LineAdapter<LINE> extends BaseAdapter {
  textDirection: TextDirection = "ltr";

  abstract parse(lines: LINE): TextLine[];

  setLtr() {
    return this.setTextDirection("ltr");
  }

  setRtl() {
    return this.setTextDirection("rtl");
  }

  setTextDirection(textDirection: TextDirection) {
    this.textDirection = textDirection;
    return this;
  }

  getLineHtml(line: TextLine): string {
    return line.text;
  }

  getRanges(annotation: any, line: TextLine): DOMRect[] | null {
    return getRanges(annotation, line);
  }
}

export type createLineAdapterParams<LINE> = {
  textDirection?: TextDirection;
};

export const createLineAdapter = <LINE>(
  adapter: LineAdapter<LINE>,
  params: createLineAdapterParams<LINE>,
): LineAdapter<LINE> => {
  if (params.textDirection) {
    adapter.setTextDirection(params.textDirection);
  }
  return adapter;
};
