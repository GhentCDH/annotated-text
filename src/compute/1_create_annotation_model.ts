import { v4 as uuidv4 } from "uuid";
import { merge } from "lodash-es";
import {
  TextAnnotation,
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
  const lineMap: Map<number, TextLine> = new Map();
  const lineAnnotationMap: Map<number, TextAnnotation[]> = new Map();
  const lineGutterMap: Map<number, TextAnnotation[]> = new Map();
  // const gutters: Record<number, AnnotatedGutter> = {};

  lines?.forEach((line, lineNumber) => {
    const textLine = { ...line, lineNumber, uuid: uuidv4() } as TextLine;
    lineMap.set(lineNumber, textLine);
    lineAnnotationMap.set(lineNumber, []);

    textLines.push(textLine);
    lineGutterMap.set(lineNumber, []);
  });

  return new TextAnnotationModelImpl(
    merge(DefaultConfig, config),
    textLines,
    lineAnnotationMap,
    lineGutterMap,
  );
};
