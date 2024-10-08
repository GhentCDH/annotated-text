export * from "./components";
export type {
  Line,
  Paragraph,
  RangeWithAnnotation,
  RangeWithAnnotations,
  AnnotatedLine,
  WordPart,
  AnnotationStyle,
  AnnotationActionPayload,
  AnnotationActionState,
  Word,
  AnnotatedWord,
} from "./types/AnnotatedText";
export type { Annotation, AnnotationTarget } from "./types/Annotation";

export type {
  RecursiveAnnotatedTokenPartTextProps,
  AnnotatedLineProps,
} from "./types/props";

export {
  UpdateAnnotationState,
  CreateAnnotationState,
  UserActionState,
  UserState,
} from "./state";

import "./style/style.scss";

export * from "./utils/debugger";
