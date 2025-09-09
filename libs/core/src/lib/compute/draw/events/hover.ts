import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";
import { drawTag } from "../tag";

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
      const color = svgModel.model.getAnnotationColor(
        annotation.annotationUuid,
      );
      svgModel.colorAnnotation(annotation.annotationUuid, color.hover);
    }
    if (svgModel.annotationAdapter.tagConfig.enabledOnHover)
      drawTag(svgModel, fullAnnotation);
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

    if (svgModel.annotationAdapter.tagConfig.enabledOnHover)
      svgModel.removeTag(annotation.annotationUuid);
  };
