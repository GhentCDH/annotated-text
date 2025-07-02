import { TEXT_CONFIG_KEYS, TEXT_CONFIG_VALUES } from "../../adapter/text";
import { ErrorEventCallback, EventCallback } from "../../events";
import {
  ANNOTATION_CONFIG_KEYS,
  ANNOTATION_CONFIG_VALUES,
} from "../../adapter/annotation";
import { EventListenerType } from "../../events/event.listener";

export type CreateAnnotations<ANNOTATION> = {
  setText: (text: string, redraw?: boolean) => CreateAnnotations<ANNOTATION>;
  setAnnotations: (
    annotations: ANNOTATION[],
    redraw?: boolean,
  ) => CreateAnnotations<ANNOTATION>;
  highlightAnnotations: (ids: string[]) => CreateAnnotations<ANNOTATION>;
  selectAnnotations: (ids: string[]) => CreateAnnotations<ANNOTATION>;
  on: (
    event: EventListenerType,
    callback: EventCallback,
  ) => CreateAnnotations<ANNOTATION>;
  onError: (callback: ErrorEventCallback) => CreateAnnotations<ANNOTATION>;
  destroy: () => CreateAnnotations<ANNOTATION>;
  /**
   * Change the configuration of the textadapter. If needed, it will recreate the annotation model.
   * @param key
   * @param value
   */
  changeTextAdapterConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ): CreateAnnotations<ANNOTATION> /**
   * Change the configuration of the textadapter. If needed, it will recreate the annotation model.
   * @param key
   * @param value
   */;
  changeAnnotationAdapterConfig<KEY extends ANNOTATION_CONFIG_KEYS>(
    key: KEY,
    value: ANNOTATION_CONFIG_VALUES<KEY>,
  ): CreateAnnotations<ANNOTATION>;
};
