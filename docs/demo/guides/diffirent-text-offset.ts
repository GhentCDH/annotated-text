/* eslint-disable no-console */
import { createAnnotatedText, TextLineAdapter, WordSnapper } from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";
import { DemoAnnotation, DemoAnnotationConfig } from "../data/data.types";

const annotations = [
  {
    start: 10,
    end: 29,
    label: "Subject phrase",
    color: annotationColors["2"],
    id: "anno1",
  },
  {
    start: 30,
    end: 53,
    label: "Action and object",
    color: annotationColors["3"],
    id: "anno2",
  },
] as DemoAnnotation[];

const text = `The quick brown fox jumps over the lazy dog near the riverbank at dawn.`;

export const createDifferentTextOffset = (id: string, textOffset: number) => {
  createAnnotatedText(id, {
    text: { textOffset },
    annotation: {
      ...DemoAnnotationConfig,
      edit: true,
      tagConfig: {
        enabled: true,
        tagFn: (annotation) => annotation.label,
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations);

  return annotations;
};

export const createDifferentTextOffsetWordsnapper = (
  id: string,
  textOffset: number,
) => {
  createAnnotatedText(id, {
    text: { textOffset },
    annotation: {
      ...DemoAnnotationConfig,
      edit: true,
      tagConfig: {
        enabled: true,
        tagFn: (annotation) => annotation.label,
      },
      snapper: new WordSnapper(),
    },
  })
    .setText(text)
    .setAnnotations(annotations);

  return annotations;
};

export const createDifferentTextOffsetLines = (
  id: string,
  textOffset: number,
) => {
  createAnnotatedText(id, {
    text: TextLineAdapter({ textOffset }),
    annotation: {
      ...DemoAnnotationConfig,
      tagConfig: {
        enabled: true,
        tagFn: (annotation) => annotation.label,
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations);
};
