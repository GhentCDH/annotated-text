import { AnnotationAdapter } from "@ghentcdh/annotated-text";
import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from "./annotation.model";
import { TextAdapter } from "../adapter/text";
import { Debugger } from "../utils/debugger";

export const createAnnotationModel = (
  text: string,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
): TextAnnotationModel => {
  Debugger.debug(`Use lineadapter`, textAdapter.name);
  const lines = textAdapter.parse(text);
  const annotationModel = new TextAnnotationModelImpl(
    lines,
    annotationAdapter.renderInstance,
  );
  annotationModel.textDirection = textAdapter.textDirection;
  annotationAdapter.setText(text, textAdapter.textOffset);

  return annotationModel;
};
