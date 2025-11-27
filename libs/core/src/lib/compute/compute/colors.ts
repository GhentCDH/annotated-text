import { AnnotationDrawColors, TextAnnotation } from "../../model";
import { TextAnnotationStyle } from "../../adapter/annotation/renderer/annotation-render";

export type GetColorsFn = (
  style: TextAnnotationStyle,
  annotation: TextAnnotation,
  borders: boolean,
) => AnnotationDrawColors;

export const getColors: GetColorsFn = (
  style: TextAnnotationStyle,
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
