import { CreateAnnotations, CreateAnnotationsImpl } from "./CreateAnnotations";
import {
  AnnotationAdapter,
  createAnnotationAdapterParams,
  DefaultAnnotationAdapter,
} from "../adapter/annotation";
import {
  createLineAdapterParams,
  DefaultLineAdapter,
  LineAdapter,
} from "../adapter/line";
import type { Annotation, Line } from "../model";

export type { CreateAnnotations } from "./CreateAnnotations";
type createAnnotatedTextParams<LINES, ANNOTATION> = {
  line?: LineAdapter<LINES> | createLineAdapterParams<LINES>;
  annotation?:
    | AnnotationAdapter<ANNOTATION>
    | createAnnotationAdapterParams<ANNOTATION>;
};

export const createAnnotatedText = <LINES = Line[], ANNOTATION = Annotation>(
  id: string,
  params: createAnnotatedTextParams<LINES, ANNOTATION> = {},
): CreateAnnotations<LINES, ANNOTATION> => {
  let lineAdapter: LineAdapter<LINES>;
  if (params.line instanceof LineAdapter) {
    lineAdapter = params.line;
  } else {
    lineAdapter = DefaultLineAdapter(params.line ?? {}) as LineAdapter<LINES>;
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
    lineAdapter,
    annotationAdapter,
  );
};
