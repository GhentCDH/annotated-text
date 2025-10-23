import { drawDummyAnnotation } from "./draw";
import { SnapperAction } from "../../../adapter/text/snapper";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";
import { type TextAnnotation } from "../../../model";
import { AnnotationEventType } from "../../../events/events";
import { getCharacterFromTextNodesAtPoint } from "../../position";

export const handleAnnotationEditAndSendEvent = (
  annotation: AnnotationDraw,
  { start, end }: { start: number; end: number },
  svgModel: SvgModel,
  action: SnapperAction,
  eventType: AnnotationEventType,
  prevPosition?: { start: number; end: number },
) => {
  const originalAnnotation = svgModel.model.getAnnotation(
    annotation.annotationUuid,
  );
  // create dummy annotation
  const dummyAnnotation = {
    ...originalAnnotation,
    start,
    end,
    annotationUuid: DUMMY_UID,
    weight: originalAnnotation.weight! + 1,
  } as unknown as TextAnnotation;

  let snapper = svgModel.annotationAdapter.snapper.fixOffset(
    action,
    dummyAnnotation,
  );

  if (snapper.end < snapper.start) {
    // Try snapping the other side if the end is before the start
    dummyAnnotation.start = snapper.start;
    snapper = svgModel.annotationAdapter.snapper.fixOffset(
      action,
      dummyAnnotation,
    );
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

  const color = svgModel.model.getAnnotationColor(annotation.annotationUuid);

  dummyAnnotation.start = snapper.start;
  dummyAnnotation.end = snapper.end;

  svgModel.sendEvent(
    {
      event: eventType,
      annotationUuid: dummyAnnotation?.id.toString() || "",
    },
    { annotation: dummyAnnotation },
  );

  drawDummyAnnotation(svgModel, dummyAnnotation, color.edit);

  return dummyAnnotation;
};

export const editAnnotations = (
  svgModel: SvgModel,
  x: number,
  y: number,
  annotation: AnnotationDraw,
  target: "start" | "end",
  eventType: AnnotationEventType,
  prevPosition?: { start: number; end: number },
) => {
  const { model } = svgModel;
  svgModel.removeTag(annotation.annotationUuid);

  model.blockEvents = true;

  const result = getCharacterFromTextNodesAtPoint(x, y, svgModel);

  if (!result) return null;

  const { newIndex } = result;

  const originalAnnotation = model.getAnnotation(annotation.annotationUuid);
  const _start = target === "start" ? newIndex : originalAnnotation?.start;
  const _end = target === "end" ? newIndex : originalAnnotation?.end;
  const start = Math.min(_start, _end);
  let end = Math.max(_start, _end);

  return handleAnnotationEditAndSendEvent(
    annotation,
    {
      start,
      end,
    },
    svgModel,
    target === "start" ? "move-start" : "move-end",
    eventType,
    prevPosition,
  );
};
