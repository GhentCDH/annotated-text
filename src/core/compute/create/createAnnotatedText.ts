import { CreateAnnotations } from "./CreateAnnotations.model";
import { CreateAnnotationsImpl } from "./CreateAnnotations";
import {
  createTextAdapterParams,
  PlainTextAdapter,
  TextAdapter,
} from "../../adapter/text";
import {
  AnnotationAdapter,
  createAnnotationAdapterParams,
  DefaultAnnotationAdapter,
} from "../../adapter/annotation";
import type { Annotation } from "../../model/";

type createAnnotatedTextParams<ANNOTATION> = {
  text?: TextAdapter | createTextAdapterParams;
  annotation?: AnnotationAdapter<ANNOTATION> | createAnnotationAdapterParams;
};
export const createAnnotatedText = <ANNOTATION = Annotation>(
  id: string,
  params: createAnnotatedTextParams<ANNOTATION> = {},
): CreateAnnotations<ANNOTATION> => {
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

  return new CreateAnnotationsImpl<ANNOTATION>(
    id,
    textAdapter,
    annotationAdapter,
  );
};
