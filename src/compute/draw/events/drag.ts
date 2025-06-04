import { drag } from "d3";
import { pick } from "lodash-es";
import { DUMMY_UID, SVG_ID, SvgModel } from "../../model/svg.types";
import { AnnotationMetadata, sendEvent } from "../send-events";
import {
  AnnotationDraw,
  Dimensions,
  TextAnnotation,
  TextAnnotationModel,
} from "../../annotation.model";
import { AnnotationEventType } from "../../events";
import {
  createAndAssignDrawAnnotation,
  createTextAnnotation,
} from "../../4_compute_positions";
import { drawAnnotation, drawAnnotationContent } from "../annotations";
import {
  getLinesForAnnotation,
  reAssignAnnotationToLine,
} from "../../2_assign_annotation_to_line";

function getCharacterFromTextNodesAtPoint(
  x: number,
  y: number,
  container: HTMLElement,
  model: TextAnnotationModel,
  annotationUid: string,
  target: "start" | "end",
) {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );
  let node: Text | null;

  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent!;
    for (let i = 0; i < text.length; i++) {
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + 1);

      const rects = range.getClientRects();
      for (const rect of rects) {
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          const parentDimensions = pick(
            container.getBoundingClientRect(),
            "width",
            "height",
            "x",
            "y",
          );
          const lineElement = node.parentNode as HTMLElement;
          const lineUid = lineElement.getAttribute("data-line-uid");

          const line = model.getLine(lineUid!);
          const newIndex = line.start + i;

          const dimensions = {
            x: rect.x - parentDimensions.x,
            y: rect.y - parentDimensions.y,
          };

          const originalAnnotation = model.getAnnotation(annotationUid);
          const _start =
            target === "start" ? newIndex : originalAnnotation?.start;
          const _end = target === "end" ? newIndex : originalAnnotation?.end;

          // TODO add f.e. a word snapper or letter snapper
          const start = Math.min(_start, _end);
          const end = Math.max(_start, _end);

          return {
            offset: i,
            start,
            end,
            newIndex,
            dimensions,
            dummyAnnotation: {
              ...originalAnnotation,
              start,
              end,
            } as TextAnnotation,
          };
        }
      }
    }
  }

  return null;
}

export const drawAnnotationHandles = (
  annotation: AnnotationDraw,
  model: TextAnnotationModel,
  svgModel: SvgModel,
) => {
  // console.log(model.config.actions);
  if (!model.config.actions.edit) return;

  if (annotation.path.border) {
    const eventMetadata = () => {
      return {
        annotation,
        model,
        textElement: svgModel.textElement,
      };
    };

    // TODO add condition to check if annotation is draggable

    if (annotation.draggable.start) {
      drawHandle(svgModel, eventMetadata, annotation.draggable.start, "start");
    }

    if (annotation.draggable.end) {
      drawHandle(svgModel, eventMetadata, annotation.draggable.end, "end");
    }
  }
};

export const drawHandle = (
  svg: SvgModel,
  eventMetadata: AnnotationMetadata,
  dimensions: Dimensions,
  target: "start" | "end",
) => {
  const { annotation, model, textElement } = eventMetadata();
  const handleRadius = model.config.text.handleRadius;
  let dragResult = null;
  const onDragEnd = (event) => {
    model.blockEvents = false;
    svg.removeAnnotations(DUMMY_UID);
    sendEvent(eventMetadata, "annotation-edit--end", event, {
      annotation: dragResult.dummyAnnotation,
    });

    if (!dragResult) return;

    // On annotation end the dummy annotation is removed,
    // and the existing annotation replaced by the new one
    svg.removeAnnotations(annotation.annotationUuid);

    reAssignAnnotationToLine(model, dragResult.dummyAnnotation, true);
    createAndAssignDrawAnnotation(
      model,
      textElement,
      dragResult.dummyAnnotation,
    )
      .getDrawAnnotations(annotation.annotationUuid)
      .forEach((a) => {
        drawAnnotation(svg, a, model);
      });
  };

  const onDrag = (eventType: AnnotationEventType) => (event) => {
    model.blockEvents = true;
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;

    const result = getCharacterFromTextNodesAtPoint(
      x,
      y,
      textElement,
      model,
      annotation.annotationUuid,
      target,
    );
    if (result) {
      dragResult = result;
      handle.attr("x", result.dimensions.x - width / 2);
      handle.attr("y", result.dimensions.y);

      svg.removeAnnotations(DUMMY_UID);

      sendEvent(eventMetadata, eventType, event, {
        annotation: dragResult.dummyAnnotation,
      });

      // create dummy annotation
      const dummyAnnotation = {
        ...result.dummyAnnotation,
        annotationUuid: DUMMY_UID,
      } as TextAnnotation;

      const lines = getLinesForAnnotation(model.lines, dummyAnnotation);
      createTextAnnotation(
        lines,
        textElement.getBoundingClientRect(),
        model,
        result.dummyAnnotation,
      ).forEach((a) =>
        drawAnnotationContent(
          { ...a, annotationUuid: DUMMY_UID },
          svg,
          model.config,
        ),
      );

      svg.colorAnnotation(DUMMY_UID, annotation.color.hover);
    }
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
    .attr("opacity", 0.5)
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
