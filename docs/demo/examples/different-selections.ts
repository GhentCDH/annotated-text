import {
  Annotation,
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";
import { annotationColors } from "../data/const";

const annotations = [
  {
    start: 5,
    end: 10,
    color: annotationColors["2"],
    target: "text",
    label: "gts",
    id: "1",
  },
  {
    start: 40,
    end: 41,
    color: annotationColors["3"],
    target: "text",
    label: "gts",
    id: "2",
  },
  {
    start: 105,
    end: 106,
    color: annotationColors["7"],
    target: "text",
    label: "gts",
    id: "3",
  },
] as Annotation[];

export const createDifferentSelections = (
  id_default: string,
  id_underline: string,
) => {
  clearAnnotatedTextCache();
  const text = greekText.text.substring(0, 250);
  const activeAnnotations = [];
  const selectedAnnotations = [];

  createAnnotatedText(id_default, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
    },
  })
    .setText(text)
    .setAnnotations(annotations)
    .highlightAnnotations(activeAnnotations);

  createAnnotatedText(id_underline, {
    text: TextLineAdapter(),
    annotation: {
      defaultRender: "underline",
      edit: true,
      create: true,
    },
  })
    .setText(text)
    .setAnnotations(annotations)
    .highlightAnnotations(activeAnnotations)
    .selectAnnotations(selectedAnnotations);
};
