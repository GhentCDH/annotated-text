import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { isIntersection } from "./utils/intersect";
import { TextAdapter } from "../adapter/line";
import { Debugger } from "../utils/debugger";
import { EventListener } from "../events/event.listener";

export const createAnnotationModel = (
  text: string,
  textAdapter: TextAdapter,
  eventListener: EventListener,
): TextAnnotationModel => {
  Debugger.debug(`Use lineadapter`, textAdapter.name);
  let lines = textAdapter.parse(text);

  if (textAdapter.limit)
    lines = lines.filter((line) => isIntersection(line, textAdapter.limit));

  const annotationModel = new TextAnnotationModelImpl(
    lines,
    eventListener ?? new EventListener(),
  );
  annotationModel.textDirection = textAdapter.textDirection;

  return annotationModel;
};
