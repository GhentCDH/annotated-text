import { hoverAnnotation, leaveAnnotation } from "./events/hover";
import { clickAnnotation, doubleClickAnnotation } from "./events/click";
import { drawAnnotationHandles } from "./events/drag";
import { addDraggableAnnotation } from "./annotations/drag-annotation";
import { SVG_ID, SVG_ROLE, SvgModel } from "../model/svg.types";
import {
  AnnotationDraw,
  AnnotationDrawColor,
  AnnotationDrawColors,
  TextAnnotation,
} from "../../model";
import { AnnotationRenderStyle } from "../../adapter/annotation/renderer/annotation-render";

export const drawAnnotationContent = (
  draw: AnnotationDraw,
  svgModel: SvgModel,
  style: AnnotationRenderStyle,
  color: AnnotationDrawColor,
) => {
  let border = null;
  const annotationGroup = svgModel.annotations
    .append("g")
    .attr("data-annotation-uid", draw.annotationUuid);

  let rect;
  if (draw.path.fill) {
    rect = annotationGroup
      .append("path")
      .attr(SVG_ID.ANNOTATION_UID, draw.annotationUuid)
      .attr("data-annotation-start", draw.lineNumber)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.FILL)
      .attr("d", draw.path.fill!)
      .attr("border", "none")
      .attr("fill", color.fill!);
  }
  if (draw.path.border) {
    border = annotationGroup
      .append("path")
      .attr(SVG_ID.ANNOTATION_UID, draw.annotationUuid)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.BORDER)
      .attr("stroke-width", color.borderWidth)
      .attr("d", draw.path.border)
      .attr("fill", "none")
      .attr("stroke", color.border!);
  }

  return { rect, border };
};

export const drawAnnotation = (
  svgModel: SvgModel,
  annotation: TextAnnotation,
) => {
  const color = annotation._drawMetadata.color as AnnotationDrawColors;
  const style = annotation._render.style.renderStyle as AnnotationRenderStyle;

  annotation._drawMetadata.draws.forEach((draw) => {
    const { rect, border } = drawAnnotationContent(
      draw,
      svgModel,
      style,
      color.default,
    );

    drawAnnotationHandles(annotation, draw, svgModel);

    rect
      ?.on("mouseover", hoverAnnotation(annotation, svgModel))
      .on("mouseleave", leaveAnnotation(annotation, svgModel))
      // TODO check double click also fires click event
      .on("dblclick", doubleClickAnnotation(rect, annotation, svgModel))
      .on("click", clickAnnotation(rect, annotation, svgModel))
      .call(addDraggableAnnotation(svgModel, annotation));

    border?.call(addDraggableAnnotation(svgModel, annotation));
  });
};
