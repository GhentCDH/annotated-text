import type RBush from 'rbush';
import { drawTextRaster, type TextRasterItem } from './text-raster';
import { drawText } from './text';
import { Debugger } from '../../../utils/debugger';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { SvgModel } from '../../model/svg.types';
import { getCharacterFromTextNodesAtPoint } from '../../position';
import { getScaledDimensions } from '../../position/unscaled';
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

  /**
   * Text position of the character closest to a client (viewport) point,
   * or null when there is no text.
   */
  findNearestCharacter(clientX: number, clientY: number): number | null {
    if (!this.textTree) return null;
    const { x, y } = getScaledDimensions(
      this.svgModel.getTextElementDimensions(),
      { x: clientX, y: clientY, width: 0, height: 0 },
    );

    // ponytail: linear scan over all characters, fine for one call per zoom step.
    // Use a growing rbush search box if this ever runs per frame.
    let nearest: number | null = null;
    let nearestDistance = Infinity;
    for (const item of this.textTree.all()) {
      const dx = Math.max(item.minX - x, 0, x - item.maxX);
      const dy = Math.max(item.minY - y, 0, y - item.maxY);
      const distance = dx * dx + dy * dy;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = item.textPosition;
      }
    }
    return nearest;
  }

  /** Client (viewport) y of the top of the character at a text position */
  getCharacterClientY(textPosition: number): number | null {
    const item = this.textTree
      ?.all()
      .find((i) => i.textPosition === textPosition);
    if (!item) return null;
    const dimensions = this.svgModel.getTextElementDimensions();
    return dimensions.original.y + item.minY * dimensions.scale;
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
