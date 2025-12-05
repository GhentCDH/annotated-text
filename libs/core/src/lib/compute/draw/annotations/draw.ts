import { AnnotationDrawColor, type TextAnnotation } from "../../../model";
import { DUMMY_UID, SvgModel } from "../../model/svg.types";
import { getLinesForAnnotation } from "../../2_assign_annotation_to_line";
import { drawAnnotationContent } from "../annotations";

export const drawDummyAnnotation = (
  svgModel: SvgModel,
  dummyAnnotation: TextAnnotation,
  color: AnnotationDrawColor,
) => {
  svgModel.removeAnnotations(DUMMY_UID);
  const { model, textElement } = svgModel;

  dummyAnnotation._render.lines = getLinesForAnnotation(
    model.lines,
    dummyAnnotation,
  );

  const renderInstance =
    svgModel.annotationAdapter.renderInstance.highlightInstance;

  renderInstance
    .createDraws(
      model.renderParams,
      svgModel.textAdapter.style,
      textElement.getBoundingClientRect(),
      dummyAnnotation,
    )
    .draws.forEach((a) => {
      drawAnnotationContent(
        { ...a, annotationUuid: DUMMY_UID },
        svgModel,
        renderInstance.style,
        color,
      );
    });

  svgModel.colorAnnotation(DUMMY_UID, color!);
};
