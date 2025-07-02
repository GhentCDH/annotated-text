import { cloneDeep, merge } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { BaseAdapter } from "../BaseAdapter";
import { createAnnotationColor } from "../../utils/createAnnotationColor";
import type { Annotation, TextAnnotation } from "../../model";

import type { Snapper } from "../text/snapper";
import { DefaultSnapper } from "../text/snapper";

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
  /**
   * If true, creation of annotations is enabled.
   * @param params
   */
  public create: boolean = false;
  /**
   * If true, edit of annotations is enabled.
   * @param params
   */
  public edit: boolean = false;
  /**
   * Configuration for styling the annotations, can be used to override default styles.
   */
  public config: AnnotationConfig;

  protected text: string;

  /**
   * Use a word snapper function to adjust the start and end indices of an annotation.
   * @param action
   * @param annotation
   */
  public snapper: Snapper = new DefaultSnapper();

  public setText(text: string) {
    this.text = text;
    this.snapper.setText(text);
  }

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
  abstract format(annotation: TextAnnotation, isNew: boolean): ANNOTATION;

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

  /**
   * Change the configuration of the adapter, it will update the eventlistener if rerendering of the annotations is needed.
   * f.e. if the text direction changes, the adapter will emit a change event to update the annotations.
   * @param key
   * @param value
   */
  setConfig<KEY extends ANNOTATION_CONFIG_KEYS>(
    key: KEY,
    value: ANNOTATION_CONFIG_VALUES<KEY>,
  ) {
    switch (key) {
      case "edit":
        this.edit = value as boolean;
        break;
      case "create":
        this.edit = value as boolean;
        break;
      case "config":
        this.config = merge(cloneDeep(config), value);
        this.changeConfig();
        break;
      case "snapper":
        this.snapper = value as Snapper;
        this.snapper.setText(this.text);
        break;
      default:
        console.warn("Unsupported config key:", value);
      // super.setConfig(value, key);
    }
  }
}

type CONFIG = InstanceType<typeof AnnotationAdapter>;
export type ANNOTATION_CONFIG_KEYS = keyof CONFIG;
export type ANNOTATION_CONFIG_VALUES<K extends ANNOTATION_CONFIG_KEYS> =
  CONFIG[K];

export type createAnnotationAdapterParams = {
  create?: boolean;
  edit?: boolean;
  config?: Partial<AnnotationConfig>;
  snapper?: Snapper;
};

export const createAnnotationAdapter = <ANNOTATION>(
  adapter: AnnotationAdapter<ANNOTATION>,
  params: createAnnotationAdapterParams,
): AnnotationAdapter<ANNOTATION> => {
  if (params.edit) {
    adapter.edit = params.edit;
  }
  if (params.create) {
    adapter.create = params.create;
  }
  adapter.config = merge(cloneDeep(config), params.config);
  adapter.snapper = params.snapper ?? new DefaultSnapper();

  return adapter;
};
