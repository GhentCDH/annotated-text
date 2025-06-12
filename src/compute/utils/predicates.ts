import memoize from "memoizee";
import { AnnotationTarget } from "../../types/Annotation";

export const isGutter = memoize(
  (target: AnnotationTarget) => target === "gutter",
);
