import { AnnotationDraw, TextAnnotationModel } from "../annotation.model";
import { AnnotationEventType } from "../events";

export type AnnotationMetadata = () => {
  annotation: AnnotationDraw;
  model: TextAnnotationModel;
};
/**
 * @deprecated use `sendEvent1` instead
 * @param eventMetadata
 * @param event
 * @param mouseEvent
 * @param additionalData
 */
export const sendEvent = (
  eventMetadata: AnnotationMetadata,
  event: AnnotationEventType,
  mouseEvent: MouseEvent,
  additionalData = {},
) => {
  const { annotation, model } = eventMetadata();
  const fullAnnotation = model.getAnnotation(annotation.annotationUuid);

  model.config.onEvent({
    mouseEvent,
    event,
    data: {
      annotation: fullAnnotation,
      ...additionalData,
    },
  });

  return fullAnnotation;
};

export const sendEvent1 = (
  {
    model,
    annotation,
  }: {
    model: TextAnnotationModel;
    annotation: Pick<AnnotationDraw, "annotationUuid">;
  },
  {
    event,
    mouseEvent,
  }: { event: AnnotationEventType; mouseEvent?: MouseEvent },
  additionalData = {},
) => {
  const fullAnnotation = model.getAnnotation(annotation.annotationUuid);
  model.config.onEvent({
    mouseEvent,
    event,
    data: {
      annotation: fullAnnotation,
      ...additionalData,
    },
  });

  return fullAnnotation;
};
