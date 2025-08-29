import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { TextAdapter } from "../adapter/text";
import { Debugger } from "../utils/debugger";
import { EventListener } from "../events/event.listener";
import { AnnotationAdapter } from "@ghentcdh/annotated-text";

export const createAnnotationModel = (
  text: string,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
  eventListener: EventListener,
): TextAnnotationModel => {
  Debugger.debug(`Use lineadapter`, textAdapter.name);
  const lines = textAdapter.parse(text);
  const annotationModel = new TextAnnotationModelImpl(
    lines,
    eventListener ?? new EventListener(),
  );
  annotationModel.textDirection = textAdapter.textDirection;
  annotationAdapter.setText(text);

  return annotationModel;
};
