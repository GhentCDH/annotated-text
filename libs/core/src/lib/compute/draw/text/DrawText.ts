import type RBush from 'rbush';
import { drawTextRaster, type TextRasterItem } from './text-raster';
import { drawText } from './text';
import { Debugger } from '../../../utils/debugger';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { SvgModel } from '../../model/svg.types';
import { getCharacterFromTextNodesAtPoint } from '../../position';
import { findTextLine } from '../../utils/line.utils';

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
      this.svgModel.getTextElementDimensions(),
      this.textTree,
    );
  }

  draw() {
    drawText(
      this.svgModel.textElement,
      this.textAdapter,
      this.annotationAdapter,
    );

    return this;
  }

  compute() {
    const textElement = this.svgModel.textElement;

    this.textAdapter.lines.forEach((line) => {
      const textLine = findTextLine(textElement, line);
      if (!textLine) {
        Debugger.debug(
          'computeLinePositions',
          `Text line with UUID ${line.uuid} not found in the text element.`,
        );
        return;
      }
      line.element = textLine;
    });

    return this;
  }
}
