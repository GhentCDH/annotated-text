import memoize from "memoizee";
import { AnnotationTarget } from "../../index";

export const isGutter = memoize(
  (target: AnnotationTarget) => target === "gutter",
);
