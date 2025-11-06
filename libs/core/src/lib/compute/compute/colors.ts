import { AnnotationDrawColors, TextAnnotation } from "../../model";
import { AnnotationStyle } from "../../adapter/annotation/renderer/annotation-render";

export type GetColorsFn = (
  style: AnnotationStyle,
  annotation: TextAnnotation,
  borders: boolean,
) => AnnotationDrawColors;

export const getColors: GetColorsFn = (
  style: AnnotationStyle,
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
    },
    hover: hoverColor,
    edit: {
      fill: color.background,
      border: borders ? editColor.border : undefined,
    },
    active: {
      fill: color.backgroundActive,
      border: borders ? color.borderActive : undefined,
    },
    tag: {
      fill: color.tagBackground,
      border: color.border,
      text: color.tagColor,
    },
  } as AnnotationDrawColors;
};
