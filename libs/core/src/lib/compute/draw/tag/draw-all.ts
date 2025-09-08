import { SvgModel } from "../../model/svg.types";
import { drawTag } from "./draw";

export const drawAllTags = (svgModel: SvgModel) => {
  if (!svgModel.annotationAdapter.tagConfig.enabled) return;
  if (svgModel.annotationAdapter.tagConfig.enabledOnHover) return;

  // Draw all tags
  svgModel.model.annotations.forEach((a) => drawTag(svgModel, a));
};
