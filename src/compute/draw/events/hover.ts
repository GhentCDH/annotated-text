import { AnnotationMetadata, sendEvent } from "../send-events";
import { AnnotationRect, SvgModel } from "../../model/svg.types";

export const hoverAnnotation =
  (rect: AnnotationRect, eventMetadata: AnnotationMetadata, svg: SvgModel) =>
  (event: MouseEvent) => {
    const { annotation, model } = eventMetadata();
    if (model.blockEvents) return;
    const fullAnnotation = sendEvent(eventMetadata, "mouse-enter", event);

    if (model.config.visualEvent.hover(fullAnnotation)) {
      svg.colorAnnotation(annotation.annotationUuid, annotation.color.hover);
    }
  };

export const leaveAnnotation =
  (rect: AnnotationRect, eventMetadata: AnnotationMetadata, svg: SvgModel) =>
  (event) => {
    const { model } = eventMetadata();
    if (model.blockEvents) return;

    sendEvent(eventMetadata, "mouse-leave", event);
    const { annotation } = eventMetadata();
    svg.colorAnnotation(annotation.annotationUuid, annotation.color.default);
  };
