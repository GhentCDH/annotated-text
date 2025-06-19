import { sendEvent } from "../send-events";
import { AnnotationRect, SvgModel } from "../../model/svg.types";
import { AnnotationDraw } from "../../annotation.model";

export const clickAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svgModel: SvgModel) =>
  (mouseEvent) => {
    const model = svgModel.model;
    if (model.blockEvents) return;

    sendEvent({ model, annotation }, { event: "double-click", mouseEvent });
  };

export const doubleClickAnnotation =
  (rect: AnnotationRect, annotation: AnnotationDraw, svgModel: SvgModel) =>
  (mouseEvent) => {
    const model = svgModel.model;
    if (model.blockEvents) return;

    mouseEvent.preventDefault();
    sendEvent({ model, annotation }, { event: "double-click", mouseEvent });
  };
