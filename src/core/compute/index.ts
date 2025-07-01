import { CreateAnnotations, CreateAnnotationsImpl } from "./CreateAnnotations";
import {
  AnnotationAdapter,
  createAnnotationAdapterParams,
  DefaultAnnotationAdapter,
} from "../adapter/annotation";
import {
  createTextAdapterParams,
  PlainTextAdapter,
  TextAdapter,
} from "../adapter/line";
import type { Annotation, Line } from "../model";

export type { CreateAnnotations } from "./CreateAnnotations";
type createAnnotatedTextParams<LINES, ANNOTATION> = {
  text?: TextAdapter | createTextAdapterParams;
  annotation?:
    | AnnotationAdapter<ANNOTATION>
    | createAnnotationAdapterParams<ANNOTATION>;
};

export const createAnnotatedText = <LINES = Line[], ANNOTATION = Annotation>(
  id: string,
  params: createAnnotatedTextParams<LINES, ANNOTATION> = {},
): CreateAnnotations<LINES, ANNOTATION> => {
  let textAdapter: TextAdapter;
  if (params.text instanceof TextAdapter) {
    textAdapter = params.text;
  } else {
    textAdapter = PlainTextAdapter(params.text ?? {}) as TextAdapter;
  }

  let annotationAdapter: AnnotationAdapter<ANNOTATION>;
  if (params.annotation instanceof AnnotationAdapter) {
    annotationAdapter = params.annotation;
  } else {
    annotationAdapter = DefaultAnnotationAdapter(
      params.annotation ?? {},
    ) as AnnotationAdapter<ANNOTATION>;
  }

  return new CreateAnnotationsImpl<LINES, ANNOTATION>(
    id,
    textAdapter,
    annotationAdapter,
  );
};
