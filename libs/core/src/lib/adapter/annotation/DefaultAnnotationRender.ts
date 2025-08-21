import {
  AnnotationAdapter,
  TextAdapter,
  TextAnnotation,
  TextLine,
} from "@ghentcdh/vue-component-annotated-text";
import {
  AnnotationDraw,
  TextAnnotationModel,
} from "../../compute/annotation.model";
import { TextAnnotationRender } from "../../compute/compute/TextAnnotationRender";
import { GutterAnnotationRender } from "../../compute/compute/GutterAnnotationRender";
import { UnderLineAnnotationRender } from "../../compute/compute/UnderLineAnnotationRender";

export type DefaultRenders = "highlight" | "underline";
export type AnnotationRenderFn<ANNOTATION> = (
  annotation: ANNOTATION,
) => AnnotationRender;

export const DefaultAnnotationRender = <ANNOTATION>(
  annotation: ANNOTATION,
  isGutter: boolean,
  rendererName: DefaultRenders,
): AnnotationRender => {
  return isGutter
    ? GutterAnnotationRender
    : rendererName === "highlight"
      ? TextAnnotationRender
      : UnderLineAnnotationRender;
};

export type AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => { draws: AnnotationDraw[]; isGutter: boolean };
