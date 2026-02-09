import { CreateAnnotation } from './create.annotation';
import { SvgModel } from '../../model/svg.types';
import { type Position } from '../types';
import { type AnnotationModule } from '../../../di/annotation.module';
import { DrawText } from '../text/DrawText';
import { type BaseAnnotation } from '../../../model';

export const createNewBlock = <ANNOTATION extends BaseAnnotation>(
  annotationModule: AnnotationModule,
) => {
  const svgModel = annotationModule.inject(SvgModel);
  const svg = svgModel.svg;
  const drawText = annotationModule.inject(DrawText);

  const getPosition = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    return { x, y };
  };

  const createAnnotation: CreateAnnotation = new CreateAnnotation(
    annotationModule,
    ({ x, y }: Position) => drawText.getCharacterFromTextNodesAtPoint(x, y),
  );

  svg.on('mousedown', (event) => {
    createAnnotation.startCreate(getPosition(event), event);
  });

  svg.on('mousemove', (event) => {
    createAnnotation.moveCreate(getPosition(event), event);
  });

  svg.on('mouseup', (event) => {
    createAnnotation.endCreate(getPosition(event), event);
  });
};
