import { CreateAnnotation } from './create.annotation';
import { type SvgModel } from '../../model/svg.types';
import { type Position } from '../types';
import { getCharacterFromTextNodesAtPoint } from '../../position';

export const createNewBlock = (svgModel: SvgModel<any>) => {
  const svg = svgModel.svg;
  const adapter = svgModel.annotationAdapter;

  const getPosition = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    return { x, y };
  };

  const createAnnotation: CreateAnnotation = new CreateAnnotation(
    svgModel.internalEventListener,
    adapter,
    ({ x, y }: Position) => getCharacterFromTextNodesAtPoint(x, y, svgModel),
  );

  svg.on('mousedown', (event: MouseEvent) => {
    createAnnotation.startCreate(getPosition(event), event);
  });

  svg.on('mousemove', (event: MouseEvent) => {
    createAnnotation.moveCreate(getPosition(event), event);
  });

  svg.on('mouseup', (event: MouseEvent) => {
    createAnnotation.endCreate(getPosition(event), event);
  });
};
