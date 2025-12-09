import { type TextAnnotation } from '../../../model';
import { type AnnotationAdapter } from '../../../adapter';
import { type Position } from '../types';
import {
  type CharacterPositionResult,
  getCharacterStartEndPosition,
} from '../../position';
import { type InternalEventListener } from '../../../events/internal/internal.event.listener';

export class CreateAnnotation {
  private startIndex: number;
  private drawing = false;
  private drawingAndMove = false;
  private dummyAnnotation: null | TextAnnotation = null;
  private prevEndIndex: number | null = null;

  constructor(
    private readonly internalEventListener: InternalEventListener,
    private readonly annotationAdapter: AnnotationAdapter<any>,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {}

  startCreate(position: Position, event: any) {
    if (!this.annotationAdapter.create) return;
    if (this.internalEventListener.isBlocking || this.drawing) return;

    this.dummyAnnotation = null;
    this.drawing = true;
    this.createDummyAnnotation(position, event);

    if (!this.dummyAnnotation) {
      console.warn('no character found');
      return;
    }

    this.internalEventListener.sendEvent('send-event--annotation', {
      event: 'annotation-create--start',
      mouseEvent: event,
      annotationUuid: (this.dummyAnnotation as TextAnnotation).id || '',
      additionalData: { annotation: this.dummyAnnotation },
    });
  }

  moveCreate(position: Position, event: any) {
    if (!this.drawing) return;

    this.internalEventListener.blockEvents('starting annotation creation');

    this.drawingAndMove = true;
    this.createDummyAnnotation(position, event, true);
    const dummyAnnotation = this.dummyAnnotation!;

    this.internalEventListener.sendEvent(
      'send-event--annotation',

      {
        event: 'annotation-create--move',
        mouseEvent: event,
        annotationUuid: dummyAnnotation?.id || '',
        additionalData: { annotation: dummyAnnotation },
      },
    );
  }

  endCreate(position: Position, event: any) {
    this.prevEndIndex = null;
    this.drawing = false;

    if (!this.drawingAndMove) return false;

    this.drawingAndMove = false;

    this.internalEventListener.unBlockEvents('ending annotation creation');

    const dummyAnnotation = this.dummyAnnotation!;
    this.dummyAnnotation = null;

    this.internalEventListener.sendEvent('send-event--annotation', {
      event: 'annotation-create--end',
      mouseEvent: event,
      annotationUuid: dummyAnnotation?.id || '',
      additionalData: { annotation: dummyAnnotation },
    });

    this.internalEventListener.sendEvent('annotation--add', {
      annotation: dummyAnnotation,
    });

    return true;
  }

  private createInitialDummyAnnotation(characterPos: number) {
    this.dummyAnnotation =
      this.annotationAdapter.createAnnotation(characterPos);

    this.startIndex = characterPos;
    this.prevEndIndex = characterPos + 1;

    return this.dummyAnnotation;
  }

  private createDummyAnnotation(position: Position, event: any, draw = false) {
    const character = this.getCharacterFromTextNodesAtPoint(position);

    if (!character) return;
    if (!this.dummyAnnotation) {
      this.dummyAnnotation = this.createInitialDummyAnnotation(
        character.characterPos,
      );
    }

    const dummyAnnotation = this.dummyAnnotation!;

    const { start, end } = getCharacterStartEndPosition(
      character,
      { start: this.startIndex, end: this.prevEndIndex! },
      'end',
    );

    if (start === end) return;

    dummyAnnotation.start = start;
    dummyAnnotation.end = end;

    const snapper = this.annotationAdapter.snapper.fixOffset(dummyAnnotation);
    dummyAnnotation.start = snapper.start;
    dummyAnnotation.end = snapper.end;

    if (draw) {
      const color = dummyAnnotation._render.style.color;

      this.internalEventListener.sendEvent('annotation--draw-dummy', {
        dummyAnnotation: dummyAnnotation,
        color: {
          border: color!.border,
          fill: color!.background,
          borderWidth: 2,
        },
      });
    }
    this.prevEndIndex = character.characterPos;

    this.dummyAnnotation = dummyAnnotation;
    return position;
  }
}
