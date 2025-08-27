import { drag } from "d3";
import { sendDummyAnnotationEvent } from "./edit";
import {
  getCharacterFromTextNodesAtPoint,
  recreateAnnotation,
  removeDummyAnnotation,
} from "./draw";
import { TextAnnotation } from "../../../model";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import { AnnotationDraw, Dimensions } from "../../annotation.model";

export const addDraggableAnnotation = (
  svgModel: SvgModel,
  annotation: AnnotationDraw,
) => {
  let dragBusy = false;
  let dummyAnnotation: TextAnnotation;

  let startDimensions: Dimensions;
  let endDimensions: Dimensions;
  let originalAnnotation: TextAnnotation;
  let pickupIndex = 0;

  const onDragStart = () => (event: any) => {
    const draws = svgModel.model.getAnnotationDraw(annotation.annotationUuid);
    startDimensions = draws.find((d) => d.draggable.start)!.draggable
      ?.start as Dimensions;
    endDimensions = draws.find((d) => d.draggable.end)!.draggable
      ?.end as Dimensions;
    originalAnnotation = svgModel.model.getAnnotation(
      annotation.annotationUuid,
    );

    // if (!startDimensions || !endDimensions) return;
    if (!svgModel.annotationAdapter.edit) return;
    if (svgModel.model.blockEvents) return;

    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    const result = getCharacterFromTextNodesAtPoint(x, y, svgModel);
    if (!result) return;
    pickupIndex = result.newIndex;

    svgModel.model.blockEvents = true;
    dragBusy = true;

    svgModel.sendEvent({
      event: "annotation-edit--start",
      annotationUuid: annotation?.annotationUuid.toString() || "",
    });
    svgModel.setClass(annotation.annotationUuid, "move");
  };

  const onDragMove = () => (event: any) => {
    if (!startDimensions || !endDimensions) return;
    if (!dragBusy) return;

    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    const result = getCharacterFromTextNodesAtPoint(x, y, svgModel);
    if (!result) return;

    const delta = result.newIndex - pickupIndex;
    const startIndex = originalAnnotation.start + delta;
    const endIndex = originalAnnotation.end + delta;
    dummyAnnotation = sendDummyAnnotationEvent(
      annotation,
      {
        start: startIndex,
        end: endIndex,
      },
      svgModel,
      "drag",
      "annotation-edit--move",
    );
    svgModel.setClass(DUMMY_UID, "move");
  };

  const onDragEnd = () => (event: any) => {
    svgModel.setClass(annotation.annotationUuid, "");
    if (!dragBusy) return;
    dragBusy = false;
    svgModel.model.blockEvents = false;

    removeDummyAnnotation(svgModel);
    if (!dummyAnnotation) return;
    svgModel.sendEvent(
      {
        event: "annotation-edit--end",
        annotationUuid: dummyAnnotation?.id.toString() || "",
      },
      { annotation: dummyAnnotation },
    );

    dummyAnnotation.weight = originalAnnotation.weight;
    // On annotation end the dummy annotation is removed,
    // and the existing annotation replaced by the new one
    recreateAnnotation(svgModel, dummyAnnotation);
  };

  return drag()
    .on("drag", onDragMove())
    .on("start", onDragStart())
    .on("end", onDragEnd()) as any;
};
