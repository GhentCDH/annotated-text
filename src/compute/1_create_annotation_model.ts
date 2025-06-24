import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { DefaultLineAdapter, LineAdapter } from "../adapter/line";
import { Debugger } from "../utils/debugger";
import { EventListener } from "../events/event.listener";

export const createAnnotationModel = <LINE>(
  lines: LINE,
  lineAdapter?: LineAdapter<LINE>,
  eventListener?: EventListener,
): TextAnnotationModel => {
  // const gutters: Record<number, AnnotatedGutter> = {};
  if (!lineAdapter) {
    console.warn("No lineAdapter provided, using DefaultLineAdapter");
    lineAdapter = DefaultLineAdapter() as LineAdapter<LINE>;
  }

  Debugger.debug(`Use lineadapter`, lineAdapter.name);

  const annotationModel = new TextAnnotationModelImpl(
    lineAdapter.parse(lines),
    eventListener ?? new EventListener(),
  );
  annotationModel.textDirection = lineAdapter.textDirection;

  return annotationModel;
};
