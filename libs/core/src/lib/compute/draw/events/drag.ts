import { drag } from "d3";
import { pick } from "lodash-es";
import { SVG_ID, SvgModel } from "../../model/svg.types";
import {
  AnnotationDraw,
  Dimensions,
  TextAnnotationModel,
} from "../../annotation.model";
import { TextAnnotation } from "../../../model";
import { AnnotationEventType } from "../../../events/events";
import { editAnnotations } from "../annotations/edit";
import { recreateAnnotation, removeDummyAnnotation } from "../annotations/draw";
import { drawTag } from "../tag";

export const drawAnnotationHandles = (
  annotation: AnnotationDraw,
  svgModel: SvgModel,
) => {
  if (annotation.path.border) {
    // TODO add condition to check if annotation is draggable

    if (annotation.draggable.start) {
      drawHandle(svgModel, annotation, annotation.draggable.start, "start");
    }

    if (annotation.draggable.end) {
      drawHandle(svgModel, annotation, annotation.draggable.end, "end");
    }
  }
};

export const drawHandle = (
  svgModel: SvgModel,
  annotation: AnnotationDraw,
  dimensions: Dimensions,
  target: "start" | "end",
) => {
  const model = svgModel.model as TextAnnotationModel;
  const config = svgModel.annotationAdapter.config!;
  const handleRadius = config.text.handleRadius;
  let dragResult: TextAnnotation | null = null;
  const onEditDragEnd = (event: MouseEvent) => {
    if (!dragResult) {
      return;
    }
    model.blockEvents = false;
    removeDummyAnnotation(svgModel);

    svgModel.sendEvent(
      {
        event: "annotation-edit--end",
        mouseEvent: event,
        annotationUuid: annotation?.uuid || "",
      },
      { annotation: dragResult },
    );

    if (!dragResult) return;

    const originalAnnotation = svgModel.model.getAnnotation(
      annotation.annotationUuid,
    );
    dragResult.weight = originalAnnotation.weight;
    // On annotation end the dummy annotation is removed,
    // and the existing annotation replaced by the new one
    recreateAnnotation(svgModel, dragResult);
    drawTag(svgModel, dragResult);
  };

  const onEditDrag = (eventType: AnnotationEventType) => (event: any) => {
    if (!svgModel.annotationAdapter.edit) return;

    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    dragResult =
      editAnnotations(
        svgModel,
        x,
        y,
        annotation,
        target,
        eventType,
        (dragResult && pick(dragResult, ["start", "end"])) ?? undefined,
      ) ?? dragResult;
  };

  const onEditDragStart = (event: any) => {
    if (!svgModel.annotationAdapter.edit) return;

    return onEditDrag("annotation-edit--start")(event);
  };

  const width = handleRadius;
  const handle = svgModel.handles
    .append("rect")
    .attr(SVG_ID.ANNOTATION_UID, annotation.annotationUuid)
    .attr(SVG_ID.ANNOTATION_ROLE, "handle")
    .attr("width", width)
    .attr("height", dimensions.height)
    .attr("fill", "gray")
    .attr("opacity", 0)
    .attr("x", dimensions.x - width / 2)
    .attr("y", dimensions.y)
    .call(
      drag()
        .on("drag", onEditDrag("annotation-edit--move"))
        .on("start", onEditDragStart)
        .on("end", onEditDragEnd) as any,
    );
  handle.on("mouseenter", () => {
    handle.attr("class", svgModel.annotationAdapter.edit ? "handle" : "");
  });
  return handle;
};
