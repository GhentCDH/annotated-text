import "./style/style.scss";

export * from "./components";
export type {
  AnnotationStyle,
  AnnotationActionPayload,
  AnnotationActionState,
} from "./types/AnnotatedText";
export type { Annotation, AnnotationTarget } from "./types/Annotation";
export type { ActionType } from "./types/AnnotatedText";
export type { Paragraph } from "./types/AnnotatedText";
export type { Line } from "./types/AnnotatedText";
export type { AnnotatedTextProps } from "./types/props";

export { UserActionState } from "./state";

export * from "./utils/debugger";

export type { AnnotationColor } from "./types/AnnotationColor";
export * from "./utils/createAnnotationColor";
export type { AnnotatedTextEmits } from "./types/emits";
