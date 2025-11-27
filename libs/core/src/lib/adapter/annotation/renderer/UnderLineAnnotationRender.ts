import { cloneDeep } from "lodash-es";
import { createTextAnnotationRender } from "./TextAnnotationRender";
import {
  AnnotationRender,
  AnnotationRenderParams,
  AnnotationStyle,
  DefaultTextAnnotationStyle,
} from "./annotation-render";
import {
  AnnotationDrawColor,
  AnnotationDrawColors,
  TextAnnotation,
} from "../../../model";
import { GetColorsFn } from "../../../compute/compute/colors";
import {
  createAnnotationFill,
  createAnnotationPathFn,
  PathParams,
} from "../../../compute/utils/create-path";

export const getColorsUnderline: GetColorsFn = (
  style: AnnotationStyle,
  annotation: TextAnnotation,
  borders = true,
) => {
  const hoverColor = style.hover.color;
  const editColor = style.edit.color;
  const color = annotation._render.style.color;

  return {
    default: {
      fill: "rgba(0,0,0,0)",
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

export const DefaultUnderlineAnnotationStyle = {
  ...cloneDeep(DefaultTextAnnotationStyle),
};
export type UnderlineAnnotationStyle = typeof DefaultUnderlineAnnotationStyle;

export class UnderLineAnnotationRender extends AnnotationRender<UnderlineAnnotationStyle> {
  readonly weightOrder: number = 2;
  readonly isGutter: boolean = false;

  static instance = "underline";
  readonly name = UnderLineAnnotationRender.instance;

  constructor() {
    super(DefaultUnderlineAnnotationStyle);
  }

  createDraws(
    params: AnnotationRenderParams,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    return createTextAnnotationRender(
      params,
      this.style,
      parentDimensions,
      annotation,
      createUnderline,
      getColorsUnderline,
    );
  }
}
