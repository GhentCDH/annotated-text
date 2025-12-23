import { pick } from 'lodash-es';
import { type InternalEventListener } from '../../../events/internal/internal.event.listener';
import { type Position } from '../types';
import { type CharacterPositionResult } from '../../position';
import { type AnnotationAdapter } from '../../../adapter';
import { type Dimensions, type TextAnnotation } from '../../../model';
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
    internalEventListener: InternalEventListener,
    annotationAdapter: AnnotationAdapter<any>,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {
    super(annotationAdapter, internalEventListener, { annotation });
  }

  protected override onStart(position: Position) {
    const draws = this.annotation!._drawMetadata.draws;

    this.startDimensions = draws.find((d) => d.draggable.start)!.draggable
      ?.start as Dimensions;
    this.endDimensions = draws.find((d) => d.draggable.end)!.draggable
      ?.end as Dimensions;

    // if (!startDimensions || !endDimensions) return;

    const result = this.getCharacterFromTextNodesAtPoint(position);
    if (!result) return;
    this.pickupIndex = result.characterPos;
    this.textStart = this.minStartPosition;

    this.internalEventListener.blockEvents('starting annotation drag');
    this.dragBusy = true;

    this.internalEventListener.sendEvent('annotation--set-class', {
      annotationUuid: this.annotation!.id,
      cssClass: 'move',
    });
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
