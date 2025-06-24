import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";

export const clickAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svgModel: SvgModel) =>
  (mouseEvent) => {
    const model = svgModel.model;
    if (model.blockEvents) return;

    svgModel.sendEvent({
      event: "click",
      mouseEvent,
      annotationUuid: annotation?.uuid || "",
    });
  };

export const doubleClickAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svgModel: SvgModel) =>
  (mouseEvent) => {
    const model = svgModel.model;
    if (model.blockEvents) return;

    mouseEvent.preventDefault();

    svgModel.sendEvent({
      event: "double-click",
      mouseEvent,
      annotationUuid: annotation?.uuid || "",
    });
  };
