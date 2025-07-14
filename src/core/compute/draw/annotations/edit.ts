import { drawDummyAnnotation, getCharacterFromTextNodesAtPoint } from "./draw";
import { SnapperAction } from "../../../adapter/text/snapper";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";
import { type TextAnnotation } from "../../../model";
import { AnnotationEventType } from "../../../events/events";

export const sendDummyAnnotationEvent = (
  annotation: AnnotationDraw,
  { start, end }: { start: number; end: number },
  svgModel: SvgModel,
  action: SnapperAction,
  eventType: AnnotationEventType,
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
    weight: originalAnnotation.weight + 1,
  } as unknown as TextAnnotation;

  const snapper = svgModel.annotationAdapter.snapper.fixOffset(
    action,
    dummyAnnotation,
  );
  dummyAnnotation.start = snapper.start;
  dummyAnnotation.end = snapper.end;

  svgModel.sendEvent(
    {
      event: eventType,
      annotationUuid: dummyAnnotation?.id.toString() || "",
    },
    { annotation: dummyAnnotation },
  );

  drawDummyAnnotation(svgModel, dummyAnnotation, annotation.color.edit);

  return dummyAnnotation;
};

export const editAnnotations = (
  svgModel: SvgModel,
  x: number,
  y: number,
  annotation: AnnotationDraw,
  target: "start" | "end",
  handle: any,
  eventType: AnnotationEventType,
) => {
  const { model } = svgModel;

  model.blockEvents = true;

  const result = getCharacterFromTextNodesAtPoint(x, y, svgModel);

  if (!result) return null;

  const { newIndex } = result;

  const originalAnnotation = model.getAnnotation(annotation.annotationUuid);
  const _start = target === "start" ? newIndex : originalAnnotation?.start;
  const _end = target === "end" ? newIndex : originalAnnotation?.end;
  const start = Math.min(_start, _end);
  const end = Math.max(_start, _end);

  return sendDummyAnnotationEvent(
    annotation,
    {
      start,
      end,
    },
    svgModel,
    target === "start" ? "move-start" : "move-end",
    eventType,
  );
};
