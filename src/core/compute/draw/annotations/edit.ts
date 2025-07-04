import { drawDummyAnnotation, getCharacterFromTextNodesAtPoint } from "./draw";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";
import { type TextAnnotation } from "../../../model";
import { AnnotationEventType } from "../../../events/events";

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

  const width = svgModel.annotationAdapter.config.text.handleRadius;
  const result = getCharacterFromTextNodesAtPoint(x, y, svgModel);

  if (!result) return null;
  handle.attr("x", result.dimensions.x - width / 2);
  handle.attr("y", result.dimensions.y);

  const { newIndex } = result;

  const originalAnnotation = model.getAnnotation(annotation.annotationUuid);
  const _start = target === "start" ? newIndex : originalAnnotation?.start;
  const _end = target === "end" ? newIndex : originalAnnotation?.end;
  const start = Math.min(_start, _end);
  const end = Math.max(_start, _end);

  // create dummy annotation
  const dummyAnnotation = {
    ...originalAnnotation,
    start,
    end,
    annotationUuid: DUMMY_UID,
  } as unknown as TextAnnotation;

  const snapper = svgModel.annotationAdapter.snapper.fixOffset(
    target === "start" ? "move-start" : "move-end",
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

  drawDummyAnnotation(svgModel, dummyAnnotation, annotation.color.hover);

  return dummyAnnotation;
};
