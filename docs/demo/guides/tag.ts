import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";

export const RenderTag = (id: string) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      defaultRender: "underline",
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
