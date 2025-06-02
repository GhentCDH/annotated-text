import { AnnotationDraw, TextAnnotationModel } from "../annotation.model";
import { AnnotationEventType } from "../events";

export type AnnotationMetadata = () => {
  annotation: AnnotationDraw;
  model: TextAnnotationModel;
};

export const sendEvent = (
  eventMetadata: AnnotationMetadata,
  event: AnnotationEventType,
  mouseEvent: MouseEvent,
) => {
  const { annotation, model } = eventMetadata();
  const fullAnnotation = model.getAnnotation(annotation.annotationUuid);

  model.config.onEvent({
    mouseEvent,
    event,
    data: {
      annotation: fullAnnotation,
    },
  });

  return fullAnnotation;
};
