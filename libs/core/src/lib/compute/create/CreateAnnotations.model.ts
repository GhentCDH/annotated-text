import { type AnnotationId, type BaseAnnotation } from '../../model';
import { Snapper, type TEXT_CONFIG_KEYS, type TEXT_CONFIG_VALUES } from '../../adapter/text';
import { type AnnotationEventType, type ErrorEventCallback, type EventCallback } from '../../events';
import { type ANNOTATION_CONFIG_KEYS, type ANNOTATION_CONFIG_VALUES } from '../../adapter/annotation';
import { type AnnotationRender, type AnnotationRenderStyle } from '../../adapter/annotation/renderer/annotation-render';
import { type AnnotationStyle } from '../../adapter/annotation/style/annotation.style';
import { type tagLabelFn } from '../../tag/TagRenderer';

/**
 * Create annotation is a factory function that creates an annotation model.
 * Use this model to manage annotations and text, every change related to the visualization should be done through this function.
 */
export interface AnnotatedText<ANNOTATION extends BaseAnnotation> {
  /**
   * Set the text for the model. The adapter will parse the text to the internal model.
   * @param text
   */
  setText: (text: string) => this;
  /**
   * Set the snapper for the model. The snapper will be used to snap the annotations to the text. This is useful when you want to allow users to create annotations by dragging on the text, and you want to snap the annotations to the nearest word or character.
   * @param snapper
   */
  setSnapper: (snapper: Snapper) => this;
  /**
   * Set the function to get the tag label from an annotation. This is used by the tag renderer to get the label for the tag.
   * @param tagFn
   */
  setTagLabelFn: (tagFn: tagLabelFn<ANNOTATION> | null) => this;

  /**
   * Set the annotations for the model. The adapter will parse the annotations to the internal model
   * @param annotations
   */
  setAnnotations: (annotations: ANNOTATION[]) => this;

  /**
   * Add a single annotation to the model. If you update the complete list of annotations, on a large set than it can start hanging.
   * If the annotation with this id already exists, it will update the annotation.
   *
   * @param annotation
   */
  addAnnotation: (annotation: ANNOTATION) => this;

  /**
   * Update an existing annotation in the model.
   * If the annotation with this id does not exist, it will add the annotation.
   *
   */
  updateAnnotation: (id: AnnotationId, annotation: ANNOTATION) => this;

  /**
   * Delete an existing annotation in the model.
   *
   */
  deleteAnnotation: (id: AnnotationId) => this;

  /**
   * Highlight annotations by their IDs.
   * @param ids
   */
  highlightAnnotations: (ids: AnnotationId[]) => this;
  /**
   * A list of selected annotations, if this is handled outside the model,
   * @param ids
   */
  selectAnnotations: (ids: AnnotationId[]) => this;
  /**
   * Register an event listener for the annotation model.
   * @param event
   * @param callback
   */
  on: <EVENT extends AnnotationEventType<ANNOTATION>>(
    event: EVENT,
    callback: EventCallback<EVENT, ANNOTATION>,
  ) => this;
  /**
   * Register an error callback that will be called when an error occurs in the annotation model.
   * @param callback
   */
  onError: (callback: ErrorEventCallback) => this;
  /**
   * Destroy the annotation model and all associated resources.
   * Important: this will remove all event listeners and the SVG element from the DOM.
   */
  destroy: () => this;

  /**
   * Change the configuration of the textAdapter. If needed, it will recreate the annotation model.
   * @param key
   * @param value
   */
  changeTextAdapterConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ): AnnotatedText<ANNOTATION> /**
   * Change the configuration of the textAdapter. If needed, it will recreate the annotation model.
   * @param key
   * @param value
   */;

  changeAnnotationAdapterConfig<KEY extends ANNOTATION_CONFIG_KEYS>(
    key: KEY,
    value: ANNOTATION_CONFIG_VALUES<KEY>,
  ): AnnotatedText<ANNOTATION>;

  /**
   * Scroll to the annotation with the given ID.
   *
   * @param id
   */
  scrollToAnnotation: (id: AnnotationId) => this;
  /**
   * Registers a single annotation renderer.
   *
   * @template STYLE - The render style type extending AnnotationRenderStyle
   * @param render - The renderer instance to register
   * @returns The annotated text instance for method chaining
   *
   * @example
   * createAnnotatedText(containerId, config)
   *   .registerRender(new HighlightAnnotationRender());
   */
  registerRender: <STYLE extends AnnotationRenderStyle>(
    render: AnnotationRender<STYLE>,
  ) => this;
  /**
   * Registers multiple annotation renderers at once.
   *
   * @param renders - The renderer instances to register
   * @returns The annotated text instance for method chaining
   *
   * @example
   * createAnnotatedText(containerId, config)
   *   .registerRenders(
   *     new GutterAnnotationRender(),
   *     new UnderLineAnnotationRender()
   *   );
   */
  registerRenders: (...render: AnnotationRender<any>[]) => this;
  /**
   * Updates the style of a registered renderer.
   *
   * @template STYLE - The render style type extending AnnotationRenderStyle
   * @param name - The name/key of the registered renderer to update
   * @param style - Partial style object with properties to update
   * @returns The annotated text instance for method chaining
   *
   * @example
   * createAnnotatedText(containerId, config)
   *   .registerRender(new UnderLineAnnotationRender())
   *   .updateRenderStyle("underline", { strokeWidth: 2 });
   */
  updateRenderStyle: <STYLE extends AnnotationRenderStyle>(
    name: string,
    style: Partial<STYLE>,
  ) => this;
  /**
   * Registers a single named annotation style.
   *
   * @param name - The unique name/key for the style
   * @param style - The annotation style configuration
   * @returns The annotated text instance for method chaining
   *
   * @example
   * createAnnotatedText(containerId, config)
   *   .registerStyle("style-error", {
   *     color: createAnnotationColor("#ff3b3b")
   *   });
   */
  registerStyle: (name: string, style: AnnotationStyle) => this;
  /**
   * Registers multiple named annotation styles at once.
   *
   * @param styles - An object mapping style names to their configurations
   * @returns The annotated text instance for method chaining
   *
   * @example
   * createAnnotatedText(containerId, config)
   *   .registerStyles({
   *     "style-error": { color: createAnnotationColor("#ff3b3b") },
   *     "style-warning": { color: createAnnotationColor("#ff9800") },
   *     "style-info": { color: createAnnotationColor("#2196f3") }
   *   });
   */
  registerStyles: (styles: Record<string, AnnotationStyle>) => this;
}
