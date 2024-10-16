import memoize from "memoizee";
import { pick } from "lodash-es";
import type {
  AnnotatedLine,
  AnnotationStyle,
} from "../../../types/AnnotatedText";
import type { Annotation } from "../../../types/Annotation";

const AnnotationFields = ["weight", "class"] as const;
type AnnotationField = (typeof AnnotationFields)[number];
type PartialAnnotation = Pick<Annotation, AnnotationField>;

const StyleFields = [
  "defaultClass",
  "weightClass",
  "endClass",
  "startClass",
] as const;
type StyleField = (typeof StyleFields)[number];
type PartialStyle = Pick<AnnotationStyle, StyleField>;

const startsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.start && line.end >= annotation.start;
};

const endsOnLine = function (
  line: AnnotatedLine,
  annotation: Annotation
): Boolean {
  return line.start <= annotation.end && line.end >= annotation.end;
};

const annotationGutterClasses_ = (
  annotation: PartialAnnotation,
  style: PartialStyle,
  startsOnLine: boolean,
  endsOnLine: boolean
): string[] => {
  return [
    style.defaultClass,
    style.weightClass + (annotation?.weight ?? 0),
    annotation?.class ?? null,
    startsOnLine ? style.startClass : null,
    endsOnLine ? style.endClass : null,
  ].filter((item) => !!item);
};

const annotationGutterClassesMem = memoize(annotationGutterClasses_, {
  normalizer: (args) => {
    // args is arguments object as accessible in memoized function
    return JSON.stringify(args);
  },
});

export const annotationGutterClasses = (
  annotation: Annotation,
  style: AnnotationStyle,
  line: AnnotatedLine
) => {
  return annotationGutterClassesMem(
    pick(annotation, AnnotationFields),
    pick(style, StyleFields),
    startsOnLine(line, annotation),
    endsOnLine(line, annotation)
  );
};
