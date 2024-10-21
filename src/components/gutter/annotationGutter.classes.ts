import memoize from "memoizee";
import { pick } from "lodash-es";
import type { AnnotationStyle } from "../../types/AnnotatedText";
import type { AnnotationInternal } from "../../types/Annotation";

const AnnotationFields = [
  "weight",
  "class",
  "color",
  "startsOnLine",
  "endsOnLine",
] as const;
type AnnotationField = (typeof AnnotationFields)[number];
type PartialAnnotation = Pick<AnnotationInternal, AnnotationField>;

const StyleFields = [
  "defaultClass",
  "weightClass",
  "endClass",
  "startClass",
] as const;
type StyleField = (typeof StyleFields)[number];
type PartialStyle = Pick<AnnotationStyle, StyleField>;

const annotationGutterClasses_ = (
  annotation: PartialAnnotation,
  style: PartialStyle
): string[] => {
  return [
    style.defaultClass,
    style.weightClass + (annotation?.weight ?? 0),
    annotation?.class ?? null,
    annotation.startsOnLine ? style.startClass : null,
    annotation.endsOnLine ? style.endClass : null,
    annotation?.color ? "annotation--color-custom" : null,
  ].filter((item) => !!item);
};

const annotationGutterClassesMem = memoize(annotationGutterClasses_, {
  normalizer: (args) => {
    // args is arguments object as accessible in memoized function
    return JSON.stringify(args);
  },
});

export const annotationGutterClasses = (
  annotation: AnnotationInternal,
  style: AnnotationStyle
) => {
  return annotationGutterClassesMem(
    pick(annotation, AnnotationFields),
    pick(style, StyleFields)
  );
};
