import { AnnotationDrawColors, TextAnnotation } from '../../model';
import { AnnotationRenderStyle } from '../../adapter/annotation/renderer';

export type GetColorsFn<STYLE extends AnnotationRenderStyle> = (
  style: STYLE,
  annotation: TextAnnotation,
  borders: boolean,
) => AnnotationDrawColors;

export const getColors: GetColorsFn<any> = (
  style: any,
  annotation: TextAnnotation,
  borders = true,
) => {
  const hoverColor = style.hover.color;
  const editColor = style.edit.color;
  const color = annotation._render.style.color;

  return {
    default: {
      fill: color.background,
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
