import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";

export const editAndCreateDemo = (id: string) => {
  clearAnnotatedTextCache();
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      ...greekText.annotationConfig,
      edit: true,
      create: true,
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
