import { AnnotationMetadata, sendEvent } from "./send-events";
import {
  AnnotationDraw,
  AnnotationDrawColor,
  TextAnnotationModel,
} from "../annotation.model";
import { AnnotationSvg } from "../model/svg.types";

type AnnoltationRect = any;
const setColor = (rect, color: AnnotationDrawColor) => {
  rect.attr("fill", color.fill).attr("stroke", color.border);
};

const hoverAnnotation =
  (rect: AnnoltationRect, eventMetadata: AnnotationMetadata) =>
  (event: MouseEvent) => {
    const { annotation, model } = eventMetadata();
    const fullAnnotation = sendEvent(eventMetadata, "mouse-enter", event);

    if (model.config.visualEvent.hover(fullAnnotation)) {
      setColor(rect, annotation.color.hover);
    }
  };

const leaveAnnotation =
  (rect: AnnoltationRect, eventMetadata: AnnotationMetadata) => (event) => {
    sendEvent(eventMetadata, "mouse-leave", event);
    const { annotation } = eventMetadata();
    setColor(rect, annotation.color.default);
  };

const clickAnnotation =
  (rect: AnnoltationRect, eventMetadata: AnnotationMetadata) => (event) => {
    sendEvent(eventMetadata, "click", event);
  };

const doubleClickAnnotation =
  (rect: AnnoltationRect, eventMetadata: AnnotationMetadata) => (event) => {
    event.preventDefault();
    sendEvent(eventMetadata, "double-click", event);
  };

export const findRelatedAnnotations = (svg: any, annotationUuid: string) => {
  const annotations = svg.selectAll(
    `[data-annotation-uid="${annotationUuid}"]`,
  );

  if (annotations.empty()) {
    console.warn(
      `Could not find annotation with uuid ${annotationUuid} to color`,
    );
    return null;
  }

  return annotations;
};

export const colorAnnotation = (
  svg: any,
  annotationUuid: string,
  color: AnnotationDrawColor,
) => {
  const annotations = findRelatedAnnotations(svg, annotationUuid);

  annotations?.attr("fill", color.fill).attr("stroke", color.border);
  // const model = svg.datum() as TextAnnotationModel;
  // const fullAnnotation = model.getAnnotation(annotationUuid);
  // setColor(annotation, fullAnnotation.color.default);
};

export const drawAnnotation = (
  annotation: AnnotationDraw,
  model: TextAnnotationModel,
  svg: AnnotationSvg,
) => {
  const config = model.config;
  const rect = svg
    .append("rect")
    .attr("data-annotation-uid", annotation.annotationUuid)
    .attr("x", annotation.dimensions.x)
    .attr("y", annotation.dimensions.y)
    .attr("width", annotation.dimensions.width)
    .attr("height", annotation.dimensions.height)
    .attr("stroke-width", config.text.border)
    .attr("rx", config.text.borderRadius) // rounded corners
    .attr("ry", config.text.borderRadius);

  setColor(rect, annotation.color.default);

  const eventMetadata = () => {
    return {
      annotation,
      model,
    };
  };

  rect
    .on("mouseover", hoverAnnotation(rect, eventMetadata))
    .on("mouseleave", leaveAnnotation(rect, eventMetadata))
    // TODO check double click also fires click event
    .on("dblclick", doubleClickAnnotation(rect, eventMetadata))
    .on("click", clickAnnotation(rect, eventMetadata));

  return rect;
};

export const drawComputedAnnotations = (
  model: TextAnnotationModel,
  svg: SVGElement,
) => {
  model.drawAnnotations
    .sort((a1, a2) => (a1.weight > a2.weight ? -1 : 1))
    .forEach((annotation) => {
      drawAnnotation(annotation, model, svg);
    });
};
