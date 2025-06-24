import memoize from "memoizee";
import { pick } from "lodash-es";
import type { AnnotationStyle } from "../../../types/AnnotatedText";
import type { AnnotationInternal } from "../../../types/Annotation";

const AnnotationFields = ["weight", "color", "class"] as const;
type AnnotationField = (typeof AnnotationFields)[number];
type PartialAnnotation = Pick<AnnotationInternal, AnnotationField>;

type PartialStyle = AnnotationStyle;

const annotationClasses_ = (
  annotation: PartialAnnotation,
  style: PartialStyle,
  isStart: boolean,
  isEnd: boolean,
  isTransitionState: boolean,
  isEditState: boolean,
  isHoverState: boolean,
  isSelectState: boolean,
  allowCreate: boolean,
): string[] => {
  const classes = [
    style.defaultClass,
    style.weightClass + (annotation?.weight ?? 0),
    annotation?.class ?? null,
    isStart ? style.startClass : null,
    isEnd ? style.endClass : null,
    isTransitionState ? style.transitioningClass : null,
    isEditState ? style.shadowClass : null,
    isHoverState ? style.hoveredClass : null,
    isSelectState ? style.activeClass : null,
    allowCreate ? "create-anno-text" : null,
    annotation?.color ? "annotation--color-custom" : null,
  ];

  return classes.filter((item) => item);
};

/**
 * @deprecated
 */
export const annotationClassesMemoizee = memoize(annotationClasses_, {
  normalizer: (args) => {
    // args is arguments object as accessible in memoized function
    return JSON.stringify(args);
  },
});

/**
 * @deprecated
 */
export const annotationClasses = (
  annotation: AnnotationInternal,
  editAnnotation: AnnotationInternal | undefined,
  style: AnnotationStyle,
  start: number,
  end: number,
  allowCreate: boolean,
  selectedAnnotations: string[],
  hoveredAnnotations: string[],
) => {
  const isEditState = editAnnotation && annotation === editAnnotation;

  const isTransitionState =
    editAnnotation &&
    annotation.id === editAnnotation.id &&
    annotation !== editAnnotation;

  const isHoverState = hoveredAnnotations.includes(annotation.id);
  const isSelectState = selectedAnnotations.includes(annotation.id);

  return annotationClassesMemoizee(
    pick(annotation, AnnotationFields),
    style,
    annotation?.start === start,
    annotation?.end === end,
    isTransitionState,
    isEditState,
    isHoverState,
    isSelectState,
    allowCreate,
  );
};
