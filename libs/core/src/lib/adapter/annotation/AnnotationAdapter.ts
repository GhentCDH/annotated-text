import { cloneDeep, merge } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import {
  DefaultRenders,
  GutterAnnotationRender,
  HighlightAnnotationRender,
  UnderLineAnnotationRender
} from './renderer';
import { type RenderParams } from './renderer/annotation-render';
import { DefaultTagConfig, type TagConfig } from './DefaultTag';
import { RenderInstances } from './renderer/render-instances';
import { StyleInstances } from './style/style-instances';
import { type AnnotationStyleParams } from './style';
import { AnnotationCache } from './AnnotationCache';
import { BaseAdapter } from '../BaseAdapter';
import { createAnnotationColor } from '../../utils/createAnnotationColor';
import {
  type Annotation,
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  annotationDrawMetadataSchema,
  type AnnotationId,
  renderSchema,
  renderStyleSchema,
  type TextAnnotation,
  textAnnotationSchema,
  type TextLine
} from '../../model';

import type { Snapper } from '../text';
import { DefaultSnapper } from '../text';
import { type DeepPartial } from '../../deep-partial.type';

/**
 * @deprecated
 */
const config = {
  text: {
    // Width of the handle used to resize annotations
    handleRadius: 6,
  },
};
export type AnnotationConfig = typeof config;

export abstract class AnnotationAdapter<ANNOTATION> extends BaseAdapter {
  private readonly annotationCache = new AnnotationCache<ANNOTATION>();
  /**
   * If true, creation of annotations is enabled.
   * @param params
   */
  public create = false;
  /**
   * If true, edit of annotations is enabled.
   * @param params
   */
  public edit = false;

  /**
   * Configuration for styling the annotations, can be used to override default styles.
   */
  public config?: AnnotationConfig;
  public tagConfig: TagConfig<ANNOTATION>;
  public renderInstance: RenderInstances<ANNOTATION>;
  public styleInstance: StyleInstances<ANNOTATION>;

  protected text = '';
  protected offsetStart = 0;
  /**
   * Use a word snapper function to adjust the start and end indices of an annotation.
   * @param action
   * @param annotation
   */
  public snapper: Snapper = new DefaultSnapper();

  public setText(text: string, offsetStart: number) {
    this.text = text;
    this.offsetStart = offsetStart;
    this.snapper.setText(text, offsetStart);
  }

  /**
   * Parse an annotation object into a TextAnnotation.
   * @param annotation
   */
  abstract _parse(annotation: ANNOTATION): Annotation | null;

  public parse(annotation: ANNOTATION): TextAnnotation | null {
    const parsedAnnotation = this._parse(annotation);

    if (!parsedAnnotation) return null;

    const renderInstance = this.renderInstance.getRenderer(annotation);

    const style = renderStyleSchema.parse({
      renderStyle: renderInstance.style,
      ...renderInstance.style,
      ...this.styleInstance.getStyle(annotation),
    });

    const renderParams = renderSchema.parse({
      weight: undefined,
      isGutter: renderInstance.isGutter,
      render: renderInstance.name,
      style: style,
    });

    const _drawMetadata = annotationDrawMetadataSchema.parse({});

    const textAnnotation = textAnnotationSchema.parse({
      ...parsedAnnotation,
      _render: renderParams,
      _drawMetadata,
    });

    this.addAnnotation(parsedAnnotation.id, annotation, textAnnotation);

    return textAnnotation;
  }

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
   * Get the tag label of the annotation, it uses the tag function to determine the tag label.
   * @param annotation
   */
  tagLabel(annotation: Pick<TextAnnotation, 'id'>) {
    return this.tagConfig.tagFn(this.getOriginalAnnotation(annotation.id));
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
  createAnnotation(characterPos: number): TextAnnotation {
    const renderInstance = this.renderInstance.highlightInstance;

    const style = renderStyleSchema.parse({
      color: createAnnotationColor('#f51720'),
      renderStyle: renderInstance.style,
    });

    const renderParams = renderSchema.parse({
      weight: 0,
      isGutter: renderInstance.isGutter,
      render: renderInstance.name,
      style: style,
    });
    const _drawMetadata = annotationDrawMetadataSchema.parse({});

    return textAnnotationSchema.parse({
      _render: renderParams,
      _drawMetadata,
      id: uuidv4(),
      start: characterPos,
      end: characterPos + 1,
    });
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
      case 'edit':
        this.edit = value as boolean;
        break;
      case 'create':
        this.create = value as boolean;
        break;
      case 'config':
        this.config = merge(cloneDeep(config), value);
        this.changeConfig();
        break;
      case 'snapper':
        this.snapper = value as Snapper;
        this.snapper.setText(this.text, this.offsetStart);
        break;
      default:
        console.warn('Unsupported config key:', value);
      // super.setConfig(value, key);
    }
  }

  // @region annotation  cache
  protected getOriginalAnnotation(annotationId: AnnotationId): ANNOTATION {
    return this.annotationCache.getOriginalAnnotation(annotationId);
  }

  getAnnotation(annotationId: AnnotationId) {
    return this.annotationCache.getParsedAnnotation(annotationId);
  }

  addDrawAnnotations(
    annotationUuid: AnnotationId,
    annotations: AnnotationDraw[],
    dimensions: AnnotationDimension,
    color: AnnotationDrawColors,
  ) {
    return this.annotationCache.addDrawAnnotations(
      annotationUuid,
      annotations,
      dimensions,
      color,
    );
  }

  protected addAnnotation(
    annotationId: AnnotationId,
    originalAnnotation: ANNOTATION,
    parsedAnnotation: TextAnnotation,
  ) {
    this.annotationCache.addAnnotation(
      annotationId,
      originalAnnotation,
      parsedAnnotation,
    );
  }

  clear() {
    this.annotationCache.clear();
  }

  clearDraws() {
    return this.annotationCache.clearDrawAnnotation();
  }

  annotations = this.annotationCache.getAnnotationsSortedBy;

  calculateWeights(lines: TextLine[]) {
    return this.annotationCache.calculateWeights(lines, this.renderInstance);
  }

  get gutter() {
    return this.annotationCache.gutter;
  }

  get position() {
    return this.annotationCache.positions;
  }

  // @endregion annotation  cache
}

type CONFIG = InstanceType<typeof AnnotationAdapter>;
export type ANNOTATION_CONFIG_KEYS = keyof CONFIG;
export type ANNOTATION_CONFIG_VALUES<K extends ANNOTATION_CONFIG_KEYS> =
  CONFIG[K];

export type createAnnotationAdapterParams<ANNOTATION> = {
  create?: boolean;
  edit?: boolean;
  config?: DeepPartial<AnnotationConfig>;
  snapper?: Snapper;
  tagConfig?: Partial<TagConfig<ANNOTATION>>;
  render?: Partial<RenderParams<ANNOTATION>>;
  style?: Partial<AnnotationStyleParams<ANNOTATION>>;
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
  adapter.tagConfig = merge(
    cloneDeep(DefaultTagConfig),
    params.tagConfig ?? {},
  );

  const renderInstance = new RenderInstances(params.render);

  // by default the default renderers are registered
  renderInstance.registerRender(
    new HighlightAnnotationRender(DefaultRenders.highlight),
  );
  renderInstance.registerRender(
    new GutterAnnotationRender(DefaultRenders.gutter),
  );
  renderInstance.registerRender(
    new UnderLineAnnotationRender(DefaultRenders.underline),
  );

  adapter.renderInstance = renderInstance;

  adapter.styleInstance = new StyleInstances<ANNOTATION>(params.style);

  return adapter;
};
