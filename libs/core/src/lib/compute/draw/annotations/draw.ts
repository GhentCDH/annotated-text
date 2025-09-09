import { AnnotationDrawColor } from "../../annotation.model";
import { type TextAnnotation } from "../../../model";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import {
  getLinesForAnnotation,
  reAssignAnnotationToLine,
} from "../../2_assign_annotation_to_line";
import { createAndAssignDrawAnnotation } from "../../4_compute_positions";
import { drawAnnotation, drawAnnotationContent } from "../annotations";
import { TextAnnotationRender } from "../../compute/TextAnnotationRender";

export const removeDummyAnnotation = (svgModel: SvgModel) => {
  svgModel.removeAnnotations(DUMMY_UID);
};

export const drawDummyAnnotation = (
  svgModel: SvgModel,
  dummyAnnotation: TextAnnotation,
  color?: AnnotationDrawColor,
) => {
  svgModel.removeAnnotations(DUMMY_UID);
  const { model, textElement } = svgModel;
  const lines = getLinesForAnnotation(model.lines, dummyAnnotation);

  TextAnnotationRender(
    lines,
    textElement.getBoundingClientRect(),
    model,
    dummyAnnotation,
    svgModel.textAdapter,
    svgModel.annotationAdapter,
  ).draws.forEach((a) => {
    drawAnnotationContent(
      { ...a, annotationUuid: DUMMY_UID },
      svgModel,
      svgModel.annotationAdapter.config!,
    );
  });

  svgModel.colorAnnotation(DUMMY_UID, color!);
};

export const recreateAnnotation = (
  svgModel: SvgModel,
  annotation: TextAnnotation | null | undefined,
) => {
  if (!annotation) return;

  const { model } = svgModel;
  svgModel.removeAnnotations(annotation.id);

  reAssignAnnotationToLine(model, svgModel.eventListener, annotation, true);
  createAndAssignDrawAnnotation(
    model,
    svgModel.textElement,
    annotation,
    svgModel.annotationAdapter,
    svgModel.textAdapter,
  )
    .getDrawAnnotations(annotation.id)
    .forEach((a) => {
      drawAnnotation(svgModel, a);
    });
};
