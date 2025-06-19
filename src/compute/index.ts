import { AnnotationConfig } from "./model/annotation.config";
import { ComputeAnnotations } from "./compute_annotations";

export const AnnotatedText_ = {
  init: (config: Partial<AnnotationConfig>) => {
    return new ComputeAnnotations(config);
  },
};
