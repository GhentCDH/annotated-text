import { TextAnnotationModel } from "./annotation.model";
import { drawComputedAnnotations } from "./draw/annotations";
import { SvgModel } from "./model/svg.types";

export * from "./draw/text";

export const drawAnnotations = (
  textElement: HTMLElement,
  textAnnotationModel: TextAnnotationModel,
) => {
  // Create SVG element

  const svgModel = new SvgModel(textElement, textAnnotationModel);

  drawComputedAnnotations(svgModel);

  return svgModel;
};
