import {
  clearAnnotatedTextCache,
  createAnnotatedText,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";
import { DemoAnnotation, DemoAnnotationConfig } from "../data/data.types";

const annotations = [
  {
    start: 11,
    end: 20,
    color: annotationColors["2"],
    target: "underline",
    label: "gts",
    id: "1",
  },
  {
    start: 42,
    end: 51,
    color: annotationColors["3"],
    target: "highlight",
    label: "gts",
    id: "2",
  },
  {
    start: 63,
    end: 90,
    color: annotationColors["7"],
    target: "gutter",
    label: "gts",
    id: "3",
  },
] as DemoAnnotation[];

const text = `This is an underline annotation
this is a highlight annotation
this is a gutter annotation`;

export const customAnnotationRender = (id_default: string) => {
  clearAnnotatedTextCache();
  const activeAnnotations = [];

  createAnnotatedText(id_default, {
    annotation: DemoAnnotationConfig,
  })
    .setText(text)
    .setAnnotations(annotations)
    .highlightAnnotations(activeAnnotations);
};
