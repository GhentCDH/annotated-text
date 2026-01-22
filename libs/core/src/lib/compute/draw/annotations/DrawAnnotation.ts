import type {
  AnnotationDrawColor,
  AnnotationId,
  TextAnnotation,
} from '../../../model';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { drawAnnotation, drawAnnotationContent } from '../annotations';
import { DUMMY_UID, SvgModel } from '../../model/svg.types';
import { getUnscaledRect } from '../../position/unscaled';
import { AnnotationColors } from '../../model/annotation.colors';
import { getLinesForAnnotation } from '../../utils/line.utils';

export class DrawAnnotation extends BaseAnnotationDi {
  private readonly svgModel = this.annotationModule.inject(SvgModel);
  private readonly annotationColors =
    this.annotationModule.inject(AnnotationColors);

  draw(annotation: TextAnnotation) {
    drawAnnotation(this.annotationModule, annotation);
  }

  dummy(dummyAnnotation: TextAnnotation, color: AnnotationDrawColor) {
    const annotationUuid = DUMMY_UID;

    dummyAnnotation._render.lines = getLinesForAnnotation(
      this.textAdapter.lines,
      dummyAnnotation,
    );

    this.createDraws(
      this.svgModel.textElement,
      dummyAnnotation,
      color,
      annotationUuid,
    );
  }

  private createDraws(
    textElement: HTMLElement,
    annotation: TextAnnotation,
    color: AnnotationDrawColor,
    newUuid?: AnnotationId,
  ) {
    const annotationUuid = newUuid ?? annotation.id;

    this.internalEventListener.sendEvent('annotation--remove', {
      annotationUuid,
    });
    const parentDimensions = getUnscaledRect(textElement);
    const renderInstance =
      this.annotationAdapter.renderInstance.highlightInstance;

    renderInstance
      .createDraws(
        {
          textDirection: this.textAdapter.textDirection,
          maxGutterWeight: this.annotationAdapter.gutter.maxWeight,
        },
        this.textAdapter.style,
        parentDimensions,
        annotation,
      )
      .draws.forEach((a) => {
        drawAnnotationContent({ ...a, annotationUuid }, this.svgModel, color);
      });

    this.annotationColors.colorAnnotation(annotationUuid, color);
  }
}
