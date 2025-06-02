import { AnnotationMetadata, sendEvent } from "../send-events";
import { AnnotationRect } from "../../model/svg.types";

export const clickAnnotation =
  (rect: AnnotationRect, eventMetadata: AnnotationMetadata) => (event) => {
    sendEvent(eventMetadata, "click", event);
  };

export const doubleClickAnnotation =
  (rect: AnnotationRect, eventMetadata: AnnotationMetadata) => (event) => {
    event.preventDefault();
    sendEvent(eventMetadata, "double-click", event);
  };
