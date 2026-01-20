import { drawTag } from './draw';
import { type SvgModel } from '../../model/svg.types';
import type { BaseAnnotation } from '../../../model';

export const drawAllTags = (svgModel: SvgModel<BaseAnnotation>) => {
  if (!svgModel.annotationAdapter.tagConfig.enabled) return;
  if (svgModel.annotationAdapter.tagConfig.enabledOnHover) return;

  // Draw all tags
  svgModel.annotationAdapter.annotations().forEach((a) => drawTag(svgModel, a));
};
