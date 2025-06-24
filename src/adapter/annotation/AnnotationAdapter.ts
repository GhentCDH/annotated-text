import { cloneDeep, merge } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { TextAnnotation } from "../../compute/annotation.model";
import { BaseAdapter } from "../BaseAdapter";
import { createAnnotationColor } from "../../utils/createAnnotationColor";
import { Annotation } from "../../types/Annotation";
import { DefaultSnapper, SnapperFn } from "../../snapper/snapper";

const config = {
  gutter: {
    width: 3,
    gap: 6,
  },
  text: {
    padding: 3,
    lineHeight: 22,
    borderRadius: 3,
    border: 2,
    handleRadius: 6,
  },
  hover: {
    color: {
      border: "rgba(100, 100, 100, 0.5)",
      fill: "rgba(1, 1, 1, 0.1)",
    },
  },
};
export type AnnotationConfig = typeof config;

export abstract class AnnotationAdapter<ANNOTATION> extends BaseAdapter {
  public create: boolean = false;
  public edit: boolean = false;
  public config: AnnotationConfig;
  public annotation: Annotation;

  /**
   * Use a word snapper function to adjust the start and end indices of an annotation.
   * @param action
   * @param annotation
   */
  public snapper: SnapperFn = DefaultSnapper;

  /**
   * Parse an annotation object into a TextAnnotation.
   * @param annotation
   */
  abstract parse(annotation: ANNOTATION): TextAnnotation;

  /**
   * Format a TextAnnotation into an annotation object.
   * @param annotation
   * @param textSelection
   * @param isNew
   */
  abstract format(
    annotation: TextAnnotation,
    textSelection: string,
    isNew: boolean,
  ): ANNOTATION;

  /**
   * Enable or disable edit mode
   * @param edit
   */
  enableEdit(edit: boolean = true): this {
    this.edit = edit;

    return this;
  }

  /**
   * Enable or disable create mode
   * @param create
   */
  enableCreate(create: boolean = true): this {
    this.create = create;

    return this;
  }

  /**
   * Get the color of the annotation, by default the annotation.color.
   * If the annotation does not have a color, it will create color
   * @param annotation
   */
  color(annotation: TextAnnotation) {
    return annotation?.color || createAnnotationColor("#4B7BF5");
  }

  /**
   *  If return true, then on hover it becomes the active color
   */
  hover(annotation: Annotation) {
    return true;
  }

  /**
   * Create a new annotation object with default values.
   */
  createAnnotation() {
    return {
      id: uuidv4(),
      isGutter: false,
      color: createAnnotationColor("#f51720"),
    } as TextAnnotation;
  }
}

export type createAnnotationAdapterParams<ANNOTATION> = {
  create?: boolean;
  edit?: boolean;
  config?: AnnotationConfig;
  snapper?: SnapperFn;
};

export const createAnnotationAdapter = <ANNOTATION>(
  adapter: AnnotationAdapter<ANNOTATION>,
  params: createAnnotationAdapterParams<ANNOTATION>,
): AnnotationAdapter<ANNOTATION> => {
  if (params.edit) {
    adapter.enableEdit(params.edit);
  }
  if (params.create) {
    adapter.enableCreate(params.create);
  }
  adapter.config = merge(cloneDeep(config), params.config);
  adapter.snapper = params.snapper ?? DefaultSnapper;

  return adapter;
};
