import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { PlainTextAdapter, TextAdapter } from "../adapter/line";
import { Debugger } from "../utils/debugger";
import { EventListener } from "../events/event.listener";

export const createAnnotationModel = (
  text: string,
  lineAdapter?: TextAdapter,
  eventListener?: EventListener,
): TextAnnotationModel => {
  // const gutters: Record<number, AnnotatedGutter> = {};
  if (!lineAdapter) {
    console.warn("No lineAdapter provided, using PlainTextAdapter");
    lineAdapter = PlainTextAdapter() as TextAdapter;
  }

  Debugger.debug(`Use lineadapter`, lineAdapter.name);

  const annotationModel = new TextAnnotationModelImpl(
    lineAdapter.parse(text),
    eventListener ?? new EventListener(),
  );
  annotationModel.textDirection = lineAdapter.textDirection;

  return annotationModel;
};
