import { AnnotationMetadata, sendEvent } from "../send-events";
import { AnnotationRect, AnnotationSvg } from "../../model/svg.types";
import { colorAnnotation } from "../utils/annotation";

export const hoverAnnotation =
  (
    rect: AnnotationRect,
    eventMetadata: AnnotationMetadata,
    svg: AnnotationSvg,
  ) =>
  (event: MouseEvent) => {
    const { annotation, model } = eventMetadata();
    const fullAnnotation = sendEvent(eventMetadata, "mouse-enter", event);

    if (model.config.visualEvent.hover(fullAnnotation)) {
      colorAnnotation(svg, annotation.annotationUuid, annotation.color.hover);
    }
  };

export const leaveAnnotation =
  (
    rect: AnnotationRect,
    eventMetadata: AnnotationMetadata,
    svg: AnnotationSvg,
  ) =>
  (event) => {
    sendEvent(eventMetadata, "mouse-leave", event);
    const { annotation } = eventMetadata();
    colorAnnotation(svg, annotation.annotationUuid, annotation.color.default);
  };
