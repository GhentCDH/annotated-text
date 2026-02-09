import { cloneDeep, merge } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { type RenderParams } from './renderer/annotation-render';
import { StyleInstances } from './style/style-instances';
import { type AnnotationStyleParams } from './style';
import { AnnotationCache } from './AnnotationCache';
import { RenderInstances } from './renderer/render-instances';
import { BaseAdapter } from '../BaseAdapter';
import { createAnnotationColor } from '../../utils/createAnnotationColor';
import {
  type Annotation,
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  annotationDrawMetadataSchema,
  type AnnotationId,
  type BaseAnnotation,
  renderSchema,
  renderStyleSchema,
  type TextAnnotation,
  textAnnotationSchema,
  type TextLine
} from '../../model';
import { type DeepPartial } from '../../deep-partial.type';
import { type AnnotationModule } from '../../di/annotation.module';
import { TagRenderer } from '../../tag/TagRenderer';
import { Snapper, SnapperToken } from '../text';

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

export const AnnotationAdapterToken = 'ANNOTATION_ADAPTER';

export abstract class AnnotationAdapter<
  ANNOTATION extends BaseAnnotation,
> extends BaseAdapter {
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
  public renderParams: Partial<RenderParams<ANNOTATION>>;
  public styleInstance: StyleInstances<ANNOTATION>;
  private tagRenderer: TagRenderer<ANNOTATION>;

  protected text = '';
  startOffset = 0;

  public setText(text: string) {
    this.text = text;
    this.annotationModule
      .inject<Snapper>(SnapperToken)
      .setText(text, this.startOffset);
  }

  /**
   * Parse an annotation object into a TextAnnotation.
   * @param annotation
   */
  abstract _parse(annotation: ANNOTATION): Annotation | null;

  protected renderInstance: RenderInstances<ANNOTATION>;

  override setModule(module: AnnotationModule) {
    super.setModule(module);
    this.renderInstance =
      this.inject<RenderInstances<ANNOTATION>>(RenderInstances);
    this.tagRenderer = this.inject<TagRenderer<ANNOTATION>>(TagRenderer);
  }

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
      _tagMetadata: this.tagRenderer.getTagConfig(annotation, renderInstance),
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
      default:
        console.warn('Unsupported config key:', value);
      // super.setConfig(value, key);
    }
  }

  // @region annotation  cache
  getOriginalAnnotation(annotationId: AnnotationId): ANNOTATION {
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
  /**
   * Custom offset for text character indexing.
   *
   * By default, text uses zero-based indexing (starting at 0), which is standard in programming.
   * However, many scholarly and editorial workflows reference text positions starting from 1.
   * This option allows you to configure the starting index to match your workflow.
   *
   * @default 0
   *
   * @example
   * // Zero-based indexing (default, programming standard)
   * startOffset: 0  // First character is at position 0
   *
   * @example
   * // One-based indexing (scholarly/editorial standard)
   * startOffset: 1  // First character is at position 1
   *
   * @example
   * // Custom offset (e.g., continuing from a previous section)
   * startOffset: 100  // First character is at position 100
   */
  startOffset?: number;
  render?: Partial<RenderParams<ANNOTATION>>;
  style?: Partial<AnnotationStyleParams<ANNOTATION>>;
};

export const createAnnotationAdapter = <ANNOTATION extends BaseAnnotation>(
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
  adapter.startOffset = params.startOffset ?? 0;
  adapter.renderParams = params.render ?? {};

  adapter.styleInstance = new StyleInstances<ANNOTATION>(params.style);

  return adapter;
};
