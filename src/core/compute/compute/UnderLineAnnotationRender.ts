import {
  AnnotationAdapter,
  TextAdapter,
  TextAnnotation,
  TextLine,
} from "@ghentcdh/vue-component-annotated-text";
import { createTextAnnotationRender } from "./TextAnnotationRender";
import { GetColorsFn } from "./colors";
import { AnnotationDrawColor, TextAnnotationModel } from "../annotation.model";
import { AnnotationRender } from "../../adapter/annotation/DefaultAnnotationRender";
import {
  createAnnotationFill,
  createAnnotationPathFn,
  PathParams,
} from "../utils/create-path";

export const getColorsUnderline: GetColorsFn = (
  adapter: AnnotationAdapter<any>,
  annotation: TextAnnotation,
  borders = true,
) => {
  const hoverColor = adapter.config.hover.color;
  const editColor = adapter.config.edit.color;
  const color = adapter.color(annotation);
  return {
    default: {
      fill: "rgba(0,0,0,0) ",
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

const createUnderline: createAnnotationPathFn = (params: PathParams) => {
  const fill = createAnnotationFill(params);
  const { x, y, height, width } = params;
  return {
    border: [
      // move to top-left
      `M ${x} ${y + height} h ${width}`,
    ],
    fill,
  };
};

export const UnderLineAnnotationRender: AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const draws = createTextAnnotationRender(
    lines,
    parentDimensions,
    model,
    annotation,
    textAdapter,
    annotationAdapter,
    createUnderline,
    getColorsUnderline,
  );

  return { draws, isGutter: false };
};
