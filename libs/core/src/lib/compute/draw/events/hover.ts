import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { drawTag } from "../tag";

import { AnnotationDrawColors, TextAnnotation } from "../../../model";

export const hoverAnnotation =
  (rect: AnnotationRect, annotation: TextAnnotation, svgModel: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    const model = svgModel.model;
    if (model.blockEvents) return;
    const fullAnnotation = svgModel.sendEvent({
      event: "mouse-enter",
      mouseEvent,
      annotationUuid: annotation?.id || "",
    });

    if (svgModel.annotationAdapter.hover(fullAnnotation)) {
      const color = annotation._drawMetadata.color as AnnotationDrawColors;

      svgModel.colorAnnotation(annotation.id, color.hover);
    }
    if (svgModel.annotationAdapter.tagConfig.enabledOnHover)
      drawTag(svgModel, fullAnnotation);
  };

export const leaveAnnotation =
  (rect: AnnotationRect, annotation: TextAnnotation, svgModel: SvgModel) =>
  (mouseEvent: MouseEvent) => {
    if (svgModel.model.blockEvents) return;

    svgModel.sendEvent({
      event: "mouse-leave",
      mouseEvent,
      annotationUuid: annotation?.id || "",
    });

    svgModel.resetAnnotationColor(annotation.id);

    if (svgModel.annotationAdapter.tagConfig.enabledOnHover)
      svgModel.removeTag(annotation.id);
  };
