import { cloneDeep, merge } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { ColorFn, DefaultAnnotationColor } from "./DefaultAnnotationColor";
import { DefaultAnnotationGutter, GutterFn } from "./DefaultAnnotationGutter";
import {
  AnnotationRenderFn,
  DefaultAnnotationRender,
  DefaultRenders,
} from "./DefaultAnnotationRender";
import { BaseAdapter } from "../BaseAdapter";
import { createAnnotationColor } from "../../utils/createAnnotationColor";
import { Annotation, AnnotationId, type TextAnnotation } from "../../model";

import type { Snapper } from "../text";
import { DefaultSnapper } from "../text";

const config = {
  gutter: {
    width: 3,
    gap: 6,
  },
  text: {
    padding: 6,
    lineHeight: 22,
    borderRadius: 6,
    border: 2,
    handleRadius: 6,
  },
  edit: {
    color: {
      border: "rgba(255,0,0,0.9)",
    },
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
  protected readonly originalAnnotations = new Map<AnnotationId, ANNOTATION>();

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
  public config?: AnnotationConfig;
  public colorFn = DefaultAnnotationColor;
  public gutterFn = DefaultAnnotationGutter;
  public renderFn = DefaultAnnotationRender;
  public tagConfig: TagConfig;
  public defaultRender: DefaultRenders;

  protected text: string = "";

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
  abstract parse(annotation: ANNOTATION): TextAnnotation | null;

  /**
   * Format a TextAnnotation into an annotation object.
   * @param annotation
   * @param textSelection
   * @param isNew
   * @param hasChanged - if the annotation has changes then create the annotation again, otherwise return the original annotation that has been cached.
   */
  abstract format(
    annotation: TextAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): ANNOTATION | null;

  /**
   * Get the color of the annotation, it uses the color function to determine the color.
   * By default it uses the DefaultAnnotationColor function, which returns the color field of on the annotation.
   * If not provided it will render a color.
   * @param annotation
   */
  color(annotation: TextAnnotation) {
    return this.colorFn(this.getAnnotation(annotation.id));
  }

  isGutter(annotation: TextAnnotation) {
    return this.gutterFn(this.getAnnotation(annotation.id));
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
        this.create = value as boolean;
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

  addAnnotation(annotationId: AnnotationId, originalAnnotation: ANNOTATION) {
    this.originalAnnotations.set(annotationId, originalAnnotation);
  }

  getAnnotation(annotationId: AnnotationId): ANNOTATION {
    return this.originalAnnotations.get(annotationId) as ANNOTATION;
  }
}

type CONFIG = InstanceType<typeof AnnotationAdapter>;
export type ANNOTATION_CONFIG_KEYS = keyof CONFIG;
export type ANNOTATION_CONFIG_VALUES<K extends ANNOTATION_CONFIG_KEYS> =
  CONFIG[K];

export type TagConfig = {
  /**
   * If true, tags are enabled and will be rendered, when hovering over an annotation.
   * @default false
   */
  enabledOnHover?: boolean;
  /**
   * If true, tags are always enabled and will be rendered.
   * @default false
   */
  enabled: boolean;
  /**
   * Function to get the tag string from an annotation.
   * @param annotation
   */
  tagFn: (annotation: ANNOTATION) => string;
};

export type createAnnotationAdapterParams<ANNOTATION> = {
  create?: boolean;
  edit?: boolean;
  config?: Partial<AnnotationConfig>;
  snapper?: Snapper;
  colorFn?: ColorFn<ANNOTATION>;
  gutterFn?: GutterFn<ANNOTATION>;
  renderFn?: AnnotationRenderFn<ANNOTATION>;
  defaultRender?: DefaultRenders;
  tags?: TagConfig;
};

export const createAnnotationAdapter = <ANNOTATION>(
  adapter: AnnotationAdapter<ANNOTATION>,
  params: createAnnotationAdapterParams<ANNOTATION>,
): AnnotationAdapter<ANNOTATION> => {
  if (params.edit) {
    adapter.edit = params.edit;
  }
  if (params.create) {
    adapter.create = params.create;
  }
  adapter.config = merge(cloneDeep(config), params.config);
  adapter.snapper = params.snapper ?? new DefaultSnapper();
  adapter.colorFn = params.colorFn ?? (DefaultAnnotationColor as any);
  adapter.gutterFn = params.gutterFn ?? (DefaultAnnotationGutter as any);
  adapter.defaultRender = params.defaultRender ?? "highlight";
  adapter.renderFn = params.renderFn ?? (DefaultAnnotationRender as any);
  adapter.tag = params.tags ?? {
    enabledOnHover: false,
    enabled: false,
    tagFn: () => "",
  };

  return adapter;
};
