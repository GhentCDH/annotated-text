import memoizee from 'memoizee';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import {
  createAnnotationFill,
  type createAnnotationPathFn,
  type PathParams,
} from './_utils/path';
import { type AnnotationDrawPath, type BaseAnnotation } from '../../../model';
import { type CustomAnnotationStyle } from '../style';
import {
  _DefaultAnnotationStyle,
  type DefaultAnnotationStyle,
} from '../style/annotation.style.default';

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

export const createUnderlineStyle = (
  color: string,
  style: Partial<DefaultAnnotationStyle> = {},
): Partial<DefaultAnnotationStyle> => ({
  backgroundColor: 'transparent',
  borderColor: color,
  tagBorderColor: color,
  backgroundOpacity: 0,
  borderRadius: 0,
  ...style,
});

const DefaultUnderlineAnnotationStyle: CustomAnnotationStyle = {
  default: createUnderlineStyle(_DefaultAnnotationStyle.backgroundColor),
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
