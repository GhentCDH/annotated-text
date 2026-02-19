import { cloneDeep, merge } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { StyleInstances } from './style/style-instances';
import { AnnotationCache } from './AnnotationCache';
import { RenderInstances } from './renderer/render-instances';
import { BaseAdapter } from '../BaseAdapter';
import {
  type Annotation,
  type AnnotationDimension,
  type AnnotationDraw,
  annotationDrawMetadataSchema,
  type AnnotationId,
  type BaseAnnotation,
  renderSchema,
  styleSchema,
  type TextAnnotation,
  textAnnotationSchema,
  type TextLine
} from '../../model';
import { type DeepPartial } from '../../deep-partial.type';
import { type AnnotationModule } from '../../di/annotation.module';
import { TagRenderer } from '../../tag/TagRenderer';

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

export abstract class AnnotationAdapter<
  ANNOTATION extends BaseAnnotation,
  PARAMS extends AnnotationAdapterParams = AnnotationAdapterParams,
> extends BaseAdapter<PARAMS> {
  private readonly annotationCache = new AnnotationCache<ANNOTATION>();
  /**
   * If true, creation of annotations is enabled.
   * @param params
   */
  create: boolean;
  /**
   * If true, edit of annotations is enabled.
   * @param params
   */
  edit: boolean;

  /**
   * Configuration for styling the annotations, can be used to override default styles.
   */
  public config?: AnnotationConfig;
  private tagRenderer: TagRenderer<ANNOTATION>;

  protected text = '';
  startOffset: number;

  public setText(text: string) {
    this.text = text;
  }

  /**
   * Parse an annotation object into a TextAnnotation.
   * @param annotation
   */
  abstract _parse(annotation: ANNOTATION): Annotation | null;

  protected renderInstance: RenderInstances<ANNOTATION>;
  protected styleInstance: StyleInstances<ANNOTATION>;

  override setModule(module: AnnotationModule) {
    super.setModule(module);
    this.styleInstance =
      this.inject<StyleInstances<ANNOTATION>>(StyleInstances);
    this.renderInstance =
      this.inject<RenderInstances<ANNOTATION>>(RenderInstances);
    this.tagRenderer = this.inject<TagRenderer<ANNOTATION>>(TagRenderer);
  }

  public parse(annotation: ANNOTATION): TextAnnotation | null {
    const parsedAnnotation = this._parse(annotation);

    if (!parsedAnnotation) return null;

    const renderInstance = this.renderInstance.getRenderer(annotation);

    const renderParams = renderSchema.parse({
      weight: undefined,
      isGutter: renderInstance.isGutter,
      render: renderInstance.name,
    });

    const _drawMetadata = annotationDrawMetadataSchema.parse({});

    const styleInstance = renderInstance.getStyle(annotation);
    const _style = styleSchema.parse(styleInstance);

    const textAnnotation = textAnnotationSchema.parse({
      ...parsedAnnotation,
      _render: renderParams,
      _style,
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
    const styleInstance =
      renderInstance.annotationRenderStyle.getDefaultStyle();

    const renderParams = renderSchema.parse({
      weight: 0,
      isGutter: renderInstance.isGutter,
      render: renderInstance.name,
    });
    const _drawMetadata = annotationDrawMetadataSchema.parse({});
    const _style = styleSchema.parse(styleInstance);

    return textAnnotationSchema.parse({
      _render: renderParams,
      _drawMetadata,
      _style,
      id: uuidv4(),
      start: characterPos,
      end: characterPos + 1,
    });
  }

  override setParams(params: PARAMS) {
    this.edit = params.edit ?? this.edit ?? false;
    this.create = params.create ?? this.create ?? false;
    this.config = merge(cloneDeep(this.config ?? config), params.config);
    this.startOffset = params.startOffset ?? this.startOffset ?? 0;
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
  ) {
    return this.annotationCache.addDrawAnnotations(
      annotationUuid,
      annotations,
      dimensions,
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

export type AnnotationAdapterParams = {
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
};
