import {
  Annotation,
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";

const annotations = [
  {
    start: 2,
    end: 3,
    color: annotationColors["2"],
    target: "text",
    label: "gts",
    id: "1",
  },
  {
    start: 24,
    end: 27,
    color: annotationColors["3"],
    target: "text",
    label: "gts",
    id: "2",
  },
  {
    start: 55,
    end: 64,
    color: annotationColors["4"],
    target: "text",
    label: "gts",
    id: "3",
  },
] as Annotation[];

const text = `1 character selection
3 character selection with
Emoji 😀 test 🎉 content
`;

export const createDifferentAnnotationRenders = (
  id_default: string,
  id_underline: string,
) => {
  clearAnnotatedTextCache();
  const activeAnnotations = [];
  const selectedAnnotations = [];

  createAnnotatedText(id_default, {
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
