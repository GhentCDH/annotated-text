import { BaseAdapter } from "../BaseAdapter";
import { type TextLine } from "../../model";
import { getRanges } from "../../compute/utils/ranges/get-range";

export type TextDirection = "ltr" | "rtl";

export type Limit = { start: number; end: number };

export abstract class TextAdapter extends BaseAdapter {
  textDirection: TextDirection = "ltr";
  flatText: boolean = false;
  limit: Limit | null = null;

  abstract parse(text: string): TextLine[];

  ltr() {
    return this.setTextDirection("ltr");
  }

  rtl() {
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

  setLimit(limit?: Limit) {
    this.limit = limit ?? null;
  }
}

export type createTextAdapterParams = {
  /**
   * The text direction for the adapter.
   * Can be either 'ltr' (left-to-right) or 'rtl' (right-to-left).
   * Defaults to 'ltr'.
   */
  textDirection?: TextDirection;
  /**
   * If true, the adapter will return flat text instead of HTML.
   * This is useful for plain text processing or when HTML formatting is not needed.
   * Defaults to false.
   */
  flatText?: boolean;
  /**
   * Defines the range of positions in the text that the adapter should consider.
   * Each lines that intersects with this range will be included in the output.
   */
  limit?: Limit | null;
};

export const createLineAdapter = (
  adapter: TextAdapter,
  params: createTextAdapterParams,
): TextAdapter => {
  if (params.textDirection) {
    adapter.setTextDirection(params.textDirection);
  }
  adapter.setFlatText(!!params.flatText);
  adapter.setLimit(params.limit);

  return adapter;
};
