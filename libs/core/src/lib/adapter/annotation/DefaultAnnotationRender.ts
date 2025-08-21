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

export type GutterFn<ANNOTATION> = (annotation: ANNOTATION) => boolean;

export const DefaultAnnotationRender = <ANNOTATION>(
  annotation: ANNOTATION,
  isGutter: boolean,
): AnnotationRender => {
  return isGutter ? GutterAnnotationRender : TextAnnotationRender;
};

export type AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => { draws: AnnotationDraw[]; isGutter: boolean };
