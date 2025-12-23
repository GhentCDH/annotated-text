import { cloneDeep } from 'lodash-es';
import { DefaultTextAnnotationRenderStyle } from './TextAnnotationRender';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import { type AnnotationDrawPath } from '../../../model';
import {
  createAnnotationFill,
  type createAnnotationPathFn,
  type PathParams,
} from '../../../compute/utils/create-path';

const createUnderline: createAnnotationPathFn = (params: PathParams) => {
  const fill = createAnnotationFill(params);
  const { x, y, height, width } = params;
  return {
    border:
      // move to top-left
      `M ${x} ${y + height} h ${width}`,

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
