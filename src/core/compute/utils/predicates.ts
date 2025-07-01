import memoize from "memoizee";
import type { AnnotationTarget } from "../../model";

export const isGutter = memoize(
  (target: AnnotationTarget) => target === "gutter",
);
