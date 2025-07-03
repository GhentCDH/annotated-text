import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { TextAdapter } from "../adapter/text";
import { Debugger } from "../utils/debugger";
import { EventListener } from "../events/event.listener";

export const createAnnotationModel = (
  text: string,
  textAdapter: TextAdapter,
  eventListener: EventListener,
): TextAnnotationModel => {
  Debugger.debug(`Use lineadapter`, textAdapter.name);
  const lines = textAdapter.parse(text);

  const annotationModel = new TextAnnotationModelImpl(
    lines,
    eventListener ?? new EventListener(),
  );
  annotationModel.textDirection = textAdapter.textDirection;

  return annotationModel;
};
