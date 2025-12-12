import { pick } from 'lodash-es';
import { handleAnnotationEditAndSendEvent } from './edit.annotations';
import { type InternalEventListener } from '../../../events/internal/internal.event.listener';
import { type Position } from '../types';
import { type CharacterPositionResult } from '../../position';
import { DUMMY_UID } from '../../model/svg.types';
import { type AnnotationAdapter } from '../../../adapter';
import { type Dimensions, type TextAnnotation } from '../../../model';

export class DragAnnotation {
  private dragBusy = false;
  private dummyAnnotation: TextAnnotation;

  private startDimensions: Dimensions;
  private endDimensions: Dimensions;
  private pickupIndex = 0;
  private textStart = 0;

  constructor(
    private readonly minStartPosition: number,
    private readonly annotation: TextAnnotation,
    private readonly internalEventListener: InternalEventListener,
    private readonly annotationAdapter: AnnotationAdapter<any>,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {}

  startDrag(position: Position, event: any) {
    if (!this.annotationAdapter.edit) return;
    if (this.internalEventListener.isBlocking) return;

    const draws = this.annotation._drawMetadata.draws;

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

    this.internalEventListener.sendEvent('send-event--annotation', {
      event: 'annotation-edit--start',
      annotationUuid: this.annotation?.id.toString() || '',
    });

    this.internalEventListener.sendEvent('annotation--set-class', {
      annotationUuid: this.annotation.id,
      cssClass: 'move',
    });
    this.internalEventListener.sendEvent('annotation--remove-tag', {
      annotationUuid: this.annotation.id,
    });
  }

  moveDrag(position: Position, event: any) {
    if (!this.startDimensions || !this.endDimensions) return;
    if (!this.dragBusy) return;

    const result = this.getCharacterFromTextNodesAtPoint(position);
    if (!result) return;

    const delta = result.characterPos - this.pickupIndex;
    const startIndex = this.annotation.start + delta;

    if (startIndex < this.textStart) {
      return;
    }

    const endIndex = this.annotation.end + delta;
    if (endIndex < startIndex) {
      return;
    }

    this.dummyAnnotation =
      handleAnnotationEditAndSendEvent(
        this.annotation,
        this.annotationAdapter,
        this.internalEventListener,
        'annotation-edit--move',
        {
          start: startIndex,
          end: endIndex,
        },
        'drag',
        this.dummyAnnotation && pick(this.dummyAnnotation, ['start', 'end']),
      ) ?? this.dummyAnnotation;

    this.internalEventListener.sendEvent('annotation--set-class', {
      annotationUuid: DUMMY_UID,
      cssClass: 'move',
    });
  }

  endDrag(event: any) {
    this.internalEventListener.sendEvent('annotation--set-class', {
      annotationUuid: this.annotation.id,
      cssClass: '',
    });
    if (!this.dragBusy) return;
    this.dragBusy = false;

    this.internalEventListener.unBlockEvents('ending annotation drag');

    if (!this.dummyAnnotation) return;
    this.internalEventListener.sendEvent('send-event--annotation', {
      event: 'annotation-edit--end',
      annotationUuid: this.annotation.id,
      mouseEvent: event,
      additionalData: {
        annotation: {
          ...this.annotation,
          start: this.dummyAnnotation.start,
          end: this.dummyAnnotation.end,
        },
      },
    });

    this.dummyAnnotation._render.weight = this.annotation._render.weight;
    this.dummyAnnotation.id = this.annotation.id;

    this.internalEventListener.sendEvent('annotation--update', {
      annotation: this.dummyAnnotation,
    });
  }
}
