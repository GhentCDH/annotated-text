import "./style/style.scss";

export * from "./components";
export type {
  AnnotationStyle,
  AnnotationActionPayload,
  AnnotationActionState,
} from "./types/AnnotatedText";
export type { ActionType } from "./types/AnnotatedText";
export type { Paragraph } from "./types/AnnotatedText";
export type { AnnotatedTextProps } from "./types/props";

export type {
  UpdateAnnotationState,
  CreateAnnotationState,
  UserState,
} from "./state";
export { UserActionState } from "./state";

export * from "./utils/debugger";

export type { AnnotatedTextEmits } from "./types/emits";
