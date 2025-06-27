import { BaseAdapter } from "../BaseAdapter";
import { type TextLine } from "../../model";
import { getRanges } from "../../compute/utils/ranges/get-range";

export type TextDirection = "ltr" | "rtl";

export abstract class LineAdapter<LINE> extends BaseAdapter {
  textDirection: TextDirection = "ltr";
  flatText: boolean = false;

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

  getRanges(annotation: any, line: TextLine): DOMRect[] | null {
    return getRanges(annotation, line);
  }

  setFlatText(flatText: boolean) {
    this.flatText = flatText;
    return this;
  }
}

export type createLineAdapterParams<LINE> = {
  textDirection?: TextDirection;
  flatText?: boolean; // If true, the adapter will return flat text instead of HTML
};

export const createLineAdapter = <LINE>(
  adapter: LineAdapter<LINE>,
  params: createLineAdapterParams<LINE>,
): LineAdapter<LINE> => {
  if (params.textDirection) {
    adapter.setTextDirection(params.textDirection);
  }
  adapter.setFlatText(!!params.flatText);
  return adapter;
};
