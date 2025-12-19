import { cloneDeep, pick } from 'lodash-es';
import { type InternalEventListener } from '../../../events/internal/internal.event.listener';
import { type Position } from '../types';
import {
  type CharacterPositionResult,
  getCharacterStartEndPosition,
} from '../../position';
import { DUMMY_UID } from '../../model/svg.types';
import { type AnnotationAdapter } from '../../../adapter';
import {
  type AnnotationDrawColors,
  type AnnotationId,
  type TextAnnotation,
  textAnnotationSchema,
} from '../../../model';

export class EditAnnotation {
  private dragResult: TextAnnotation | null = null;

  constructor(
    private readonly annotation: TextAnnotation,
    private readonly internalEventListener: InternalEventListener,
    private readonly annotationAdapter: AnnotationAdapter<any>,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {}

  start(position: Position, target: 'start' | 'end', event: any) {
    if (!this.annotationAdapter.edit) return;
    if (this.internalEventListener.isBlocking) return;

    this.internalEventListener.blockEvents('annotation-edit--start');
    this.dragResult =
      editAnnotations(
        this.annotation,
        this.annotationAdapter,
        this.internalEventListener,
        this.getCharacterFromTextNodesAtPoint,
        position,
        target,
        (this.dragResult && pick(this.dragResult, ['start', 'end'])) ??
          undefined,
      ) ?? this.dragResult;

    this.sendInternalEvent('annotation-edit--start', DUMMY_UID);
  }

  onEnd() {
    if (!this.dragResult) return;
    this.internalEventListener.unBlockEvents('ending annotation edit');
    this.internalEventListener.sendEvent('annotation--remove', {
      annotationUuid: DUMMY_UID,
    });

    this.sendInternalEvent('annotation-edit--end');

    if (!this.dragResult) return;

    this.dragResult._render.weight = this.annotation._render.weight;
    this.dragResult.id = this.annotation.id;

    this.internalEventListener.sendEvent('annotation--update', {
      annotation: this.dragResult,
    });
  }

  onDrag(position: Position, target: 'start' | 'end') {
    if (!this.annotationAdapter.edit) return;

    this.dragResult =
      editAnnotations(
        this.annotation,
        this.annotationAdapter,
        this.internalEventListener,
        this.getCharacterFromTextNodesAtPoint,
        position,
        target,
        (this.dragResult && pick(this.dragResult, ['start', 'end'])) ??
          undefined,
      ) ?? this.dragResult;

    this.sendInternalEvent('annotation-edit--move', DUMMY_UID);
  }

  private sendInternalEvent(
    event:
      | 'annotation-edit--move'
      | 'annotation-edit--start'
      | 'annotation-edit--end',
    moveId?: AnnotationId,
  ) {
    this.internalEventListener.sendEvent('send-event--annotation', {
      event,
      annotationUuid: this.annotation.id.toString() || '',
      additionalData: {
        annotation: this.dragResult,
        annotationUuid: this.dragResult?.id,
        moveId,
      },
    });
  }
}

export const editAnnotations = (
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  internalEventListener: InternalEventListener,
  getCharacterFromTextNodesAtPoint: (
    position: Position,
  ) => CharacterPositionResult | null,
  position: Position,
  target: 'start' | 'end',
  prevPosition?: { start: number; end: number },
) => {
  internalEventListener.sendEvent('annotation--remove-tag', {
    annotationUuid: annotation.id,
  });

  const result = getCharacterFromTextNodesAtPoint(position);

  if (!result) return null;

  const { start, end } = getCharacterStartEndPosition(
    result,
    annotation,
    target,
  );

  const dummyAnnotation = handleAnnotationEditAndSendEvent(
    annotation,
    annotationAdapter,
    internalEventListener,
    {
      start,
      end,
    },
    prevPosition,
  );

  return dummyAnnotation;
};

export const handleAnnotationEditAndSendEvent = (
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  internalEventListener: InternalEventListener,
  { start, end }: { start: number; end: number },
  prevPosition?: { start: number; end: number },
) => {
  // create dummy annotation
  const dummyAnnotation = textAnnotationSchema.parse({
    ...cloneDeep(annotation),
    start,
    end,
    id: DUMMY_UID,
  });

  dummyAnnotation._render.weight = annotation._render.weight! + 1;

  let snapper = annotationAdapter.snapper.fixOffset(dummyAnnotation);

  if (snapper.end < snapper.start) {
    // Try snapping the other side if the end is before the start
    dummyAnnotation.start = snapper.start;
    snapper = annotationAdapter.snapper.fixOffset(dummyAnnotation);
  }

  if (snapper.end <= snapper.start) {
    // Still invalid, abort
    return;
  }

  if (
    prevPosition &&
    snapper.start === prevPosition.start &&
    snapper.end === prevPosition.end
  ) {
    // No change, nothing to do
    return;
  }

  const color = annotation._drawMetadata.color as AnnotationDrawColors;

  dummyAnnotation.start = snapper.start;
  dummyAnnotation.end = snapper.end;

  internalEventListener.sendEvent('annotation--draw-dummy', {
    dummyAnnotation: dummyAnnotation,
    color: color.edit,
  });

  return dummyAnnotation;
};
