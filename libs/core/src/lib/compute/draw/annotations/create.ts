import { CreateAnnotation } from './create.annotation';
import { type SvgModel } from '../../model/svg.types';
import { type Position } from '../types';
import { getCharacterFromTextNodesAtPoint } from '../../position';

export const createNewBlock = (svgModel: SvgModel) => {
  const container = svgModel.textElement;

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
