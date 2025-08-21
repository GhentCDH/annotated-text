import {
  AnnotationAdapter,
  type TextAnnotation,
} from "@ghentcdh/vue-component-annotated-text";
import { AnnotationDrawColor } from "../annotation.model";

export const getColors = (
  adapter: AnnotationAdapter<any>,
  annotation: TextAnnotation,
  borders = true,
) => {
  const hoverColor = adapter.config.hover.color;
  const editColor = adapter.config.edit.color;
  const color = adapter.color(annotation);

  return {
    default: {
      fill: color.background,
      border: borders ? color.border : undefined,
    } as AnnotationDrawColor,
    hover: hoverColor,
    edit: {
      fill: color.background,
      border: borders ? editColor.border : undefined,
    },
    active: {
      fill: color.backgroundActive,
      border: borders ? color.borderActive : undefined,
    } as AnnotationDrawColor,
  };
};
