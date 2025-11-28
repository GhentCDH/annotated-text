import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextAnnotation,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";

const annotations = [
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

const text = `Lorem ipsum dolor sit amet, 
consectetuer adipiscing elit. 
Aenean commodo ligula eget dolor. Aenean massa. 
Cum sociis natoque penatibus et 
magnis dis parturient montes, nascetur ridiculus mus.`;

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
