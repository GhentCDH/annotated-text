import { cloneDeep, merge } from "lodash-es";
import { TextAnnotation, TextLine } from "@ghentcdh/annotated-text";
import {
  AnnotationDimension,
  AnnotationDraw,
  AnnotationDrawColors,
} from "../../../compute/annotation.model";

export type AnnotationRenderParams = {
  textDirection: "ltr" | "rtl";
  maxGutterWeight: number;
};

export type RenderParams<ANNOTATION> = {
  defaultRenderer: "gutter" | "highlight" | "underline" | string;
  styleFn: (annotation: any) => string | null;
  renderFn: (
    annotation: ANNOTATION,
  ) => "gutter" | "highlight" | "underline" | string | null;
};

export abstract class AnnotationRender<STYLE extends AnnotationStyle> {
  /**
   * Determines the rendering priority when multiple renderers apply to overlapping annotations.
   * Lower values are rendered first (bottom layer), higher values on top.
   *
   */
  abstract weightOrder: number;

  abstract name: string;

  protected constructor(private defaultStyle: STYLE) {
    this.style = cloneDeep(defaultStyle);
  }

  style: STYLE;

  /**
   * Indicates whether this renderer displays content in the gutter (margin)
   * or inline with the text.
   *
   * @default false
   */
  abstract isGutter: boolean;

  abstract render(
    params: AnnotationRenderParams,
    lines: TextLine[],
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ): {
    draws: AnnotationDraw[];
    isGutter: boolean;
    startPosition: AnnotationDimension;
    color: AnnotationDrawColors;
  };

  updateStyle(style: Partial<STYLE>) {
    this.style = merge(cloneDeep(this.defaultStyle), style) as STYLE;
  }
}

export const DefaultAnnotationStyle = {
  hover: {
    color: {
      border: "rgba(100, 100, 100, 0.5)",
      fill: "rgba(1, 1, 1, 0.1)",
    },
  },
  edit: {
    color: {
      border: "rgba(255,0,0,0.9)",
    },
  },
  // TODO some of them will be equal everywhere, decide which ones to keep, and which ones to move to the params
  padding: 6,
  lineHeight: 22,
  borderRadius: 6,
  border: 2,
  handleRadius: 6,
};
export type AnnotationStyle = typeof DefaultAnnotationStyle;
