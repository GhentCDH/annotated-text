import { type AnnotationDrawColor, type TextAnnotation } from '../../../model';
import { DUMMY_UID, type SvgModel } from '../../model/svg.types';
import { drawAnnotationContent } from '../annotations';
import { getLinesForAnnotation } from '../../utils/line.utils';
import { getUnscaledRect } from '../../position/unscaled';

export const drawDummyAnnotation = (
  svgModel: SvgModel,
  dummyAnnotation: TextAnnotation,
  color: AnnotationDrawColor,
) => {
  svgModel.removeAnnotations(DUMMY_UID);
  const { model, textElement, textAdapter } = svgModel;
  const parentDimensions = getUnscaledRect(textElement);

  dummyAnnotation._render.lines = getLinesForAnnotation(
    textAdapter.lines,
    dummyAnnotation,
  );

  const renderInstance =
    svgModel.annotationAdapter.renderInstance.highlightInstance;

  renderInstance
    .createDraws(
      model.renderParams,
      svgModel.textAdapter.style,
      parentDimensions,
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
