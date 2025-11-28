import { drag } from "d3";
import { pick } from "lodash-es";
import { SVG_ID, SvgModel } from "../../model/svg.types";
import { TextAnnotationModel } from "../../annotation.model";
import { AnnotationDraw, Dimensions, TextAnnotation } from "../../../model";
import { AnnotationEventType } from "../../../events/events";
import { editAnnotations } from "../annotations/edit";
import { recreateAnnotation, removeDummyAnnotation } from "../annotations/draw";
import { drawTag } from "../tag";
import { hoverAnnotation, leaveAnnotation } from "./hover";

export const drawAnnotationHandles = (
  annotation: TextAnnotation,
  draw: AnnotationDraw,
  svgModel: SvgModel,
) => {
  if (draw.path.border) {
    // TODO add condition to check if annotation is draggable

    if (draw.draggable.start) {
      drawHandle(svgModel, annotation, draw.draggable.start, "start");
    }

    if (draw.draggable.end) {
      drawHandle(svgModel, annotation, draw.draggable.end, "end");
    }
  }
};

export const drawHandle = (
  svgModel: SvgModel,
  annotation: TextAnnotation,
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
        annotationUuid: annotation?.id || "",
      },
      { annotation: dragResult },
    );

    if (!dragResult) return;

    dragResult._render.weight = annotation._render.weight;
    dragResult.id = annotation.id;
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
    .attr(SVG_ID.ANNOTATION_UID, annotation.id)
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
  handle
    .on("mouseover", hoverAnnotation(annotation, svgModel))
    .on("mouseleave", leaveAnnotation(annotation, svgModel))
    .on("mouseenter", () => {
      handle.attr("class", svgModel.annotationAdapter.edit ? "handle" : "");
    });
  return handle;
};
