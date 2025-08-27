import { AnnotationAdapter } from "../../adapter";
import { TextAnnotation } from "../../model";
import { AnnotationDrawColors } from "../annotation.model";

export type GetColorsFn = (
  adapter: AnnotationAdapter<any>,
  annotation: TextAnnotation,
  borders: boolean,
) => AnnotationDrawColors;

export const getColors: GetColorsFn = (
  adapter: AnnotationAdapter<any>,
  annotation: TextAnnotation,
  borders = true,
) => {
  const config = adapter.config!;
  const hoverColor = config.hover.color;
  const editColor = config.edit.color;
  const color = adapter.color(annotation);

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
  };
};
