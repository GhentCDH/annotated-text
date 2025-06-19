import { AnnotationDraw, TextAnnotationModel } from "../annotation.model";
import { AnnotationEventType } from "../events";

export const sendEvent = (
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
