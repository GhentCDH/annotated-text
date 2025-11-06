import { cloneDeep } from "lodash-es";
import { createTextAnnotationRender } from "./TextAnnotationRender";
import {
  AnnotationRender,
  AnnotationRenderParams,
  AnnotationStyle,
  DefaultAnnotationStyle,
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

export type UnderlineAnnotationStyle = AnnotationStyle & {};
export const DefaultUnderlineAnnotationStyle: UnderlineAnnotationStyle = {
  ...cloneDeep(DefaultAnnotationStyle),
};

export class UnderLineAnnotationRender extends AnnotationRender<UnderlineAnnotationStyle> {
  readonly weightOrder: number = 2;
  readonly isGutter: boolean = false;

  static instance = "underline";
  readonly name = UnderLineAnnotationRender.instance;

  constructor() {
    super(DefaultUnderlineAnnotationStyle);
  }

  render(
    params: AnnotationRenderParams,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    const { draws, startPosition, color } = createTextAnnotationRender(
      params,
      this.style,
      parentDimensions,
      annotation,
      createUnderline,
      getColorsUnderline,
    );

    return { draws, isGutter: false, startPosition, color };
  }
}
