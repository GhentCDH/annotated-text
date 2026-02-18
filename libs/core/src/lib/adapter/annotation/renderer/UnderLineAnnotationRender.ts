import memoizee from 'memoizee';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import {
  createAnnotationFill,
  type createAnnotationPathFn,
  type PathParams,
} from './_utils/path';
import { type AnnotationDrawPath, type BaseAnnotation } from '../../../model';
import { type CustomAnnotationStyle } from '../style';

const createLine = memoizee(
  (x: number, y: number, width: number, height: number) => {
    return `M${x} ${y + height} h ${width}`;
  },
);

const createUnderline: createAnnotationPathFn = (params: PathParams) => {
  const fill = createAnnotationFill(params);
  const { x, y, height, width } = params;

  return {
    border:
      // move to top-left
      createLine(x, y, width, height),
    fill,
  };
};

const DefaultUnderlineAnnotationStyle: CustomAnnotationStyle = {
  default: {
    backgroundColor: 'transparent',
    backgroundOpacity: 0,
    borderRadius: 0,
  },
  hover: {
    borderWidth: 4,
  },
};

export class UnderLineAnnotationRender extends SvgAnnotationRender<BaseAnnotation> {
  readonly weightOrder: number = 2;
  readonly isGutter: boolean = false;
  readonly renderTag = true;
  override fillBg = false;

  constructor(name: string, style: CustomAnnotationStyle = {}) {
    super(name, DefaultUnderlineAnnotationStyle, style);
  }

  override createPath(params: PathParams): AnnotationDrawPath {
    return createUnderline(params);
  }
}
