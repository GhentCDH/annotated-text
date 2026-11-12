import { pick } from 'lodash-es';

import { type AnnotationModule } from '../../../di/annotation.module';
import { type Dimensions, type TextAnnotation } from '../../../model';
import { type CharacterPositionResult } from '../../position';
import { type Position } from '../types';
import { AbstractAnnotationEventEdit } from './abstract-annotation-event.edit';

export class DragAnnotation extends AbstractAnnotationEventEdit {
  private dragBusy = false;
  private startDimensions: Dimensions;
  private endDimensions: Dimensions;
  private pickupIndex = 0;
  private textStart = 0;

  constructor(
    private readonly minStartPosition: number,
    annotation: TextAnnotation,
    annotationModule: AnnotationModule,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {
    super(annotationModule, { annotation });
  }

  protected override onStart(position: Position) {
    this.dragBusy = false;
    const draws = this.annotation?._drawMetadata?.draws ?? [];

    const start = draws.find((d) => d.draggable?.start)?.draggable?.start;
    const end = draws.find((d) => d.draggable?.end)?.draggable?.end;
    // Not draggable (e.g. gutter or outside the rendered lines): dragBusy stays
    // false, so onDrag ignores the moves and end() releases the block
    if (!start || !end) return;
    this.startDimensions = start;
    this.endDimensions = end;

    const result = this.getCharacterFromTextNodesAtPoint(position);
    if (!result) return;
    this.pickupIndex = result.characterPos;
    this.textStart = this.minStartPosition;

    // start() already blocked the events
    this.dragBusy = true;
    this.draw.annotation.setClass(this.annotation!.id, 'move');
  }

  protected override onDrag(position: Position, target: 'start' | 'end') {
    if (!this.dragBusy) return null;

    const result = this.getCharacterFromTextNodesAtPoint(position);
    if (!result) return null;

    const annotation = this.originalStartEnd;

    const delta = result.characterPos - this.pickupIndex;
    const startIndex = annotation.start + delta;

    if (startIndex < this.textStart) {
      return null;
    }

    const endIndex = this.originalStartEnd.end + delta;
    if (endIndex < startIndex) {
      return null;
    }

    const startEnd = { start: startIndex, end: endIndex };
    const prevPosition =
      this.dummyAnnotation && pick(this.dummyAnnotation, ['start', 'end']);

    return { startEnd, prevPosition };
  }
}
