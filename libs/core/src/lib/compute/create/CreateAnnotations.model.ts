import { BaseAnnotation } from "./CreateAnnotations";
import { TEXT_CONFIG_KEYS, TEXT_CONFIG_VALUES } from "../../adapter/text";
import { ErrorEventCallback, EventCallback } from "../../events";
import { ANNOTATION_CONFIG_KEYS, ANNOTATION_CONFIG_VALUES } from "../../adapter/annotation";
import { EventListenerType } from "../../events/event.listener";
import { AnnotationId } from "../../model";
import { AnnotationRender, AnnotationStyle } from "../../adapter/annotation/renderer/annotation-render";

/**
 * Create annotation is a factory function that creates an annotation model.
 * Use this model to manage annotations and text, every change related to the visualization should be done through this function.
 */
export interface AnnotatedText<ANNOTATION extends BaseAnnotation> {
  /**
   * Set the text for the model. The adapter will parse the text to the internal model.
   * @param text
   * @param redraw
   */
  setText: (text: string, redraw?: boolean) => this;
  /**
   * Set the annotations for the model. The adapter will parse the annotations to the internal model
   * @param annotations
   * @param redraw If true, the annotations will be redrawn.
   */
  setAnnotations: (annotations: ANNOTATION[], redraw?: boolean) => this;

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
  on: (event: EventListenerType, callback: EventCallback) => this;
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

  registerRender: <STYLE extends AnnotationStyle>(
    render: AnnotationRender<STYLE>,
  ) => this;

  updateRenderStyle: <STYLE extends AnnotationStyle>(
    name: string,
    style: Partial<STYLE>,
  ) => this;
}
