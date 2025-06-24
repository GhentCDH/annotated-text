import { AnnotationConfig } from "./model/annotation.config";
import { ComputeAnnotations } from "./compute_annotations";
import { CreateAnnotations, CreateAnnotationsImpl } from "./CreateAnnotations";
import { DefaultAnnotationAdapter } from "../adapter/annotation";
import {
  createLineAdapterParams,
  DefaultLineAdapter,
  LineAdapter,
} from "../adapter/line";
import { Line } from "../types/AnnotatedText";

/**
 * @Deprecated
 */
export const AnnotatedText_ = {
  // TODO use adapters
  //
  /**
   * TextAdapter - to transform the lines
   *  AnnotationAdapter - to transform the annotations f.e. w3cADAPTER
   *  Create for each type of adapter a default adapter
   *  Create eventadapter?
   *   Add on('event') functionality
   * @param config
   */
  init: (config: Partial<AnnotationConfig>) => {
    return new ComputeAnnotations(config);
  },
};

type createAnnotatedTextParams<LINE> = {
  line?: LineAdapter<LINE> | createLineAdapterParams<any>;
  annotationAdapter?: createLineAdapterParams<LINE>;
};

export const createAnnotatedText = <LINE = Line[]>(
  id: string,
  params: createAnnotatedTextParams<LINE> = {},
  // TODO Should become deprecated!
  config: Partial<AnnotationConfig> = {},
): CreateAnnotations<LINE> => {
  let lineAdapter: LineAdapter<LINE>;
  if (params.line instanceof LineAdapter) {
    lineAdapter = params.line;
  } else {
    lineAdapter = DefaultLineAdapter(params.line ?? {}) as LineAdapter<LINE>;
  }

  const annotationAdapter =
    params.annotationAdapter || DefaultAnnotationAdapter();

  return new CreateAnnotationsImpl<LINE>(
    id,
    lineAdapter,
    annotationAdapter,
    config,
  );
};
