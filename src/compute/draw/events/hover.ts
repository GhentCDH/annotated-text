import { sendEvent } from "../send-events";
import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";

export const hoverAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svg: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    const model = svg.model;
    if (model.blockEvents) return;
    const fullAnnotation = sendEvent(
      { model, annotation },
      {
        event: "mouse-enter",
        mouseEvent,
      },
    );

    if (model.config.visualEvent.hover(fullAnnotation)) {
      svg.colorAnnotation(annotation.annotationUuid, annotation.color.hover);
    }
  };

export const leaveAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svg: SvgModel) =>
  (mouseEvent) => {
    const model = svg.model;

    if (model.blockEvents) return;

    sendEvent({ model, annotation }, { event: "mouse-leave", mouseEvent });
    svg.colorAnnotation(annotation.annotationUuid, annotation.color.default);
  };
