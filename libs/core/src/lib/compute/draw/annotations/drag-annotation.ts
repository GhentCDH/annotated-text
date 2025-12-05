import { drag } from "d3";
import { DragAnnotation } from "./drag.annotations";
import { TextAnnotation } from "../../../model";
import { SvgModel } from "../../model/svg.types";
import { getCharacterFromTextNodesAtPoint } from "../../position";
import { Position } from "../types";

export const addDraggableAnnotation = (
  svgModel: SvgModel,
  annotation: TextAnnotation,
) => {
  const dragAnnotation = new DragAnnotation(
    svgModel.model.getMinStartPosition(),
    annotation,
    svgModel.internalEventListener,
    svgModel.annotationAdapter,
    ({ x, y }: Position) => getCharacterFromTextNodesAtPoint(x, y, svgModel),
  );

  const onDragStart = () => (event: any) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;

    dragAnnotation.startDrag({ x, y }, event);
  };

  const onDragMove = () => (event: any) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    dragAnnotation.moveDrag({ x, y }, event);
  };

  const onDragEnd = () => (event: any) => {
    dragAnnotation.endDrag(event);
  };

  return drag()
    .on("drag", onDragMove())
    .on("start", onDragStart())
    .on("end", onDragEnd()) as any;
};
