import { cloneDeep } from 'lodash-es';
import memoizee from 'memoizee';
import { DefaultTextAnnotationRenderStyle } from './TextAnnotationRender';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import {
  createAnnotationFill,
  type createAnnotationPathFn,
  type PathParams,
} from './_utils/path';
import { type AnnotationDrawPath } from '../../../model';

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

export const DefaultUnderlineAnnotationRenderStyle = {
  ...cloneDeep(DefaultTextAnnotationRenderStyle),
};
export type UnderlineAnnotationRenderStyle =
  typeof DefaultUnderlineAnnotationRenderStyle;

export class UnderLineAnnotationRender extends SvgAnnotationRender<UnderlineAnnotationRenderStyle> {
  readonly weightOrder: number = 2;
  readonly isGutter: boolean = false;
  override fillBg = false;

  constructor(
    name: string,
    style: Partial<UnderlineAnnotationRenderStyle> = {},
  ) {
    super(name, style, DefaultUnderlineAnnotationRenderStyle);
  }

  override createPath(params: PathParams): AnnotationDrawPath {
    return createUnderline(params);
  }
}
