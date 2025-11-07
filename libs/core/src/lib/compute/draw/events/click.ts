import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { TextAnnotation } from "../../../model";

export const clickAnnotation =
  (rect: AnnotationRect, annotation: TextAnnotation, svgModel: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    if (svgModel.model.blockEvents) return;
    svgModel.sendEvent({
      event: "click",
      mouseEvent,
      annotationUuid: annotation?.id || "",
    });
  };

export const doubleClickAnnotation =
  (rect: AnnotationRect, annotation: TextAnnotation, svgModel: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    if (svgModel.model.blockEvents) return;

    mouseEvent.preventDefault();

    svgModel.sendEvent({
      event: "double-click",
      mouseEvent,
      annotationUuid: annotation?.id || "",
    });
  };
