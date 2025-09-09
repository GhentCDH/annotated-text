import { TextAnnotation, TextLine } from "../../model";
import { GetColorsFn } from "./colors";
import {
  AnnotationDrawColor,
  AnnotationDrawColors,
  TextAnnotationModel,
} from "../annotation.model";
import { AnnotationRender } from "../../adapter/annotation/DefaultAnnotationRender";
import {
  createAnnotationFill,
  createAnnotationPathFn,
  PathParams,
} from "../utils/create-path";
import { TextAdapter } from "../../adapter/text";
import { AnnotationAdapter } from "../../adapter/annotation";
import { createTextAnnotationRender } from "./TextAnnotationRender";

export const getColorsUnderline: GetColorsFn = (
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
      fill: "rgba(0,0,0,0)",
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
    tag: {
      fill: color.tagBackground,
      border: color.border,
      text: color.tagColor,
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

export const UnderLineAnnotationRender: AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const { draws, startPosition, color } = createTextAnnotationRender(
    lines,
    parentDimensions,
    model,
    annotation,
    textAdapter,
    annotationAdapter,
    createUnderline,
    getColorsUnderline,
  );

  return { draws, isGutter: false, startPosition, color };
};
