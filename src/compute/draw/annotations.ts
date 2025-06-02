import { hoverAnnotation, leaveAnnotation } from "./events/hover";
import { clickAnnotation, doubleClickAnnotation } from "./events/click";
import { colorAnnotation } from "./utils/annotation";
import { AnnotationSvg } from "../model/svg.types";
import { AnnotationDraw, TextAnnotationModel } from "../annotation.model";

export const drawAnnotation = (
  annotation: AnnotationDraw,
  model: TextAnnotationModel,
  svg: AnnotationSvg,
) => {
  const config = model.config;
  const rect = svg
    .append("rect")
    .attr("data-annotation-uid", annotation.annotationUuid)
    .attr("x", annotation.dimensions.x)
    .attr("y", annotation.dimensions.y)
    .attr("width", annotation.dimensions.width)
    .attr("height", annotation.dimensions.height)
    .attr("stroke-width", config.text.border)
    .attr("rx", config.text.borderRadius) // rounded corners
    .attr("ry", config.text.borderRadius);

  colorAnnotation(svg, annotation.annotationUuid, annotation.color.default);

  const eventMetadata = () => {
    return {
      annotation,
      model,
    };
  };

  rect
    .on("mouseover", hoverAnnotation(rect, eventMetadata, svg))
    .on("mouseleave", leaveAnnotation(rect, eventMetadata, svg))
    // TODO check double click also fires click event
    .on("dblclick", doubleClickAnnotation(rect, eventMetadata))
    .on("click", clickAnnotation(rect, eventMetadata));

  return rect;
};

export const drawComputedAnnotations = (
  model: TextAnnotationModel,
  svg: SVGElement,
) => {
  model.drawAnnotations
    .sort((a1, a2) => (a1.weight > a2.weight ? -1 : 1))
    .forEach((annotation) => {
      drawAnnotation(annotation, model, svg);
    });
};
