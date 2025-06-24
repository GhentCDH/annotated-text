import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";

export const hoverAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svg: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    const model = svg.model;
    if (model.blockEvents) return;
    const fullAnnotation = svg.sendEvent({
      event: "mouse-enter",
      mouseEvent,
      annotationUuid: annotation?.uuid || "",
    });
    if (model.config.visualEvent.hover(fullAnnotation)) {
      svg.colorAnnotation(annotation.annotationUuid, annotation.color.hover);
    }
  };

export const leaveAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svg: SvgModel) =>
  (mouseEvent) => {
    const model = svg.model;

    if (model.blockEvents) return;

    svg.sendEvent({
      event: "mouse-leave",
      mouseEvent,
      annotationUuid: annotation?.uuid || "",
    });
    svg.colorAnnotation(annotation.annotationUuid, annotation.color.default);
  };
