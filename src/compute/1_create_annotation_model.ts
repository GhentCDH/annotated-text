import { v4 as uuidv4 } from "uuid";
import { cloneDeep, merge } from "lodash-es";
import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
  TextLine,
} from "./annotation.model";
import { AnnotationConfig, DefaultConfig } from "./model/annotation.config";
import { Line } from "../index";

export const createAnnotationModel = (
  config: Partial<AnnotationConfig>,
  lines: Line[],
): TextAnnotationModel => {
  const textLines: TextLine[] = [];
  // const gutters: Record<number, AnnotatedGutter> = {};

  lines?.forEach((line, lineNumber) => {
    const textLine = { uuid: uuidv4(), lineNumber, ...line } as TextLine;

    textLines.push(textLine);
  });

  return new TextAnnotationModelImpl(
    merge(cloneDeep(DefaultConfig), config),
    textLines,
  );
};
