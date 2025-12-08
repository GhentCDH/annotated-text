import {
  AnnotationAdapter,
  AnnotationDrawColors,
  AnnotationEventType,
  SnapperAction,
  TextAnnotation,
  textAnnotationSchema,
} from "@ghentcdh/annotated-text";
import { cloneDeep, pick } from "lodash-es";
import { InternalEventListener } from "../../../events/internal/internal.event.listener";
import { Position } from "../types";
import {
  CharacterPositionResult,
  getCharacterStartEndPosition,
} from "../../position";
import { DUMMY_UID } from "../../model/svg.types";

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

  start(position: Position, target: "start" | "end", event: any) {
    if (!this.annotationAdapter.edit) return;
    if (this.internalEventListener.isBlocking) return;

    return this.onDrag("annotation-edit--start", position, target, event);
  }

  onEnd(event: any) {
    if (!this.dragResult) return;
    this.internalEventListener.unBlockEvents("ending annotation edit");
    this.internalEventListener.sendEvent("annotation--remove", {
      annotationUuid: DUMMY_UID,
    });

    this.internalEventListener.sendEvent("send-event--annotation", {
      event: "annotation-edit--end",
      mouseEvent: event,
      annotationUuid: this.annotation?.id || "",
      additionalData: { annotation: this.dragResult },
    });

    if (!this.dragResult) return;

    this.dragResult._render.weight = this.annotation._render.weight;
    this.dragResult.id = this.annotation.id;

    this.internalEventListener.sendEvent("annotation--update", {
      annotation: this.dragResult,
    });
  }

  onDrag(
    eventType: AnnotationEventType,
    position: Position,
    target: "start" | "end",
    event: any,
  ) {
    if (!this.annotationAdapter.edit) return;

    this.dragResult =
      editAnnotations(
        this.annotation,
        this.annotationAdapter,
        this.internalEventListener,
        this.getCharacterFromTextNodesAtPoint,
        eventType,
        position,
        target,
        (this.dragResult && pick(this.dragResult, ["start", "end"])) ??
          undefined,
      ) ?? this.dragResult;
  }
}

export const editAnnotations = (
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  internalEventListener: InternalEventListener,
  getCharacterFromTextNodesAtPoint: (
    position: Position,
  ) => CharacterPositionResult | null,
  eventType: AnnotationEventType,
  position: Position,
  target: "start" | "end",
  prevPosition?: { start: number; end: number },
) => {
  internalEventListener.sendEvent("annotation--remove-tag", {
    annotationUuid: annotation.id,
  });

  internalEventListener.blockEvents(eventType);

  const result = getCharacterFromTextNodesAtPoint(position);

  if (!result) return null;

  const { start, end } = getCharacterStartEndPosition(
    result,
    annotation,
    target,
  );

  return handleAnnotationEditAndSendEvent(
    annotation,
    annotationAdapter,
    internalEventListener,
    eventType,
    {
      start,
      end,
    },
    target === "start" ? "move-start" : "move-end",
    prevPosition,
  );
};

export const handleAnnotationEditAndSendEvent = (
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  internalEventListener: InternalEventListener,
  eventType: AnnotationEventType,
  { start, end }: { start: number; end: number },
  action: SnapperAction,
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

  internalEventListener.sendEvent("send-event--annotation", {
    event: eventType,
    annotationUuid: dummyAnnotation?.id.toString() || "",
    additionalData: { annotation: dummyAnnotation },
  });

  internalEventListener.sendEvent("annotation--draw-dummy", {
    dummyAnnotation: dummyAnnotation,
    color: color.edit,
  });

  return dummyAnnotation;
};
