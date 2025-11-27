import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextAnnotation,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";

const annotations = [
  {
    start: 0,
    end: 10,
    target: "highlight",
    color: annotationColors["1"],
    id: "cw1",
  },
  {
    start: 0,
    end: 20,
    target: "highlight",
    color: annotationColors["1"],
    id: "cw2",
  },
  {
    start: 0,
    end: 5,
    target: "highlight",
    color: annotationColors["1"],
    id: "cw3",
  },
];

const _annotations = [
  {
    start: 90,
    end: 98,
    target: "underline",
    color: annotationColors["1"],
    id: "cw1",
  },
  {
    start: 20,
    end: 60,
    target: "underline",
    color: annotationColors["5"],
    id: "cw5",
  },
  {
    start: 49,
    end: 60,
    target: "highlight",
    color: annotationColors["2"],
    id: "cw2",
  },
  {
    start: 87,
    end: 97,
    target: "underline",
    color: annotationColors["3"],
    id: "cw3",
  },
  {
    start: 95,
    end: 100,
    target: "highlight",
    color: annotationColors["4"],
    id: "cw4",
  },
  {
    start: 101,
    end: 104,
    target: "highlight",
    color: annotationColors["4"],
    id: "cw6",
  },
] as any as TextAnnotation[];

const text = `This is a text with custom weights
This line has annotations with no weights
The red annotation has a weight of 2 the other have a null weight`;

export const customWeights = (id: string) => {
  clearAnnotatedTextCache();
  createAnnotatedText(id, {
    annotation: {
      render: {
        renderFn: (annotation: any) => annotation.target,
      },
      tagConfig: {
        enabled: true,
        tagFn: (a) => a.id,
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations);
};
