import {
  clearAnnotatedTextCache,
  createAnnotatedText,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";

const annotations = [
  {
    start: 90,
    end: 98,
    color: "red",
    target: "text",
    label: "weight 2",
    color: annotationColors["1"],
    id: "cw1",
    weight: 2,
  },
  {
    start: 49,
    end: 60,
    color: "blue",
    target: "text",
    color: annotationColors["2"],
    id: "cw2",
    weight: null,
  },
  {
    start: 87,
    end: 97,
    color: "green",
    target: "text",
    color: annotationColors["3"],
    id: "cw3",
    weight: null,
  },
  {
    start: 95,
    end: 100,
    color: "green",
    target: "text",
    color: annotationColors["4"],
    id: "cw4",
    weight: null,
  },
];

const text = `This is a text with custom weights
This line has annotations with no weights
The red annotation has a weight of 2 the other have a null weight`;

export const customWeights = (id: string) => {
  clearAnnotatedTextCache();
  createAnnotatedText(id, {
    annotation: {
      tagConfig: {
        enabled: true,
        tagFn: (annotation) => annotation.label ?? "",
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations);
};
