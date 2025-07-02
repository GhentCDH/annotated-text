import { TEXT_CONFIG_KEYS, TEXT_CONFIG_VALUES } from "../../adapter/text";
import { ErrorEventCallback, EventCallback } from "../../events";
import {
  ANNOTATION_CONFIG_KEYS,
  ANNOTATION_CONFIG_VALUES,
} from "../../adapter/annotation";
import { EventListenerType } from "../../events/event.listener";
import { AnnotationId } from "../../model";

/**
 * Create annotation is a factory function that creates an annotation model.
 * Use this model to manage annotations and text, every change related to the visualization should be done through this function.
 */
export type AnnotatedText<ANNOTATION> = {
  /**
   * Set the text for the model. The adapter will parse the text to the internal model.
   * @param text
   * @param redraw
   */
  setText: (text: string, redraw?: boolean) => AnnotatedText<ANNOTATION>;
  /**
   * Set the annotations for the model. The adapter will parse the annotations to the internal model
   * @param annotations
   * @param redraw If true, the annotations will be redrawn.
   */
  setAnnotations: (
    annotations: ANNOTATION[],
    redraw?: boolean,
  ) => AnnotatedText<ANNOTATION>;
  /**
   * Highlight annotations by their IDs.
   * @param ids
   */
  highlightAnnotations: (ids: string[]) => AnnotatedText<ANNOTATION>;
  /**
   * A list of selected annotations, if this is handled outside the model,
   * @param ids
   */
  selectAnnotations: (ids: string[]) => AnnotatedText<ANNOTATION>;
  /**
   * Register an event listener for the annotation model.
   * @param event
   * @param callback
   */
  on: (
    event: EventListenerType,
    callback: EventCallback,
  ) => AnnotatedText<ANNOTATION>;
  /**
   * Register an error callback that will be called when an error occurs in the annotation model.
   * @param callback
   */
  onError: (callback: ErrorEventCallback) => AnnotatedText<ANNOTATION>;
  /**
   * Destroy the annotation model and all associated resources.
   * Important: this will remove all event listeners and the SVG element from the DOM.
   */
  destroy: () => AnnotatedText<ANNOTATION>;
  /**
   * Change the configuration of the textadapter. If needed, it will recreate the annotation model.
   * @param key
   * @param value
   */
  changeTextAdapterConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ): AnnotatedText<ANNOTATION> /**
   * Change the configuration of the textadapter. If needed, it will recreate the annotation model.
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
  scrollToAnnotation: (id: AnnotationId) => AnnotatedText<ANNOTATION>;
};
