import { AnnotationDraw, TextAnnotationModel } from "../annotation.model";
import { AnnotationConfig } from "../model/annotation.config";

export const drawAnnotation = (
  annotation: AnnotationDraw,
  config: AnnotationConfig,
  svg: any,
) => {
  const rect = svg
    .append("rect")
    .attr("x", annotation.dimensions.x)
    .attr("y", annotation.dimensions.y)
    .attr("width", annotation.dimensions.width)
    .attr("height", annotation.dimensions.height)
    .attr("fill", annotation.color.fill)
    .attr("stroke", annotation.color.border)
    .attr("stroke-width", config.text.border)
    .attr("rx", config.text.borderRadius) // rounded corners
    .attr("ry", config.text.borderRadius);

  return rect;
};

export const drawComputedAnnotations = (
  model: TextAnnotationModel,
  svg: SVGElement,
) => {
  model.drawAnnotations
    .sort((a1, a2) => (a1.weight > a2.weight ? -1 : 1))
    .forEach((annotation) => {
      drawAnnotation(annotation, model.config, svg);
    });
};
