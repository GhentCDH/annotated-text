import type { ActionType } from "../AnnotatedText";
import type { Annotation } from "../../model";

export interface MouseEventPayload {
  startOffset: number;
  annotation?: Annotation;
  action?: ActionType;
}

export type MouseEventFn = (e: MouseEvent, payload?: MouseEventPayload) => void;

export type MouseEventEmitPayload = [
  mouseEvent: MouseEvent,
  payload: MouseEventPayload,
];
