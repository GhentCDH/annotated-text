import { cloneDeep, merge } from "lodash-es";
import {
  AnnotationAdapter,
  TextAdapter,
  TextAnnotation,
  TextLine,
} from "@ghentcdh/annotated-text";
import {
  AnnotationDimension,
  AnnotationDraw,
  AnnotationDrawColors,
  TextAnnotationModel,
} from "../../../compute/annotation.model";

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

  constructor(private defaultStyle: STYLE) {
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
    lines: TextLine[],
    parentDimensions: { x: number; y: number },
    model: TextAnnotationModel,
    annotation: TextAnnotation,
    textAdapter: TextAdapter,
    annotationAdapter: AnnotationAdapter<any>,
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

export type AnnotationStyle = unknown;
