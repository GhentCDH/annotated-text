import { cloneDeep } from "lodash-es";
import { drawDummyAnnotation } from "./draw";
import { SnapperAction } from "../../../adapter/text/snapper";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import {
  AnnotationDrawColors,
  type TextAnnotation,
  textAnnotationSchema,
} from "../../../model";
import { AnnotationEventType } from "../../../events/events";
import {
  getCharacterFromTextNodesAtPoint,
  getCharacterStartEndPosition,
} from "../../position";

export const handleAnnotationEditAndSendEvent = (
  annotation: TextAnnotation,
  { start, end }: { start: number; end: number },
  svgModel: SvgModel,
  action: SnapperAction,
  eventType: AnnotationEventType,
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

  const color = annotation._drawMetadata.color as AnnotationDrawColors;

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
  annotation: TextAnnotation,
  target: "start" | "end",
  eventType: AnnotationEventType,
  prevPosition?: { start: number; end: number },
) => {
  const { model } = svgModel;
  svgModel.removeTag(annotation.id);

  model.blockEvents = true;

  const result = getCharacterFromTextNodesAtPoint(x, y, svgModel);

  if (!result) return null;

  const { start, end } = getCharacterStartEndPosition(
    result,
    annotation,
    target,
  );

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
