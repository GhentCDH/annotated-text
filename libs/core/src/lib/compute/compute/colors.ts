import { type AnnotationDrawColors, type TextAnnotation } from '../../model';
import { type AnnotationRenderStyle } from '../../adapter/annotation/renderer';

export type GetColorsFn<STYLE extends AnnotationRenderStyle> = (
  style: STYLE,
  annotation: TextAnnotation,
  borders: boolean,
  fillBg: boolean,
) => AnnotationDrawColors;

export const getColors: GetColorsFn<any> = (
  style: any,
  annotation: TextAnnotation,
  borders = true,
  fillBg = true,
) => {
  const hoverColor = style.hover.color;
  const editColor = style.edit.color;
  const color = annotation._render.style.color;

  return {
    default: {
      fill: fillBg ? color.background : 'rgba(0,0,0,0)',
      border: borders ? color.border : undefined,
      borderWidth: style.borderWidth,
    },
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
    },
    tag: {
      fill: color.tagBackground,
      border: color.border,
      borderWidth: style.borderWidth,
      text: color.tagColor,
    },
  } as AnnotationDrawColors;
};
