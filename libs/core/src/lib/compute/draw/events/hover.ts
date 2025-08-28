import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";

export const hoverAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svgModel: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    const model = svgModel.model;
    if (model.blockEvents) return;
    const fullAnnotation = svgModel.sendEvent({
      event: "mouse-enter",
      mouseEvent,
      annotationUuid: annotation?.annotationUuid || "",
    });

    if (svgModel.annotationAdapter.hover(fullAnnotation)) {
      svgModel.colorAnnotation(
        annotation.annotationUuid,
        annotation.color.hover,
      );
    }
  };

export const leaveAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svgModel: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    if (svgModel.model.blockEvents) return;

    svgModel.sendEvent({
      event: "mouse-leave",
      mouseEvent,
      annotationUuid: annotation?.annotationUuid || "",
    });

    svgModel.resetAnnotationColor(annotation.annotationUuid);
  };
