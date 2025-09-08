import { hoverAnnotation, leaveAnnotation } from "./events/hover";
import { clickAnnotation, doubleClickAnnotation } from "./events/click";
import { drawAnnotationHandles } from "./events/drag";
import { addDraggableAnnotation } from "./annotations/drag-annotation";
import { SVG_ID, SVG_ROLE, SvgModel } from "../model/svg.types";
import { AnnotationDraw } from "../annotation.model";
import { AnnotationConfig } from "../../adapter/annotation";

export const drawAnnotationContent = (
  annotation: AnnotationDraw,
  svgModel: SvgModel,
  config: AnnotationConfig,
) => {
  let border = null;
  const annotationGroup = svgModel.annotations
    .append("g")
    .attr("data-annotation-uid", annotation.annotationUuid);

  let rect;
  if (annotation.path.fill) {
    rect = annotationGroup
      .append("path")
      .attr(SVG_ID.ANNOTATION_UID, annotation.annotationUuid)
      .attr("data-annotation-start", annotation.lineNumber)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.FILL)
      .attr("d", annotation.path.fill!)
      .attr("border", "none")
      .attr("fill", annotation.color.default.fill!)
      .call(addDraggableAnnotation(svgModel, annotation));
  }
  if (annotation.path.border) {
    border = annotationGroup
      .append("path")
      .attr(SVG_ID.ANNOTATION_UID, annotation.annotationUuid)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.BORDER)
      .attr("stroke-width", config.text.border)
      .attr("d", annotation.path.border)
      .attr("fill", "none")
      .attr("stroke", annotation.color.default.border!)
      .call(addDraggableAnnotation(svgModel, annotation));
  }

  return { rect, border };
};

export const drawAnnotation = (
  svgModel: SvgModel,
  annotation: AnnotationDraw,
) => {
  // return a promise that resloves to a function that draws the annotation

  const config = svgModel.annotationAdapter.config!;
  const { rect } = drawAnnotationContent(annotation, svgModel, config);

  drawAnnotationHandles(annotation, svgModel);

  rect
    ?.on("mouseover", hoverAnnotation(rect, annotation, svgModel))
    .on("mouseleave", leaveAnnotation(rect, annotation, svgModel))
    // TODO check double click also fires click event
    .on("dblclick", doubleClickAnnotation(rect, annotation, svgModel))
    .on("click", clickAnnotation(rect, annotation, svgModel));
};
