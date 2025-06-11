import { drag } from "d3";
import { SVG_ID, SvgModel } from "../../model/svg.types";
import {
  AnnotationDraw,
  Dimensions,
  TextAnnotationModel,
} from "../../annotation.model";
import { AnnotationEventType } from "../../events";
import { editAnnotations } from "../annotations/edit";
import { recreateAnnotation, removeDummyAnnotation } from "../annotations/draw";
import { sendEvent1 } from "../send-events";

export const drawAnnotationHandles = (
  annotation: AnnotationDraw,
  svgModel: SvgModel,
) => {
  const model = svgModel.model as TextAnnotationModel;
  // console.log(model.config.actions);
  if (!model.config.actions.edit) return;

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
  svg: SvgModel,
  annotation: AnnotationDraw,
  dimensions: Dimensions,
  target: "start" | "end",
) => {
  const model = svg.model as TextAnnotationModel;
  const handleRadius = model.config.text.handleRadius;
  let dragResult = null;
  const onDragEnd = (event) => {
    model.blockEvents = false;
    removeDummyAnnotation(svg);
    sendEvent1(
      { model, annotation },
      { event: "annotation-edit--end", mouseEvent: event },
      {
        annotation: dragResult,
      },
    );

    if (!dragResult) return;

    // On annotation end the dummy annotation is removed,
    // and the existing annotation replaced by the new one
    recreateAnnotation(svg, dragResult);
  };

  const onDrag = (eventType: AnnotationEventType) => (event) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    dragResult =
      editAnnotations(svg, x, y, annotation, target, handle, eventType) ??
      dragResult;
  };

  const width = handleRadius;
  const handle = svg.handles
    .append("rect")
    .attr(SVG_ID.ANNOTATION_UID, annotation.annotationUuid)
    .attr(SVG_ID.ANNOTATION_ROLE, "handle")
    .attr("class", "handle")
    .attr("width", width)
    .attr("height", dimensions.height)
    .attr("fill", "gray")
    .attr("opacity", 0)
    .attr("x", dimensions.x - width / 2)
    .attr("y", dimensions.y)
    .call(
      drag()
        .on("drag", onDrag("annotation-edit--move"))
        .on("start", onDrag("annotation-edit--start"))
        .on("end", onDragEnd),
    );
  return handle;
};
