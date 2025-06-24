import { cloneDeep, merge } from "lodash-es";
import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { AnnotationConfig, DefaultConfig } from "./model/annotation.config";
import { DefaultLineAdapter, LineAdapter } from "../adapter/line";
import { Debugger } from "../utils/debugger";
import { EventListener } from "../events/event.listener";

export const createAnnotationModel = <LINE>(
  config: Partial<AnnotationConfig>,
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
    merge(cloneDeep(DefaultConfig), config),
    lineAdapter.parse(lines),
    eventListener ?? new EventListener(),
  );
  annotationModel.textDirection = lineAdapter.textDirection;

  return annotationModel;
};
