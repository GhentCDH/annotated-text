import { cloneDeep } from 'lodash-es';
import {
  createTextAnnotationRender,
  DefaultTextAnnotationRenderStyle,
} from './TextAnnotationRender';
import {
  AnnotationRender,
  type AnnotationRenderParams,
} from './annotation-render';
import {
  type AnnotationDrawColor,
  type AnnotationDrawColors,
  type TextAnnotation,
} from '../../../model';
import { type GetColorsFn } from '../../../compute/compute/colors';
import {
  createAnnotationFill,
  type createAnnotationPathFn,
  type PathParams,
} from '../../../compute/utils/create-path';
import { type TextAdapterStyle } from '../../text';

export const getColorsUnderline: GetColorsFn<UnderlineAnnotationRenderStyle> = (
  style: UnderlineAnnotationRenderStyle,
  annotation: TextAnnotation,
  borders = true,
) => {
  const hoverColor = style.hover.color;
  const editColor = style.edit.color;
  const color = annotation._render.style.color;

  return {
    default: {
      fill: 'rgba(0,0,0,0)',
      border: borders ? color.border : undefined,
      borderWidth: style.borderWidth,
    } as AnnotationDrawColor,
    hover: {
      ...hoverColor,
      borderWidth: style.borderWidth,
    },
    edit: {
      fill: color.background,
      border: borders ? editColor.border : undefined,
      borderWidth: style.borderWidth,
    },
    active: {
      fill: color.backgroundActive,
      border: borders ? color.borderActive : undefined,
      borderWidth: style.borderWidth,
    } as AnnotationDrawColor,
    tag: {
      fill: color.tagBackground,
      border: color.border,
      text: color.tagColor,
      borderWidth: style.borderWidth,
    },
  } as AnnotationDrawColors;
};

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

export class UnderLineAnnotationRender extends AnnotationRender<UnderlineAnnotationRenderStyle> {
  readonly weightOrder: number = 2;
  readonly isGutter: boolean = false;

  constructor(
    name: string,
    style: Partial<UnderlineAnnotationRenderStyle> = {},
  ) {
    super(name, style, DefaultUnderlineAnnotationRenderStyle);
  }

  createDraws(
    params: AnnotationRenderParams,
    textStyle: TextAdapterStyle,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    return createTextAnnotationRender(
      params,
      this.style,
      textStyle,
      parentDimensions,
      annotation,
      createUnderline,
      getColorsUnderline,
    );
  }
}
