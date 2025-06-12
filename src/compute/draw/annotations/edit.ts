import {
  drawDummyAnnotation,
  getCharacterFromTextNodesAtPoint,
  removeDummyAnnotation,
} from "./draw";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import { AnnotationDraw, TextAnnotation } from "../../annotation.model";
import { sendEvent1 } from "../send-events";
import { AnnotationEventType } from "../../events";

export const editAnnotations = (
  svg: SvgModel,
  x: number,
  y: number,
  annotation: AnnotationDraw,
  target: "start" | "end",
  handle: any,
  eventType: AnnotationEventType,
) => {
  const { model } = svg;

  model.blockEvents = true;

  const width = model.config.text.handleRadius;
  const result = getCharacterFromTextNodesAtPoint(x, y, svg);

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

  const snapper = model.config.visualEvent.useSnapper(
    target === "start" ? "move-start" : "move-end",
    dummyAnnotation,
  );
  dummyAnnotation.start = snapper.start;
  dummyAnnotation.end = snapper.end;

  sendEvent1(
    { model: svg.model, annotation },
    { event: eventType },
    {
      annotation: dummyAnnotation,
    },
  );

  removeDummyAnnotation(svg);
  drawDummyAnnotation(svg, dummyAnnotation, annotation.color.hover);

  return dummyAnnotation;
};
