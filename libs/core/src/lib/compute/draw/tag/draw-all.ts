import { drawTag } from './draw';
import { type SvgModel } from '../../model/svg.types';

export const drawAllTags = (svgModel: SvgModel) => {
  if (!svgModel.annotationAdapter.tagConfig.enabled) return;
  if (svgModel.annotationAdapter.tagConfig.enabledOnHover) return;

  // Draw all tags
  svgModel.annotationAdapter.annotations().forEach((a) => drawTag(svgModel, a));
};
