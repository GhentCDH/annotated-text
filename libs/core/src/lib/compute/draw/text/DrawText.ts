import type RBush from 'rbush';
import { drawTextRaster, type TextRasterItem } from './text-raster';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { SvgModel } from '../../model/svg.types';
import { getCharacterFromTextNodesAtPoint } from '../../position';

export class DrawText extends BaseAnnotationDi {
  private readonly svgModel = this.inject(SvgModel);
  private textTree: RBush<TextRasterItem>;

  createTree() {
    this.textTree = drawTextRaster(this.svgModel.textElement, this.textAdapter);
  }

  getCharacterFromTextNodesAtPoint(x: number, y: number) {
    return getCharacterFromTextNodesAtPoint(
      x,
      y,
      this.svgModel.textElement,
      this.textTree,
    );
  }
}
