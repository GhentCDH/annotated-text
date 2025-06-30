import { BaseAdapter } from "../BaseAdapter";
import { type TextLine } from "../../model";
import { getRanges } from "../../compute/utils/ranges/get-range";

export type TextDirection = "ltr" | "rtl";

export abstract class TextAdapter extends BaseAdapter {
  textDirection: TextDirection = "ltr";
  flatText: boolean = false;

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
};

export const createLineAdapter = (
  adapter: TextAdapter,
  params: createTextAdapterParams,
): TextAdapter => {
  if (params.textDirection) {
    adapter.setTextDirection(params.textDirection);
  }
  adapter.setFlatText(!!params.flatText);
  return adapter;
};
