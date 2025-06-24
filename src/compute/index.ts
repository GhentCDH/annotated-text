import { AnnotationConfig } from "./model/annotation.config";
import { CreateAnnotations, CreateAnnotationsImpl } from "./CreateAnnotations";
import {
  AnnotationAdapter,
  DefaultAnnotationAdapter,
} from "../adapter/annotation";
import {
  createLineAdapterParams,
  DefaultLineAdapter,
  LineAdapter,
} from "../adapter/line";
import { Line } from "../types/AnnotatedText";
import { Annotation } from "../types/Annotation";

type createAnnotatedTextParams<LINE, ANNOTATION> = {
  line?: LineAdapter<LINE> | createLineAdapterParams<LINE>;
  annotation?:
    | AnnotationAdapter<ANNOTATION>
    | createLineAdapterParams<ANNOTATION>;
};

export const createAnnotatedText = <LINE = Line[], ANNOTATION = Annotation>(
  id: string,
  params: createAnnotatedTextParams<LINE, ANNOTATION> = {},
  // TODO Should become deprecated!
  config: Partial<AnnotationConfig> = {},
): CreateAnnotations<LINE, ANNOTATION> => {
  let lineAdapter: LineAdapter<LINE>;
  if (params.line instanceof LineAdapter) {
    lineAdapter = params.line;
  } else {
    lineAdapter = DefaultLineAdapter(params.line ?? {}) as LineAdapter<LINE>;
  }

  let annotationAdapter: AnnotationAdapter<ANNOTATION>;
  if (params.annotation instanceof AnnotationAdapter) {
    annotationAdapter = params.annotation;
  } else {
    annotationAdapter = DefaultAnnotationAdapter(
      params.annotation ?? {},
    ) as AnnotationAdapter<ANNOTATION>;
  }

  return new CreateAnnotationsImpl<LINE>(
    id,
    lineAdapter,
    annotationAdapter,
    config,
  );
};
