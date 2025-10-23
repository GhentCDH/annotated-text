import { AnnotatedText } from "./CreateAnnotations.model";
import { BaseAnnotation, CreateAnnotationsImpl } from "./CreateAnnotations";
import {
  AnnotationAdapter,
  createAnnotationAdapterParams,
  createTextAdapterParams,
  DefaultAnnotationAdapter,
  PlainTextAdapter,
  TextAdapter,
} from "../../adapter";
import type { Annotation } from "../../model/";
import { Debugger } from "../../utils/debugger";

type createAnnotatedTextParams<ANNOTATION> = {
  text?: TextAdapter | createTextAdapterParams;
  annotation?:
    | AnnotationAdapter<ANNOTATION>
    | createAnnotationAdapterParams<ANNOTATION>;
};

const annotatedTextCache = new Map<string, AnnotatedText<any>>();

export const createAnnotatedText = <
  ANNOTATION extends BaseAnnotation = Annotation,
>(
  id: string,
  params: createAnnotatedTextParams<ANNOTATION> = {},
): AnnotatedText<ANNOTATION> => {
  if (annotatedTextCache.has(id)) {
    console.warn(
      "AnnotatedText with this ID already exists:",
      id,
      "the original will be returned, params are ignored. ",
    );

    return annotatedTextCache.get(id) as AnnotatedText<ANNOTATION>;
  }
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
      (params.annotation as any) ?? {},
    ) as unknown as AnnotationAdapter<ANNOTATION>;
  }

  const annotatedImpl = new CreateAnnotationsImpl<ANNOTATION>(
    id,
    textAdapter,
    annotationAdapter,
  ) as AnnotatedText<ANNOTATION>;

  annotatedTextCache.set(id, annotatedImpl);
  annotatedImpl.on("destroy", () => {
    annotatedTextCache.delete(id);
    Debugger.verbose(
      "AnnotatedText with ID",
      id,
      "has been destroyed and removed from cache.",
    );
  });
  return annotatedImpl;
};

export const getAnnotatedText = <ANNOTATION extends BaseAnnotation>(
  id: string,
) => {
  const annotatedText = annotatedTextCache.get(id);
  if (!annotatedText) {
    throw new Error("AnnotatedText with this ID does not exist");
  }

  return annotatedText as AnnotatedText<ANNOTATION>;
};

export const clearAnnotatedTextCache = () => {
  annotatedTextCache.clear();
};
