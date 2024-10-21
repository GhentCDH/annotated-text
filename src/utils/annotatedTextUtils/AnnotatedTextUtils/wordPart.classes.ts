import memoize from "memoizee";
import { maxBy } from "lodash-es";
import type { AnnotationInternal } from "../../../types/Annotation";

// TODO check if this needs optimization
export const maxAnnotationWeight = (annotations: AnnotationInternal[]) => {
  const max = maxBy(annotations, (a) => a.weight);

  return max?.weight ?? 0;
};

const wordPartClasses_ = (annotationWeight: number): string[] => {
  return ["token-segment", `token-segment--m${annotationWeight}`];
};
const wordPartClassesMem = memoize(wordPartClasses_);

export const wordPartClasses = (annotations: AnnotationInternal[]) => {
  return wordPartClassesMem(maxAnnotationWeight(annotations));
};
