import { AnnotationMetadata, sendEvent } from "../send-events";
import { AnnotationRect } from "../../model/svg.types";

export const clickAnnotation =
  (rect: AnnotationRect, eventMetadata: AnnotationMetadata) => (event) => {
    const { model } = eventMetadata();
    if (model.blockEvents) return;

    sendEvent(eventMetadata, "click", event);
  };

export const doubleClickAnnotation =
  (rect: AnnotationRect, eventMetadata: AnnotationMetadata) => (event) => {
    const { model } = eventMetadata();
    if (model.blockEvents) return;

    event.preventDefault();
    sendEvent(eventMetadata, "double-click", event);
  };
