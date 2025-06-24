import { TextLine } from "../../compute/annotation.model";

export type TextDirection = "ltr" | "rtl";

export abstract class LineAdapter<LINE> {
  textDirection: TextDirection = "ltr";
  abstract name: string;

  abstract parse(lines: LINE): TextLine[];

  setLtr() {
    this.textDirection = "ltr";
    return this;
  }

  setRtl() {
    this.textDirection = "rtl";
    return this;
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
    if (params.textDirection === "ltr") {
      adapter.setLtr();
    } else if (params.textDirection === "rtl") {
      adapter.setRtl();
    }
  }
  return adapter;
};
