import {
  type AnnotationDrawColor,
  BaseAnnotation,
  type TextAnnotation,
} from '../../../model';
import { DUMMY_UID, type SvgModel } from '../../model/svg.types';
import { drawAnnotationContent } from '../annotations';
import { getLinesForAnnotation } from '../../utils/line.utils';
import { getUnscaledRect } from '../../position/unscaled';

export const drawDummyAnnotation = <ANNOTATION extends BaseAnnotation>(
  svgModel: SvgModel<ANNOTATION>,
  dummyAnnotation: TextAnnotation,
  color: AnnotationDrawColor,
) => {
  svgModel.removeAnnotations(DUMMY_UID);
  const { textElement, textAdapter, annotationAdapter } = svgModel;
  const parentDimensions = getUnscaledRect(textElement);

  dummyAnnotation._render.lines = getLinesForAnnotation(
    textAdapter.lines,
    dummyAnnotation,
  );

  const renderInstance =
    svgModel.annotationAdapter.renderInstance.highlightInstance;

  renderInstance
    .createDraws(
      {
        textDirection: textAdapter.textDirection,
        maxGutterWeight: annotationAdapter.gutter.maxWeight,
      },
      textAdapter.style,
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
