import { hoverAnnotation, leaveAnnotation } from "./events/hover";
import { clickAnnotation, doubleClickAnnotation } from "./events/click";
import { drawAnnotationHandles } from "./events/drag";
import { SvgModel } from "../model/svg.types";
import { AnnotationDraw } from "../annotation.model";
import { AnnotationConfig } from "../model/annotation.config";

export const drawAnnotationContent = (
  annotation: AnnotationDraw,
  svg: SvgModel,
  config: AnnotationConfig,
) => {
  let border = null;
  const annotationGroup = svg.annotations
    .append("g")
    .attr("data-annotation-uid", annotation.annotationUuid);

  const rect = annotationGroup
    .append("path")
    .attr("data-annotation-uid", annotation.annotationUuid)
    .attr("data-annotation-start", annotation.lineNumber)
    .attr("data-annotation-role", "fill")
    .attr("d", annotation.path.fill)
    .attr("border", "none")
    .attr("fill", annotation.color.default.fill);
  if (annotation.path.border) {
    border = annotationGroup
      .append("path")
      .attr("data-annotation-uid", annotation.annotationUuid)
      .attr("data-annotation-role", "border")
      .attr("stroke-width", config.text.border)
      .attr("d", annotation.path.border)
      .attr("fill", "none")
      .attr("stroke", annotation.color.default.border);
  }

  return { rect, border };
};

export const drawAnnotation = (
  svgModel: SvgModel,
  annotation: AnnotationDraw,
) => {
  // return a promise that resloves to a function that draws the annotation
  const eventMetadata = () => {
    return {
      annotation,
      model: svgModel.model,
      textElement: svgModel.textElement,
    };
  };

  const config = svgModel.model.config;
  const { rect } = drawAnnotationContent(annotation, svgModel, config);

  drawAnnotationHandles(annotation, svgModel);

  rect
    .on("mouseover", hoverAnnotation(rect, eventMetadata, svgModel))
    .on("mouseleave", leaveAnnotation(rect, eventMetadata, svgModel))
    // TODO check double click also fires click event
    .on("dblclick", doubleClickAnnotation(rect, eventMetadata))
    .on("click", clickAnnotation(rect, eventMetadata));
};
